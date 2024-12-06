<script lang="ts">
    import TTMDatapoint from '$lib/components/TTM-Experiment-Datapoint.svelte';
    import TTMChat from '$lib/components/TTM-Chat.svelte';
    import TTMQuestions from '$lib/components/TTM-Questions.svelte';
    import type {
        TChatMessage,
        TDatapoint,
        TQuestionResult,
        TDatapointResult,
        TTestOrTeaching,
    } from '$lib/types';
    import backend from '$lib/backend';
    import type {PageData} from '../';
    import {base} from '$app/paths';
    import {fade} from 'svelte/transition';
    import ShowCorrectPopup from '$lib/components/ShowCorrectPopup.svelte';
    import {writable} from "svelte/store";

    let totalAnswered = 0; // Total number of answered datapoints
    let correctAnswered = 0; // Number of correct answers

    /**
     * Data provided by the `+page.ts` load function in the same folder
     */
    export let data: PageData;
    //-----------------------------------------------------------------


    /**
     * Datapoint relevant
     */
    let current_datapoint: TDatapoint = data.datapoint;
    let current_prediction: string = data.datapoint.current_prediction;
    let datapoint_answer_selected: string | null = null;
    let feature_tooltips = data.feature_tooltips;
    let feature_units = data.feature_units;
    let true_label: string = data.datapoint.true_label;
    let ml_label_prediction: string = data.datapoint.ml_prediction;
    let user_id: string = data.user_id;
    let new_datapoint: TDatapoint;
    //-----------------------------------------------------------------
    let experiment_phase: TTestOrTeaching = 'teaching';
    let study_group = 'interactive';
    let prediction_choices = data.prediction_choices;
    let wasCorrect = false;
    /**
     * Chat relevant
     */
    let messages: TChatMessage[] = [data.datapoint.initial_message];
    let initial_message: TChatMessage;

    let feature_names = data.feature_names;
    let {feature_questions, general_questions}: TQuestionResult = data.questions;

    delete data.datapoint.true_label;
    delete data.datapoint.ml_prediction;

    export const displayCorrectPopup = writable(false);

    displayCorrectPopup.subscribe(value => {
        $displayCorrectPopup = value;
    });

    function createAndPushMessage(text: string,
                                  isUser: boolean,
                                  feedback: boolean,
                                  id: number,
                                  feature_id?: number,
                                  followup?: []) {
        messages.push({
            text: text,
            isUser: isUser,
            feedback: feedback,
            id: id,
            feature_id: feature_id,
            followup: followup
        });
    }

    async function submitQuestion(e: any) {
        // Get Information
        let questionId: string = e.detail.questionId;
        let featureName: string = e.detail.feature;
        let question: string = e.detail.question;

        // Get correct question id and feature id
        let generalQuestion = general_questions.find(q => q.q_id === questionId);
        let featureQuestion = feature_questions.find(q => q.q_id === questionId);

        // Create full question to log and show to user
        let full_question = '';
        if (generalQuestion) {
            full_question = generalQuestion.question.replace('[current prediction]', '<b>' + current_prediction + '</b>');
        } else if (featureQuestion && featureName) {
            full_question = question;
        }

        // Log and show
        if (full_question) {
            const details = {
                question: full_question,
                question_id: questionId
            };
            fetch(`${base}/api/log_event`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user_id,
                    event_source: 'teaching',
                    event_type: 'question',
                    details: details,
                })
            });

            // Push user question to chat
            createAndPushMessage(full_question, true, false, questionId);
            messages = messages;

            let responseMessage: TChatMessage;
            setTimeout(async () => {
                await backend.xai(user_id).get_question_selection_response(questionId, featureName)
                    .then(response => response.json())
                    .then(data => {
                        responseMessage = data;
                    });
                messages.push(responseMessage);
                messages = messages;
            }, 700);
        }
    }

    function setNewCurrentDatapoint() {
        messages = [initial_message];
        true_label = <string>new_datapoint.true_label;
        ml_label_prediction = <string>new_datapoint.ml_prediction;
        delete new_datapoint.true_label;
        delete new_datapoint.ml_prediction;
        current_datapoint = new_datapoint;
        datapoint_answer_selected = null; // Reset selected answer
    }

    function handleClose() {
        displayCorrectPopup.set(false);
        proceedToNextPhase();
    }

    async function getDatapoint(type: TTestOrTeaching) {
        let endpoint = '';
        switch (type) {
            case 'intro-test':
                endpoint = 'get_intro_test_datapoint';
                break;
            case 'teaching':
                endpoint = 'get_train_datapoint';
                break;
            case 'test':
                endpoint = 'get_test_datapoint';
                break;
            case 'final-test':
                endpoint = 'get_final_test_datapoint';
                break;
        }

        if (type === 'teaching') {
            let result = await (await backend.xai(user_id).get_train_datapoint()).json() as TDatapointResult;
            initial_message = result.initial_message;
            current_prediction = result.current_prediction;
            new_datapoint = result;
        } else {
            ({current_prediction, initial_message, ...new_datapoint} = await (
                await backend.xai(user_id)[endpoint]()
            ).json());
        }
    }

    async function handleNext(e: any) {

        if (experiment_phase === 'test') {
            wasCorrect = ml_label_prediction === datapoint_answer_selected;

            // Update total and correct counters
            totalAnswered++;
            if (wasCorrect) {
                correctAnswered++;
            }

            // Show the popup if answer selected
            if (datapoint_answer_selected !== "I don't know") {
                displayCorrectPopup.set(true); // Show popup
                return; // Wait for the popup to close before continuing
            }
        }

        // If no popup is needed, proceed directly
        proceedToNextPhase();
    }

    async function proceedToNextPhase() {
        let next_phase = experiment_phase;

        if (experiment_phase === 'test') {
            next_phase = 'teaching';
        } else if (experiment_phase === 'teaching') {
            next_phase = 'test';
        }

        await getDatapoint(next_phase);
        setNewCurrentDatapoint();
        experiment_phase = next_phase;
    }

    function handleFeedbackButtonClick(event) {
        const {buttonType} = event.detail;
        const {messageId} = event.detail;
        const {user_comment} = event.detail;
        const details = {
            buttonType: buttonType,
            question_id: messageId,
            user_comment: user_comment
        };
        fetch(`${base}/api/log_event`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user_id,
                event_source: 'teaching',
                event_type: 'feedback',
                details: details,
            })
        });
    }
