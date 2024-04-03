<script lang="ts">
    import TTMDatapoint from '$lib/components/TTM-Tool-Datapoint.svelte';
    import TTMChat from '$lib/components/TTM-Chat.svelte';
    import TTMQuestions from '$lib/components/TTM-Questions.svelte';
    import type {
        TChatMessage,
        TDatapoint,
        TQuestionResult,
        TTestOrTeaching,
    } from '$lib/types';
    import backend from '$lib/backend';
    import type {PageData} from '../../../../.svelte-kit/types/src/routes';

    import {goto} from '$app/navigation';
    import {base} from '$app/paths';
    import {writable} from "svelte/store";

    /**
     * Data provided by the `+page.ts` load function in the same folder
     */
    export let data: PageData;
    export const popupVisible = writable(false);
    export let static_report: string;

    //-----------------------------------------------------------------

    popupVisible.subscribe(value => {
        $popupVisible = value;
    });

    /**
     * Datapoint relevant
     */
    let current_datapoint: TDatapoint = data.datapoint;
    let current_prediction: string = data.current_prediction;
    let datapoint_count = 1;
    let datapoint_answer_selected: string | null = null;
    let feature_tooltips = data.feature_tooltips;
    let feature_units = data.feature_units;
    let prediction_probability = data.prediction_probability;
    let true_label: string = data.datapoint.true_label;
    let user_id: string = data.user_id;
    //-----------------------------------------------------------------

    /**
     * Chat relevant
     */
    let messages: TChatMessage[] = [{
        isUser: false,
        feedback: false,
        text: data.initial_prompt,
        id: 1000,
        followup: []
    }];

    let {feature_questions, general_questions}: TQuestionResult = data.questions;
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

        // Get the next datapoint
        ({id, current_prediction, initial_prompt, prediction_probability, ...new_datapoint} = await (
            await backend.xai(user_id).get_train_datapoint()
        ).json());

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


<div class={"col-start-1 col-end-2"}>
    <TTMDatapoint
            data={current_datapoint}
            bind:selected_prediction={datapoint_answer_selected}
            bind:datapoint_count
            feature_names={feature_names}
            feature_units={feature_units}
            feature_tooltips={feature_tooltips}
            prediction_probability={prediction_probability}
            on:next={handleNext}
    />
</div>
<div class="col-start-2 col-end-3 overflow-y-scroll">
    <TTMChat {messages} on:feedbackButtonClick={handleFeedbackButtonClick}/>
</div>
<div class="col-start-3 col-end-4">
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



