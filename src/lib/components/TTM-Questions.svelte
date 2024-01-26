<script lang="ts">
	import type { TFeatureName, TFeatureQuestion, TGeneralQuestion } from '$lib/types';
	import Header from './Header.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let general_questions: TGeneralQuestion[];
	export let feature_questions: TFeatureQuestion[];
	export let current_prediction: string;
	export let feature_questions_dropdown: TFeatureName[];
    export let selected_prediction: string | null = null;

	let activeQuestion: string;
	let activeFeature: string;

	// Replace the placeholder in the questions with the actual value
    // Do this for both general_questions and feature_questions
    $: general_questions = general_questions.map(q => ({
        ...q,
        question: q.question.replace('[current prediction]', current_prediction)
    }));
    $: feature_questions = feature_questions.map(q => ({
        ...q,
        question: q.question.replace('[current prediction]', current_prediction)
    }));

    async function next(e: any) {
      e.preventDefault();
      if (selected_prediction) {
       console.log('dispatching');
       dispatch('next', null);
      } else {
       console.log('No question selected');
      }
    }

	function selectOnChange(e: any) {
		// Get the parent button of the select element
		const parentButton = e.target.closest('button');

		// If there's a parent button, trigger a click event on it
		if (parentButton) {
			parentButton.click();
		}
	}

	function buttonOnClick(e: any) {
        const buttons = document.querySelectorAll('button');
        buttons.forEach((button) => {
            button.classList.remove('variant-filled-primary');
            button.classList.add('variant-ghost-primary');
        });

		e.target.classList.remove('variant-ghost-primary');
		e.target.classList.add('variant-filled-primary');
		activeQuestion = e.target.getAttribute('data-value');

        // Get the selected feature name from the dropdown
        const selectedFeatureName = document.querySelector(`option[value="${activeFeature}"]`)!.textContent!;

        // Automatically submit the question when clicked
		if (activeQuestion) {
			dispatch('submit', {
			  question: activeQuestion,
			  feature: activeFeature
			});
        } else {
            console.log('No question selected');
        }
    }
</script>

<div
	class="inputarea max-w-[500px] shadow-[0_15px_15px_-5px_rgba(0,0,0,0.2)] text-center mx-2.5 my-0"
>
	<form class="grid">
		<div class="row-[1]">
			<Header>
				<p>General Questions</p>
			</Header>
			{#each general_questions as question}
				<button
					data-value={question.id}
					type="button"
					class="btn variant-ghost-primary"
					on:click={buttonOnClick}>{question.question}</button
				>
			{/each}
		</div>
		<hr class="m-5 border-t-[3px] border-t-[#bbb] border-solid" />
		<div class="row-[2]">
            <Header>
                <p>Attribute Related Questions</p>
            </Header>
            {#each feature_questions as question}
                <button data-value={question.id} type="button" class="btn variant-ghost-primary" on:click={buttonOnClick}>
                    {question.question.split('[feature selection]')[0]}
                    <select bind:value={activeFeature} class="inline-feature-select" on:change={selectOnChange}>
						{#each feature_questions_dropdown as feature}
							<option value={feature.id}>{feature.feature_name}</option>
						{/each}
					</select>
                    {question.question.split('[feature selection]')[1]}
                </button>
            {/each}
        </div>
        <input
          type="submit"
          value="Proceed"
          style="width: 70%;"
          on:click|preventDefault={next}
        />
	</form>
</div>

<style lang="postcss">
	.inputarea {
		background: var(--questions-bg);
		min-height: 97vh;
        position: relative;
	}

	/* Style the buttons to appear below each other */
	.inputarea button {
		@apply rounded-lg w-[90%] whitespace-normal my-[5px] px-2 py-3.5 text-sm;
	}

	/* Style the selection field like tailwind */
	select {
		@apply rounded-lg bg-[whitesmoke] cursor-pointer mx-0 my-[5px] px-5 py-3.5 border-2;
	}

	/* Refined styles for inline dropdown */
	.inline-feature-select {
		@apply inline-block cursor-pointer mx-1 px-1 border-2;
		font-size: inherit;
		height: fit-content;
		vertical-align: middle;
		padding: 0; /* Remove default padding */
		line-height: 1; /* Adjust line-height */
		border-radius: 0; /* Make it square */
	}

	.inline-feature-select option {
		@apply px-1 py-0.5;
	}

	input[type='submit'] {
		@apply bg-[black] text-[white] rounded-lg cursor-pointer mx-0 my-[5px] px-5 py-3.5 border-[none];
		position: absolute;
        bottom: 0;
		left: 15%;
	}
</style>



