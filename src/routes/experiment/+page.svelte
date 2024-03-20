<script lang="ts">
    import TTMDatapoint from '$lib/components/TTM-Experiment-Datapoint.svelte';
    import TTMChat from '$lib/components/TTM-Chat.svelte';
    import TTMQuestions from '$lib/components/TTM-Questions.svelte';
    import type {
        TChatMessage,
        TDatapoint,
        TQuestionResult,
        TTestOrTeaching,
        StaticReport
    } from '$lib/types';
    import backend from '$lib/backend';
    import {fade} from 'svelte/transition';
    import type {PageData} from '../../../../.svelte-kit/types/src/routes';
    import {PUBLIC_TEACH_TEST_CYCLES, PUBLIC_END_TEST_CYCLES} from '$env/static/public';

    import {goto} from '$app/navigation';
    import {base} from '$app/paths';
    import StaticExplanationReport from '$lib/components/StaticExplanationReport.svelte';
    import {writable} from "svelte/store";
    import Popup from '$lib/components/Self-Evaluation-Popup.svelte';

    /**
     * Data provided by the `+page.ts` load function in the same folder
     */
    export let data: PageData;
    export const popupVisible = writable(false);

    //-----------------------------------------------------------------

    popupVisible.subscribe(value => {
        $popupVisible = value;
    });

    function handleConfirm() {
        popupVisible.set(false);
    }

    /**
     * Datapoint relevant
     */
    let current_datapoint: TDatapoint = data.datapoint;
    let current_prediction: string = data.current_prediction;
    let datapoint_count = 1;
    let datapoint_answer_selected: string | null = null;
    let feature_tooltips = data.feature_tooltips;
    let feature_units = data.feature_units;
    let prediction_choices = data.prediction_choices;

    //-----------------------------------------------------------------

    /**
     * Chat relevant
     */
    let messages: TChatMessage[] = [{isUser: false, feedback: false, text: data.initial_prompt, id: 1000}];

    //-----------------------------------------------------------------

    /**
     * Test relevant
     */
    let cycles_completed = 0;
    //-----------------------------------------------------------------
    /**
     * Static Report relevant
     */
    let static_report: StaticReport = data.static_report;
    //-----------------------------------------------------------------

    let {feature_questions, general_questions}: TQuestionResult = data.questions;
    let feature_names = data.feature_names;
    let user_id: string = data.user_id;
    let study_group = data.study_group;
    let test_or_teaching: TTestOrTeaching = 'teaching';
    let true_label: string = data.datapoint.true_label;

    delete data.datapoint.true_label;

    function logEvent(details: any) {
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
    }

    function createAndPushMessage(text: string, isUser: boolean, feedback: boolean, id: number) {
        messages.push({
            text: text,
            isUser: isUser,
            feedback: feedback,
            id: id,
            followup: []
        });
    }

    async function submitQuestion(e: any) {
        let questionId: number = parseInt(e.detail.questionId);
        let feature: number = parseInt(e.detail.feature);

        let generalQuestion = general_questions.find(q => q.id === questionId);
        let featureQuestion = feature_questions.find(q => q.id === questionId);
        let featureName = feature_names.find(f => f.id === feature);

        let full_question = '';
        if (generalQuestion) {
            full_question = generalQuestion.question.replace('[current prediction]', '<b>' + current_prediction + '</b>');
        } else if (featureQuestion && featureName) {
            full_question = featureQuestion.question.replace('[feature selection]', featureName.feature_name);
        }

        if (full_question) {
            const details = {
                datapoint_count: datapoint_count,
                question: full_question,
                question_id: questionId
            };
            logEvent(details);

            createAndPushMessage(full_question, true, false, questionId);
            messages = messages;

            setTimeout(async () => {
                let response = await backend.xai(user_id).get_response(questionId, feature);
                let text = await response.text();

                createAndPushMessage(text, false, true, questionId);
                messages = messages;
            }, 700);

        }
    }

    async function handleNext(e: any) {
        /**
         * Change from test to teach or vice versa
         */
        let id: string = '';
        let initial_prompt: string = '';
        let new_datapoint: TDatapoint;

        if (cycles_completed === parseInt(PUBLIC_TEACH_TEST_CYCLES) + parseInt(PUBLIC_END_TEST_CYCLES)) {
            if (study_group === 'static') {
                goto(`${base}/exit/feedback?user_id=${user_id}`);
            } else {
                goto(`${base}/exit?user_id=${user_id}`);
            }
        }

        if (test_or_teaching === 'test') {
            // Change to TRAIN CASE
            datapoint_count++;
            cycles_completed++;

            // Check if we have completed the teach-test cycles
            if (cycles_completed === parseInt(PUBLIC_TEACH_TEST_CYCLES)) {
                // Show intermediate screen
                popupVisible.set(true);
                // After showing the intermediate screen, switch to test
                test_or_teaching = 'final-test';
                // reset datapoint count
                datapoint_count = 0;
            } else {
                ({id, current_prediction, initial_prompt, static_report, ...new_datapoint} = await (
                    await backend.xai(user_id).get_train_datapoint()
                ).json());
                test_or_teaching = 'teaching';
            }
        } else if (test_or_teaching === 'teaching') {
            // Log timing of next button for teaching
            const details = {
                datapoint_count: datapoint_count,
            };
            fetch(`${base}/api/log_event`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user_id,
                    event_source: 'teaching',
                    event_type: 'handleNext',
                    details: details,
                })
            });

            // Change to Test CASE
            ({id, current_prediction, initial_prompt, ...new_datapoint} = await (
                await backend.xai(user_id).get_test_datapoint()
            ).json());

            test_or_teaching = 'test';
        }

        // If we are in the final test
        if (test_or_teaching === 'final-test') {
            // final-test
            datapoint_count++;
            // Log timing of next button for testing
            const details = {
                datapoint_count: datapoint_count,

            };
            fetch(`${base}/api/log_event`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user_id,
                    event_source: 'teaching',
                    event_type: 'handleNext',
                    details: details,
                })
            });
            ({id, current_prediction, initial_prompt, ...new_datapoint} = await (
                await backend.xai(user_id).get_test_datapoint()
            ).json());
            cycles_completed++;
        }

        messages = [{isUser: false, feedback: false, text: initial_prompt, id: 1000}];
        delete new_datapoint.true_label;
        current_datapoint = new_datapoint;

        //-----------------------------------------------------------------
        datapoint_answer_selected = null;
    }

    function handleFeedbackButtonClick(event) {
        const {buttonType} = event.detail;
        const {messageId} = event.detail;
        const {user_comment} = event.detail;
        const details = {
            datapoint_count: datapoint_count,
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

{#if $popupVisible}
    <Popup {user_id} {feature_questions} {general_questions} {study_group} on:confirm={handleConfirm}/>
{:else}
    <div class={test_or_teaching === 'teaching' ? "col-start-1 col-end-2" : "col-start-2 col-end-3"}>
        <TTMDatapoint
                data={current_datapoint}
                feature_tooltips={feature_tooltips}
                bind:selected_prediction={datapoint_answer_selected}
                bind:datapoint_count
                testOrTeaching={test_or_teaching}
                feature_names={feature_names}
                feature_units={feature_units}
                interactiveOrStatic={study_group}
                user_id={user_id}
                true_label={true_label}
                prediction_choices={prediction_choices}
                on:next={handleNext}
        />
    </div>
    {#if datapoint_answer_selected}
        {#if test_or_teaching === 'teaching'}
            {#if study_group === 'static'}
                <div
                        class="col-start-2 col-end-4 overflow-y-scroll"
                        transition:fade={{ delay: 250, duration: 500 }}
                >
                    <StaticExplanationReport
                            {static_report}
                            on:next={handleNext}
                    />
                </div>
            {:else}
                <div
                        class="col-start-2 col-end-3 overflow-y-scroll"
                        transition:fade={{ delay: 250, duration: 500 }}
                >
                    <TTMChat {messages} on:feedbackButtonClick={handleFeedbackButtonClick}/>
                </div>
                <div class="col-start-3 col-end-4"
                     transition:fade={{ delay: 250, duration: 500 }}>
                    <TTMQuestions
                            {feature_questions}
                            {general_questions}
                            {current_prediction}
                            bind:selected_prediction={datapoint_answer_selected}
                            feature_questions_dropdown={feature_names}
                            on:submit={submitQuestion}
                            on:next={handleNext}
                    />
                </div>
            {/if}
        {/if}
    {/if}
{/if}

