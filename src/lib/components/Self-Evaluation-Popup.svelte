<script>
    import {createEventDispatcher, onMount} from 'svelte';
    import {RangeSlider, Step, Stepper} from "@skeletonlabs/skeleton";
    import backend from "$lib/backend";
    import {base} from "$app/paths";
    import {writable} from 'svelte/store';

    const dispatch = createEventDispatcher();

    export let user_id;
    export let feature_questions;
    export let general_questions;

    export let study_group;

    let user_correctness_string;

    onMount(async () => {
        const response = await backend.xai(user_id).get_user_correctness();
        user_correctness_string = await response.json().then(data => {
            return data.correctness_string;
        })
    });

    let questions = [
        'I understand the important attributes for a decision.',
        'I cannot distinguish between the possible prediction.',
        'I understand how the ML model works.',
        'I can select minus two for this question.',
        'I did not understand how the ML model makes decisions.',
    ];

    let answers = Array(questions.length).fill(0);

    // Change [current prediction] placeholder
    general_questions = general_questions.map(question => {
        question.question = question.question.replace('[current prediction]', 'the current prediction');
        return question;
    });

    // Change [feature selection] placeholder
    feature_questions = feature_questions.map(question => {
        question.question = question.question.replace('[feature selection]', 'this feature');
        return question;
    });

    // Combine the feature and general questions
    let ttm_questions = [
        ...general_questions,
        ...feature_questions
    ];

    let selectedValues = [];

    async function onComplete() {
        //merge selectedGeneralValues and selectedFeatureValues
        selectedValues = [...$selectedGeneralValues, ...$selectedFeatureValues];

        // Save questions ranking
        await fetch(`${base}/api/exit/questionnaire`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user_id,
                questions: ttm_questions,
                answers: selectedValues,
                questionnaire_name: 'question_ranking'
            })
        });
        // Save the answers when the user completes the questionnaire
        await fetch(`${base}/api/exit/questionnaire`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user_id,
                questions: questions,
                answers: answers,
                questionnaire_name: 'self_assessment'
            })
        });
        dispatch('confirm');
    }

    // Assuming you know the length of questions arrays beforehand or they are dynamically provided
    let generalQuestionsLength = general_questions.length;
    let featureQuestionsLength = feature_questions.length;
    let totalQuestionsLength = general_questions.length + feature_questions.length;

    const selectedGeneralValues = writable(Array(generalQuestionsLength).fill(''));
    const selectedFeatureValues = writable(Array(featureQuestionsLength).fill(''));

    import {derived} from 'svelte/store';

    // Create a derived store to calculate disabled options based on selections in both question types
    const disabledOptions = derived(
        [selectedGeneralValues, selectedFeatureValues],
        ([$selectedGeneralValues, $selectedFeatureValues]) => {
            const disabled = [...$selectedGeneralValues, ...$selectedFeatureValues].filter(val => val !== '');
            return disabled;
        }
    );
</script>

<div class="overlay">
    <div class="popup">
        <Stepper stepTerm="Step" on:complete={onComplete} buttonCompleteLabel="Continue Experiment">
            {#if study_group === 'interactive'}
                <Step>
                    <h1 class="center-text text-xl">Please rank the questions based on their usefulness.</h1>
                    <!-- General Questions -->
                    <div class="flex flex-col my-[5px]">
                        <h2>General Questions</h2>
                        {#each general_questions as question, index}
                            <div class="flex my-[5px]">
                                <select bind:value={$selectedGeneralValues[index]}>
                                    <option value="">Select a rank</option>
                                    {#each Array(totalQuestionsLength).fill().map((_, i) => i + 1) as rank}
                                        <option value={rank} disabled={$disabledOptions.includes(rank)}>
                                            {rank}
                                        </option>
                                    {/each}
                                </select>
                                <button
                                        data-value={question.id}
                                        type="button"
                                        class="btn variant-ghost-primary left-aligned-button">
                                    {question.question}
                                </button>
                            </div>
                        {/each}
                    </div>

                    <!-- Feature Questions -->
                    <div class="flex flex-col my-[5px]">
                        <h2>Attribute Related Questions</h2>
                        {#each feature_questions as question, index}
                            <div class="flex my-[5px]">
                                <select bind:value={$selectedFeatureValues[index]}>
                                    <option value="">Select a rank</option>
                                    {#each Array(totalQuestionsLength).fill().map((_, i) => i + 1) as rank}
                                        <option value={rank} disabled={$disabledOptions.includes(rank)}>
                                            {rank}
                                        </option>
                                    {/each}
                                </select>
                                <button
                                        data-value={question.id}
                                        type="button"
                                        class="btn variant-ghost-primary left-aligned-button">
                                    {question.question}
                                </button>
                            </div>
                        {/each}
                    </div>
                </Step>
            {/if}
            <Step>
                <h2 class="text-2xl">You are done with the initial phase where you had the possibility to learn about
                    the model decision.
                    <br>
                    You <b>correctly answered {user_correctness_string}</b> of the test cases.</h2>
            </Step>
            <Step>
                <p class="text-center text-xl">
                    How would you rate your understanding of the model decision process? <br>
                </p>

                {#each questions as question, i}
                    <div class="slider-flex">
                        <div class="question-column">
                            <span class="question align-middle">
                                {question}
                            </span>
                        </div>
                        <div class="slider-column">
                            <RangeSlider name="range-slider" bind:value={answers[i]} min={-3} max={3} step={1} ticked>
                                <div class="slider-flex justify-between items-center">
                                    <div class="text-xs">Strongly Disagree</div>
                                    <div class="text-xs">Neither agree nor disagree</div>
                                    <div class="text-xs">Strongly Agree</div>
                                </div>
                            </RangeSlider>
                            <div class="labels slider-flex justify-between">
                                <span class="small-text">-3</span>
                                <span class="small-text">-2</span>
                                <span class="small-text">-1</span>
                                <span class="small-text">0</span>
                                <span class="small-text">1</span>
                                <span class="small-text">2</span>
                                <span class="small-text">3</span>
                            </div>
                        </div>
                    </div>
                {/each}
            </Step>
            <Step>
                <p class="text-center text-xl">
                    Almost done!<br> <br>

                    As a last activity, you will see new cases and will be asked to make a decision on how you think the model will predict them. You will not see explanations.<br>
                </p>
            </Step>
        </Stepper>
    </div>
</div>

<style>
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }

    .popup {
        position: relative;
        width: 80%;
        height: 80%;
        background-color: white;
        border-radius: 10px;
        padding: 40px;
        box-sizing: border-box;
        overflow: auto;
    }

    .flex {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 20px; /* adjust this value to create more space between the rows */
    }

    .slider-flex {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px; /* adjust this value to create more space between the rows */
        border-bottom: 1px solid #000; /* add a bottom border to each row */
        align-items: center;
    }

    .question-column {
        flex: 0.25; /* this will make the question column take up 25% of the total width */
        margin-right: 20px;
        align-items: center;
    }

    .slider-column {
        flex: 0.75; /* this will make the slider column take up 75% of the total width */
    }

    .text-center {
        margin-bottom: 30px; /* adjust this value to create more space */
    }

    /* Style the selection field like tailwind */
    select {
        @apply rounded-lg bg-[whitesmoke] cursor-pointer mx-0 my-[5px] px-5 py-3.5 border-2;
    }

    .left-aligned-button {
        align-self: flex-start;
    }

</style>