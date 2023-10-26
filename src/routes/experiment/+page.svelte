<script lang="ts">
	import TTMDatapoint from '$lib/components/TTM-Datapoint.svelte';
	import TTMChat from '$lib/components/TTM-Chat.svelte';
	import TTMQuestions from '$lib/components/TTM-Questions.svelte';
	import type {
		TChatMessage,
		TDatapoint,
		TDatapointResult,
		TFeatureName,
		TFeatureQuestion,
		TGeneralQuestion,
		TQuestionResult
	} from '$lib/types';
	import backend from '$lib/backend';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';

	/**
	 * Data provided by the `+page.ts` load function in the same folder
	 */
	export let data: PageData;

	//-----------------------------------------------------------------

	let messages: TChatMessage[] = [{ isUser: false, feedback: false, text: data.initial_prompt }];
	let current_datapoint: TDatapoint = data.datapoint;
	let current_prediction: string = data.current_prediction;
	let current_questions: TQuestionResult = data.questions;
	let user_id: string = data.user_id;
	let datapoint_count: number = 1;
	let datapoint_answer_selected: string | null = null;
	let test_or_teaching: 'teaching' | 'test' = 'teaching';

	async function submitQuestion(e: any) {
		console.log(e.detail);
		let question: number = parseInt(e.detail.question);
		let feature: number = parseInt(e.detail.feature);
		let {
			general_questions,
			feature_questions,
			feature_names
		}: {
			general_questions: TGeneralQuestion[];
			feature_questions: TFeatureQuestion[];
			feature_names: TFeatureName[];
		} = await current_questions;
		let text = ((): string => {
			for (let i = 0; i < general_questions.length; i++) {
				if (general_questions[i].id === question) {
					return general_questions[i].question;
				}
			}
			for (let i = 0; i < feature_questions.length; i++) {
				if (feature_questions[i].id === question) {
					for (let j = 0; j < feature_names.length; j++) {
						if (feature_names[j].id === feature) {
							return feature_questions[i].question.replace(/\[feature X\]/, function (i, match) {
								return feature_names[j].feature_name;
							});
						}
					}
				}
			}
			return '';
		})();

		messages.push({
			text: text,
			isUser: true,
			feedback: false
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
						feedback: true
					});
					setTimeout(() => {
						messages = messages;
					}, 600);
				});
			});
	}

	async function handleNext(e: any) {
		console.log('/experiment/+page.svelte > handleNext');
	}
</script>

<div class="col-start-1 col-end-2 h-full">
	<TTMDatapoint
		data={current_datapoint}
		bind:selected_prediction={datapoint_answer_selected}
		bind:datapoint_count
		on:next={handleNext}
	/>
</div>
{#if datapoint_answer_selected && test_or_teaching === 'teaching'}
	<div
		class="col-start-2 col-end-3 h-full overflow-y-scroll"
		transition:fade={{ delay: 250, duration: 500 }}
	>
		<TTMChat {messages} />
	</div>
	<div class="col-auto h-full overflow-y-scroll" transition:fade={{ delay: 250, duration: 500 }}>
		{#await current_questions}
			<p>...waiting</p>
		{:then { general_questions, feature_questions, feature_names }}
			<TTMQuestions
				{feature_questions}
				{general_questions}
				feature_questions_dropdown={feature_names}
				on:submit={submitQuestion}
			/>
		{/await}
	</div>
{/if}
