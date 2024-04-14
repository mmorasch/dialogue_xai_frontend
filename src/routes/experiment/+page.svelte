<script lang="ts">
    import TTMDatapoint from '$lib/components/TTM-Experiment-Datapoint.svelte';
    import TTMChat from '$lib/components/TTM-Chat.svelte';
    import TTMQuestions from '$lib/components/TTM-Questions.svelte';
    import type {
        TDatapoint,
        TQuestionResult,
        TTestOrTeaching,
        StaticReport, TDatapointResult
    } from '$lib/types';
    import backend from '$lib/backend';
    import {fade} from 'svelte/transition';
    import type {PageData} from '../../../../.svelte-kit/types/src/routes';
    import {PUBLIC_TEACH_TEST_CYCLES, PUBLIC_END_TEST_CYCLES, PUBLIC_DATASET_NAME} from '$env/static/public';

    import {goto} from '$app/navigation';
    import {base} from '$app/paths';
    import StaticExplanationReport from '$lib/components/StaticExplanationReport.svelte';
    import {writable} from "svelte/store";
    import SelfEvalPopup from '$lib/components/Self-Evaluation-Popup.svelte';
    import IntroDonePopup from '$lib/components/Intro-Done-Popup.svelte';
    import Spinner from '$lib/components/Spinner.svelte';

    /**
     * Data provided by the `+page.ts` load function in the same folder
     */
    export let data: PageData;
    export const selfAssesmentPopupVisible = writable(false);
    export const introPopupVisible = writable(false);

    //-----------------------------------------------------------------

    selfAssesmentPopupVisible.subscribe(value => {
        $selfAssesmentPopupVisible = value;
    });

    introPopupVisible.subscribe(value => {
        $introPopupVisible = value;
    });

    function handleConfirm() {
        selfAssesmentPopupVisible.set(false);
        introPopupVisible.set(false);
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
    let messages: { feedback: boolean; text: string; id: number; isUser: boolean }[] = [{
        isUser: false,
        feedback: false,
        text: data.initial_prompt,
        id: 1000
    }];

    let isLoading = false;

    //-----------------------------------------------------------------

    /**
     * Test relevant
     */
    let cycles_completed = 0;
    let transition_done: boolean;
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
    let experiment_phase: TTestOrTeaching = 'intro-test';
    let true_label: string = data.datapoint.true_label;

    delete data.datapoint.true_label;

    let new_datapoint: TDatapoint;
    let initial_prompt = '';

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
        // Check if clicked twice
        if (isLoading) {
            return;
        }

        isLoading = true;
        transition_done = false;
        let next_phase = experiment_phase;
        if (experiment_phase !== 'teaching') {
            datapoint_count++;
            cycles_completed++;
        }

        // Check if intro is over. Intro test has same number of cycles as end test
        if (experiment_phase === 'intro-test' && datapoint_count > parseInt(PUBLIC_END_TEST_CYCLES)) {
            // After completing pre-test, switch to teaching
            cycles_completed = 0; // Reset for teaching cycle
            datapoint_count = 1; // Reset for teaching cycle
            next_phase = 'teaching';
            transition_done = true;
            introPopupVisible.set(true);
        }

        // Check if all cycles (teach-test cycles + end-test cycles) are completed
        if (cycles_completed >= parseInt(PUBLIC_TEACH_TEST_CYCLES) + parseInt(PUBLIC_END_TEST_CYCLES)) {
            goto(`${base}/exit?user_id=${user_id}&sg=${study_group}`);
            return;
        }

        if (experiment_phase === 'test') {
            if (cycles_completed == parseInt(PUBLIC_TEACH_TEST_CYCLES)) {
                // If teach-test cycles are complete, move to final-test
                selfAssesmentPopupVisible.set(true);
                next_phase = 'final-test';
                datapoint_count = 1; // Reset datapoint count for final-test phase
                transition_done = true;
            } else {
                // Switch to teaching after a test, if not yet completed all teach-test cycles
                next_phase = 'teaching';
                transition_done = true;
            }
        } else if (experiment_phase === 'teaching' && !transition_done) {
            // After teaching, if not coming from test_intro, always switch to testing in the next cycle
            next_phase = 'test';
        }

        // Fetch the appropriate datapoint based on the current phase
        await getDatapoint(next_phase);
        setNewCurrentDatapoint();
        experiment_phase = next_phase;
        logNextEvent();
        isLoading = false;
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
            initial_prompt = result.initial_prompt;
            current_prediction = result.current_prediction;
            static_report = result.static_report;
            new_datapoint = result;
        } else {
            ({current_prediction, initial_prompt, ...new_datapoint} = await (
                await backend.xai(user_id)[endpoint]()
            ).json());
        }
    }

    function setNewCurrentDatapoint() {
        messages = [{isUser: false, feedback: false, text: initial_prompt, id: 1000}];
        true_label = <string> new_datapoint.true_label;
        delete new_datapoint.true_label;
        current_datapoint = new_datapoint;
        datapoint_answer_selected = null; // Reset selected answer
    }

    function logNextEvent() {
        const details = {datapoint_count_new: datapoint_count};
        fetch(`${base}/api/log_event`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user_id, event_source: experiment_phase, event_type: 'handleNext', details})
        });
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


{#if $introPopupVisible}
    <IntroDonePopup {user_id} {feature_questions} {general_questions} {study_group} on:confirm={handleConfirm}/>
{:else if $selfAssesmentPopupVisible}
    <SelfEvalPopup {user_id} {feature_questions} {general_questions} {study_group} on:confirm={handleConfirm}/>
{:else}
    {#if isLoading}
        <Spinner />
    {/if}
    <div class={experiment_phase === 'teaching' ? "col-start-1 col-end-2" : "col-start-2 col-end-3"}>
        <TTMDatapoint
                datapoint={current_datapoint}
                feature_tooltips={feature_tooltips}
                bind:selected_prediction={datapoint_answer_selected}
                bind:datapoint_count
                experimentPhase={experiment_phase}
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
        {#if experiment_phase === 'teaching'}
            {#if study_group === 'static'}
                <div
                        class="col-start-2 col-end-4 overflow-y-scroll"
                        transition:fade={{ delay: 250, duration: 500 }}
                >
                    <StaticExplanationReport
                            static_report={static_report}
                            true_label={true_label}
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
                            feature_questions_dropdown={feature_names}
                            on:submit={submitQuestion}
                            on:next={handleNext}
                    />
                </div>
            {/if}
        {/if}
    {/if}
{/if}