</script>

{#if $displayCorrectPopup}
    <ShowCorrectPopup
        isCorrect={wasCorrect}
        correctAnswered={correctAnswered}
        totalAnswered={totalAnswered}
        on:close={handleClose}
    />
{/if}

<div class={experiment_phase === 'teaching' ? "col-start-1 col-end-2" : "col-start-2 col-end-3"}>
    <TTMDatapoint
            datapoint={current_datapoint}
            feature_tooltips={feature_tooltips}
            bind:selected_prediction={datapoint_answer_selected}
            experimentPhase={experiment_phase}
            feature_names={feature_names}
            feature_units={feature_units}
            interactiveOrStatic={study_group}
            user_id={user_id}
            instance_prediction={ml_label_prediction}
            prediction_choices={prediction_choices}
            on:next={handleNext}
    />
</div>
{#if datapoint_answer_selected}
    {#if experiment_phase === 'teaching'}
        <div
                class="col-start-2 col-end-3 overflow-y-scroll"
                transition:fade={{ delay: 250, duration: 500 }}
        >
            <TTMChat {messages} {study_group} user_input={false}
                     on:feedbackButtonClick={handleFeedbackButtonClick}
                     on:next={handleNext}
            />
        </div>
        <div class="col-start-3 col-end-4"
             transition:fade={{ delay: 250, duration: 500 }}>
            <TTMQuestions
                    {feature_questions}
                    {general_questions}
                    {current_prediction}
                    feature_questions_dropdown={feature_names}
                    on:submit={submitQuestion}
                    on:next={handleNext}
            />
        </div>
    {/if}
{/if}



