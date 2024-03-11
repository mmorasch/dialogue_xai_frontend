<!-- QuestionButton.svelte -->
<script lang="ts">
    import {createEventDispatcher} from 'svelte';

    export let type: 'general' | 'feature';
    export let question: string;
    export let questionId: string;
    export let featureOptions: { id: string; feature_name: string }[] = [];

    let activeFeature = '';
    export let isActive: boolean;

    const dispatch = createEventDispatcher();

    // Handles button clicks for both general and feature questions
    function handleClick() {
        // For feature questions, ensure a feature is selected
        if (type === 'feature' && activeFeature === '') {
            console.log('Feature question requires a feature to be selected');
            return;
        }

        // Dispatch an event to signify the button click, including question type, question and feature info if applicable
        dispatch('action', {
            type,
            questionId,
            question: question.replace('[feature selection]', activeFeature),
            feature: activeFeature,
        });
    }

    function submitQuestion() {
        // Dispatch includes the question type to allow for differentiated handling
        console.log('Dispatching action for question:', question);
        dispatch('action', {
            type,
            questionId,
            question: question.replace('[feature selection]', activeFeature),
            feature: activeFeature,
        });
    }

    function handleChange(event) {
        activeFeature = event.target.value;

        // Proceed to submit the question automatically if a valid feature is selected
        if (type === 'feature' && activeFeature !== '') {
            submitQuestion();
        }
    }
</script>

<button
        on:click={handleClick}
        class:variant-filled-primary={isActive} class:variant-ghost-primary={!isActive}
        data-value={questionId}
        type="button"
        style="font-size: 0.75rem;">
    {#if type === 'feature'}
        {question.split('[feature selection]')[0]}
        <select bind:value={activeFeature} on:change={handleChange} class="inline-feature-select">
            <option value="" disabled>Select Attribute</option>
            {#each featureOptions as feature}
                <option value="{feature.id.toString()}">{feature.feature_name}</option>
            {/each}
        </select>
        {question.split('[feature selection]')[1]}
    {:else}
        {question}
    {/if}
</button>

<style lang="postcss">
    /* Style the buttons to adapt to container width */
    button {
        @apply rounded-lg w-full whitespace-normal my-[5px] px-2 py-3.5 text-sm;
        max-width: 100%; /* Ensure it doesn't overflow its container */
    }

    /* Style the selection field to fit nicely within the button */
    select {
        @apply rounded-lg bg-[whitesmoke] cursor-pointer mx-0 my-0 px-2 py-2 border-2 w-auto;
        /* Adjust margin and padding to fit within the button */
    }

    /* Adjust inline-feature-select to align well with button text */
    .inline-feature-select {
        @apply inline-block cursor-pointer mx-1 px-1 border-2;
        font-size: inherit;
        height: fit-content;
        vertical-align: middle;
        line-height: 1.5; /* Adjust for better vertical alignment */
        border-radius: 0.375rem; /* Optionally round corners to match button */
        padding: 0 0.5rem; /* Adjust padding */
    }

    .inline-feature-select option {
        @apply px-1 py-0.5;
    }
</style>
