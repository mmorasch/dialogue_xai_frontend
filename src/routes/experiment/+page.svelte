<script lang="ts">
	import TTMDatapoint from '$lib/components/TTM-Datapoint.svelte';
	import TTMChat from '$lib/components/TTM-Chat.svelte';
	import TTMQuestions from '$lib/components/TTM-Questions.svelte';
	import TTMTest from '$lib/components/TTM-Test.svelte';
	import type { TChatMessage, TDatapoint, TQuestionResult, TTestOrTeaching } from '$lib/types';
	import backend from '$lib/backend';
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';
	import { PUBLIC_TEACH_TEST_CYCLES } from '$env/static/public';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	/**
	 * Data provided by the `+page.ts` load function in the same folder
	 */
	export let data: PageData;

	//-----------------------------------------------------------------

	/**
	 * Datapoint relevant
	 */
	let current_datapoint: TDatapoint = data.datapoint;
	let current_prediction: string = data.current_prediction;
	let datapoint_count: number = 1;
	let datapoint_answer_selected: string | null = null;
	let feature_tooltip = data.feature_tooltip
	console.log({feature_tooltip})

	//-----------------------------------------------------------------

	/**
	 * Chat relevant
	 */
	let messages: TChatMessage[] = [{ isUser: false, feedback: false, text: data.initial_prompt }];

	//-----------------------------------------------------------------

	/**
	 * Test relevant
	 */
	let prediction: string = '';
	let confidence: number = 50;
	let explanation: string = '';
	//-----------------------------------------------------------------

	let { feature_names, feature_questions, general_questions }: TQuestionResult = data.questions;
	let user_id: string = data.user_id;
	let test_or_teaching: TTestOrTeaching = 'teaching';

	async function submitQuestion(e: any) {
		let question: number = parseInt(e.detail.question);
		let feature: number = parseInt(e.detail.feature);
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

		// log: datapoint_answer_selected,

		/**
		 * Change from test to teach or vice versa
		 */
		let id: string = '';
		let initial_prompt: string = '';
		let new_datapoint: TDatapoint;
		if (test_or_teaching === 'test') {
			if (datapoint_count === parseInt(PUBLIC_TEACH_TEST_CYCLES)) {
				goto(`${base}/exit?user_id=${user_id}`);
			}
			datapoint_count++;
			({ id, current_prediction, initial_prompt, ...new_datapoint } = await (
				await backend.xai(user_id).get_test_datapoint()
			).json());
			test_or_teaching = 'teaching';
		} else {
			({ id, current_prediction, initial_prompt, ...new_datapoint } = await (
				await backend.xai(user_id).get_train_datapoint()
			).json());
			test_or_teaching = 'test';
		}
		messages = [{ isUser: false, feedback: false, text: initial_prompt }];
		current_datapoint = new_datapoint;

		//-----------------------------------------------------------------
		datapoint_answer_selected = null;
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
<div class="col-start-2 col-end-3 mx-auto -z-10 row-start-1 row-end-2">
	<header class="text-lg">{test_or_teaching === 'test' ? 'Test' : 'Teaching'}</header>
</div>
{#if datapoint_answer_selected}
	{#if test_or_teaching === 'teaching'}
		<div
			class="col-start-2 col-end-3 h-full overflow-y-scroll row-start-1 row-end-2"
			transition:fade={{ delay: 250, duration: 500 }}
		>
			<TTMChat {messages} />
		</div>
		<div class="col-auto h-full overflow-y-scroll" transition:fade={{ delay: 250, duration: 500 }}>
			<TTMQuestions
				{feature_questions}
				{general_questions}
				feature_questions_dropdown={feature_names}
				on:submit={submitQuestion}
			/>
		</div>
	{:else}
		<div class="col-start-2 col-end-3 w-10/12 row-start-1 row-end-2 mt-12 mx-auto">
			<TTMTest {confidence} {prediction} {explanation} />
		</div>
	{/if}
{/if}
