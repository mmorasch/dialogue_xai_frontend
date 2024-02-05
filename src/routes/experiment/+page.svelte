<script lang="ts">
    import TTMDatapoint from '$lib/components/TTM-Datapoint.svelte';
    import TTMChat from '$lib/components/TTM-Chat.svelte';
    import TTMQuestions from '$lib/components/TTM-Questions.svelte';
    import type {
        TChatMessage,
        TDatapoint,
        TQuestionResult,
        TTestOrTeaching,
        StaticReport
    } from '$lib/types';
    import backend from '$lib/backend_pg';
    import {fade} from 'svelte/transition';
    import type {PageData} from './$types';
    import {PUBLIC_TEACH_TEST_CYCLES, PUBLIC_END_TEST_CYCLES} from '$env/static/public';

    import {goto} from '$app/navigation';
    import {base} from '$app/paths';
    import StaticExplanationReport from '$lib/components/StaticExplanationReport.svelte';
    import {writable} from "svelte/store";
    import Popup from '$lib/components/Popup.svelte';

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

    let {feature_names, feature_questions, general_questions}: TQuestionResult = data.questions;
    let user_id: string = data.user_id;
    let study_group = data.study_group;
    let test_or_teaching: TTestOrTeaching = 'teaching';
    let true_label: string = data.datapoint.true_label;

    delete data.datapoint.true_label;

    async function submitQuestion(e: any) {
        let question: number = parseInt(e.detail.question);
        let feature: number = parseInt(e.detail.feature);
        let full_question = '';

        let text = ((): string => {
            for (let i = 0; i < general_questions.length; i++) {
                if (general_questions[i].id === question) {
                    full_question = general_questions[i].question.replace('[current prediction]', '<i>' + current_prediction + '</i>');
                    const details = {
                        datapoint_count: datapoint_count,
                        question: full_question,
                        question_id: question
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
                    return full_question;
                }
            }
            for (let i = 0; i < feature_questions.length; i++) {
                if (feature_questions[i].id === question) {
                    for (let j = 0; j < feature_names.length; j++) {
                        if (feature_names[j].id === feature) {
                            full_question = feature_questions[i].question.replace(/\[feature selection\]/, function (i, match) {
                                return feature_names[j].feature_name;
                            });
                            const details = {
                                datapoint_count: datapoint_count,
                                question: full_question,
                                question_id: question
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
                            return full_question;
                        }
                    }
                }
            }
            return '';
        })();

        messages.push({
            text: text,
            isUser: true,
            feedback: false,
            id: question,
        });

        messages = messages;
        backend
            .xai(user_id)
            .get_response(question, feature)
            .then((response) => {
                response.text().then((text) => {
                    messages.push({
                        text: text,
                        isUser: false,
                        feedback: true,
                        id: question,
                    });
                    setTimeout(() => {
                        messages = messages;
                    }, 600);
                });
            });
    }

    async function handleNext(e: any) {
        /**
         * Change from test to teach or vice versa
         */
        let id: string = '';
        let initial_prompt: string = '';
        let new_datapoint: TDatapoint;

        if (cycles_completed === parseInt(PUBLIC_TEACH_TEST_CYCLES) + parseInt(PUBLIC_END_TEST_CYCLES)) {
            goto(`${base}/exit?user_id=${user_id}`);
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
                    event_type: 'question',
                    details: details,
                })
            });
            ({id, current_prediction, initial_prompt, ...new_datapoint} = await (
                await backend.xai(user_id).get_test_datapoint()
            ).json());
            cycles_completed++;
        }

        messages = [{isUser: false, feedback: false, text: initial_prompt, id: 1000}];
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
            messageId: messageId,
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
    <Popup {user_id} on:confirm={handleConfirm}/>
{/if}

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
            <div class="col-auto"
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
    {:else}
        {handleNext()}
    {/if}
{/if}
