<script lang="ts">
    import {PUBLIC_TEACH_TEST_CYCLES, PUBLIC_END_TEST_CYCLES} from '$env/static/public';
    import {ListBox, ListBoxItem} from '@skeletonlabs/skeleton';
    import Header from './Header.svelte';
    import Datapoint from './Datapoint.svelte';
    import type {TInteractiveOrStatic, TTestOrTeaching} from '$lib/types';
    import backend, {logEvent, logTestingResponse} from '../backend.ts';

    export let testOrTeaching: TTestOrTeaching;
    export let interactiveOrStatic: TInteractiveOrStatic;
    export let feature_names;

    export let true_label: string;

    export let data: { [key: string]: string };
    export let feature_tooltips: { [key: string]: string };
    export let feature_units: { [key: string]: string };
    export let prediction_question =
        'Will the model assign a likely or unlikely Risk for diabetes for the patient?';

    export let teaching_intro = "";
    if (interactiveOrStatic === 'static') {
        teaching_intro = "Guess the patients likelihood of diabetes. Afterward you can read the explanations to understand the prediction.";
    } else {
        teaching_intro = "Guess the patients risk and ask questions to understand the model's prediction.";
    }

    export let test_intro =
        "Test your knowledge about the model. Based on what you learned before, what do you think the model will predict for this patient? This time you cannot ask questions.";

    export let datapoint_count: number | null = null;

    export let user_id: string | null = null;

    const options = [
        'Surely Likely',
        'Rather Likely',
        "I don't know",
        'Rather Unlikely',
        'Surely Unlikely'
    ];

    // get event categories
    export let selected_prediction: string | null = null;

    let isDisabled = false;

    function logPredictionAndDisable(userid: string,
                                     option: string,
                                     datapointCount: number,
                                     true_label: string) {
        console.log("Logging prediction and disabling", userid, option, datapointCount, true_label);
        if (!isDisabled) {
            if (testOrTeaching === 'test') {
                logTestingResponse(userid, datapointCount, option, false, true_label);
            } else if (testOrTeaching === 'teaching') {
                console.log("Logging Teaching");
                logEvent(userid, 'TTM-Datapoint', 'user_prediction', datapointCount, {
                    prediction: option,
                    true_label: true_label
                });
                isDisabled = true;
            } else {
                logTestingResponse(userid, datapointCount, option, true, true_label);
            }
        }
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
        <Header>Patient {datapoint_count} of {PUBLIC_TEACH_TEST_CYCLES}</Header>
    {/if}
    {#if testOrTeaching === 'final-test'}
        <Header>Patient {datapoint_count} of {PUBLIC_END_TEST_CYCLES}</Header>
    {/if}

    <div class="content-align">
        <h2 style="text-align: center">Task</h2>
        {#if testOrTeaching === 'test'}
            <p class="mb-3">{test_intro}</p>
        {/if}
        {#if testOrTeaching === 'teaching' || testOrTeaching === 'final-test'}
            <p class="mb-3">{teaching_intro}</p>
        {/if}
        <h2 style="text-align: center">Patient Information</h2>
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
        <hr class="!border-t-4 my-3"/>
        <form>
            <div class="mt-6">
                <h2 style="text-align: center">Make a prediction</h2>
                <p class="mb-3">{prediction_question}</p>
                <div class="variant-ghost-surface w-fit mx-auto">
                    <ListBox
                            active="variant-filled-primary"
                            hover="hover:variant-soft-primary"
                            display="flex-col">
                        {#each options as option, index}
                            <ListBoxItem bind:group={selected_prediction} name="justify" value={option}
                                         on:click={() => logPredictionAndDisable(user_id, option, datapoint_count, true_label)}
                                         {isDisabled}>{option}</ListBoxItem>
                        {/each}
                    </ListBox>
                </div>
            </div>
        </form>
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
        font-size: 20px;
        font-weight: bold;
    }
</style>
