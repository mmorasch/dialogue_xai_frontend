<script lang="ts">
    import {PUBLIC_TEACH_TEST_CYCLES, PUBLIC_END_TEST_CYCLES} from '$env/static/public';
    import {ListBox, ListBoxItem} from '@skeletonlabs/skeleton';
    import Header from './Header.svelte';
    import Datapoint from './Datapoint.svelte';
    import type {TInteractiveOrStatic, TTestOrTeaching} from '$lib/types';
    import {base} from "$app/paths";
    import backend from "$lib/backend";
    import FeedbackWindow from "$lib/components/FeedbackWindow.svelte";
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    export let testOrTeaching: TTestOrTeaching;
    export let interactiveOrStatic: TInteractiveOrStatic;
    export let feature_names;
    export let prediction_choices;

    export let true_label: string;

    export let data: { [key: string]: string };
    export let feature_tooltips: { [key: string]: string };
    export let feature_units: { [key: string]: string };
    export let prediction_question =
        'What will the model predict for the current case?';


    export let teaching_intro = "";
    if (interactiveOrStatic === 'static') {
        teaching_intro = "Given the current information, guess what the model will predict. Afterward you can read the explanations to understand the prediction.";
    } else {
        teaching_intro = "Given the current information, guess what the model will predict. Afterward you can ask questions to understand the model's prediction.";
    }

    export let test_intro =
        "<b>Test your knowledge</b> about the model. Based on what you learned before, what do you think the model will predict for this case? <b>You will not receive \n" +
        "explanations this time.</b>";

    export let final_test_intro =
        "<b>Final test of your knowledge</b> about the model. Based on what you learned before, what do you think the model will predict for this case? <b>You will not receive \n" +
        "explanations this time.</b>";

    export let datapoint_count: number | null = null;

    export let user_id: string | null = null;

    // Extract values from prediction_choices dictionary to list and append "I don't know" option
    export let options = Object.values(prediction_choices).concat(["I don't know"]);

    // get event categories
    export let selected_prediction: string | null = null;


    function logPrediction() {
        // if final test, return
        if (testOrTeaching === 'final-test') {
            return;
        }
        const details = {
            datapoint_count: datapoint_count,
            prediction: selected_prediction,
            true_label: true_label
        };
        fetch(`${base}/api/log_event`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user_id,
                event_source: testOrTeaching,
                event_type: 'user_prediction',
                details: details,
            })
        });
        // Check if usser_id is not null
        if (user_id !== null && selected_prediction !== null) {
            backend.xai(user_id).set_user_prediction(selected_prediction);
        }
        if (testOrTeaching === 'test') {
            dispatch('next', null);
        }
    }

    function logFinalTestPrediction(event) {
        // Get the feedback from the event
        const {feedback} = event.detail;

        const details = {
            datapoint_count: datapoint_count,
            prediction: selected_prediction,
            true_label: true_label,
            feedback: feedback,
        };
        fetch(`${base}/api/log_event`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user_id,
                event_source: testOrTeaching,
                event_type: 'user_prediction',
                details: details,
            })
        });
        // Check if usser_id is not null
        if (user_id !== null && selected_prediction !== null) {
            backend.xai(user_id).set_user_prediction(selected_prediction);
        }
        // Dispatch next event
        dispatch('next', null);
    }
</script>


<div
        class:teaching-color={testOrTeaching === 'teaching'}
        class:testing-color={testOrTeaching === 'test'}
        class:final-testing-color={testOrTeaching === 'final-test'}
        class="inputarea h-full flex-1 overflow-y-auto shadow-[0_15px_15px_-5px_rgba(0,0,0,0.2)] mx-1.5 my-0"
>
    {#if testOrTeaching === 'test'}
        <Header>Test {datapoint_count} of {PUBLIC_TEACH_TEST_CYCLES}</Header>
    {/if}
    {#if testOrTeaching === 'teaching'}
        <Header>Case {datapoint_count} of {PUBLIC_TEACH_TEST_CYCLES}</Header>
    {/if}
    {#if testOrTeaching === 'final-test'}
        <Header>Case {datapoint_count} of {PUBLIC_END_TEST_CYCLES}</Header>
    {/if}

    <div class="content-align">
        {#if testOrTeaching === 'test'}
            <h2 style="text-align: center; color: purple;">Testing Phase</h2>
            <p class="mb-3">{@html test_intro}</p>
        {/if}
        {#if testOrTeaching === 'teaching'}
            <h2 style="text-align: center; color: green;">Learning Phase</h2>
            <p class="mb-3 text-xs">{@html teaching_intro}</p>
        {/if}
        {#if testOrTeaching === 'final-test'}
            <h2 style="text-align: center; color: purple;">Final Testing Phase</h2>
            <p class="mb-3">{@html final_test_intro}</p>
        {/if}
        <h2 style="text-align: center">Current Case</h2>
    </div>

    <main>
        <Datapoint
                header={['Attribute', 'Value']}
                body={Object.keys(data).map((key) => [key, data[key].toString()])}
                feature_tooltips={feature_tooltips}
                feature_units={feature_units}
                feature_names={feature_names}
        />
    </main>
    <div class="content-align">
        {#if testOrTeaching === 'final-test' && selected_prediction != null}
            <FeedbackWindow
                    placeholder="Please describe why you made the decision..."
                    submitLabel="Proceed"
                    on:feedbackSubmit={logFinalTestPrediction}
            />
        {:else}
            <hr class="!border-t-4 my-3"/>
            <form>
                <div class="mt-6">
                    <h2 style="text-align: center">Make a prediction</h2>
                    <p class="mb-3 center-text text-xs">{prediction_question}</p>
                    <div class="variant-ghost-surface w-fit mx-auto">
                        <ListBox
                                active="variant-filled-primary"
                                hover="hover:variant-soft-primary"
                                display="flex-col">
                            {#each options as option, index}
                                <ListBoxItem class="text-sm" bind:group={selected_prediction} name="justify" value={option}
                                             on:click={() => {selected_prediction = option; logPrediction();}}
                                >{option}</ListBoxItem>
                            {/each}
                        </ListBox>
                    </div>
                </div>
            </form>
        {/if}
    </div>
</div>

<style lang="postcss">
    .inputarea {
        background: var(--questions-bg);
        min-height: 97vh;
        max-height: 97vh;
    }

    @media (max-width: 600px) {
        .inputarea {
            min-height: 90vh;
            max-height: 90vh;
        }
    }

    @media (min-width: 601px) and (max-width: 900px) {
        .inputarea {
            min-height: 95vh;
            max-height: 95vh;
        }
    }

    .content-align {
        width: 90%; /* Same width as table */
        margin: 0 auto; /* To center it */
    }

    .testing-color {
        background-color: lightgray;
    }

    h2 {
        color: black;
        font-size: 16px;
        font-weight: bold;
    }

</style>
