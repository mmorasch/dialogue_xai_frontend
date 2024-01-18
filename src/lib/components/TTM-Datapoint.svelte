<script lang="ts">
    import {PUBLIC_TEACH_TEST_CYCLES} from '$env/static/public';
    import {ListBox, ListBoxItem} from '@skeletonlabs/skeleton';
    import Header from './Header.svelte';
    import Datapoint from './Datapoint.svelte';
    import type {TTestOrTeaching} from '$lib/types';

    export let testOrTeaching: TTestOrTeaching;
    export let feature_names;

    export let data: { [key: string]: string };
    export let feature_tooltips: { [key: string]: string };
    export let feature_units: { [key: string]: string };
    export let prediction_question =
        'Will the model predict high or low diabetes risk for the individual?';
    export let teaching_intro =
        "Provide an initial guess for the patient and ask questions to understand the model's prediction.";
    export let test_intro =
        "Test your knowledge. Based on what you learned before, what do you think the model will predict for this patient? This time you cannot ask questions.";

    export let datapoint_count: number | null = null;


    const options = [
        'Surely High Risk',
        'Rather High Risk',
        "I don't know",
        'Rather Low Risk',
        'Surely Low Risk'
    ];

    // get event categories
    export let selected_prediction: string | null = null;
</script>


<div
        class:teaching-color={testOrTeaching === 'teaching'}
        class:testing-color={testOrTeaching === 'test'}
        class="inputarea h-full flex-1 overflow-y-auto shadow-[0_15px_15px_-5px_rgba(0,0,0,0.2)] mx-1.5 my-0"
>
    {#if testOrTeaching === 'test'}
        <Header>Test {datapoint_count} of {PUBLIC_TEACH_TEST_CYCLES}</Header>
    {/if}
    {#if testOrTeaching === 'teaching'}
        <Header>Patient {datapoint_count} of {PUBLIC_TEACH_TEST_CYCLES}</Header>
    {/if}

    <div class="content-align">
        <h2 style="text-align: center">Task</h2>
        {#if testOrTeaching === 'test'}
            <p class="mb-3">{test_intro}</p>
        {/if}
        {#if testOrTeaching === 'teaching'}
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
                            display="flex-col"
                    >
                        <ListBoxItem bind:group={selected_prediction} name="justify" value={options[0]}
                        >{options[0]}</ListBoxItem
                        >
                        <ListBoxItem bind:group={selected_prediction} name="justify" value={options[1]}
                        >{options[1]}</ListBoxItem
                        >
                        <ListBoxItem bind:group={selected_prediction} name="justify" value={options[2]}
                        >{options[2]}</ListBoxItem
                        >
                        <ListBoxItem bind:group={selected_prediction} name="justify" value={options[3]}
                        >{options[3]}</ListBoxItem
                        >
                        <ListBoxItem bind:group={selected_prediction} name="justify" value={options[4]}
                        >{options[4]}</ListBoxItem
                        >
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
