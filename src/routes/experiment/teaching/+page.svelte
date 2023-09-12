<script lang="ts">
	import TTMDatapoint from '$lib/components/TTM-Datapoint.svelte';
	import TTMChat from '$lib/components/TTM-Chat.svelte';
	import TTMQuestions from '$lib/components/TTM-Questions.svelte';
	import type { TChatMessage, TFeatureName, TFeatureQuestion, TGeneralQuestion } from '$lib/types';
	import backend from '$lib/backend';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let messages: TChatMessage[] = [
		{
			text: 'Hello, what would you like to know about the ML prediction? Pick a question from the right. You can find general questions in the upper half and questions that only work in combination with selecting a feature from the drop down box in the lower part. Once selected, press **Ask question**.',
			isUser: false,
			feedback: false
		}
	];

	let datapoint_promise: Promise<any>;
	let prediction_promise: Promise<any>;
	let questions_promise: Promise<any>;
	let datapoint_count: number = 1;

	let datapoint_answer_selected: string | null = null;

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
		} = await questions_promise;
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
		backend.xai.get_response(question, feature).then((response) => {
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
		datapoint_answer_selected = null;
		if (datapoint_count !== 5) {
			datapoint_count++;
		} else {
			goto('/experiment/test');
		}
		messages = [
			{
				text: 'Hello, what would you like to know about the ML prediction? Pick a question from the right. You can find general questions in the upper half and questions that only work in combination with selecting a feature from the drop down box in the lower part. Once selected, press **Ask question**.',
				isUser: false,
				feedback: false
			}
		];

		datapoint_promise = backend.xai.get_datapoint().then((response) => {
			return response.json();
		});
	}

	onMount(async () => {
		datapoint_promise = backend.xai.get_datapoint().then((response) => {
			prediction_promise = backend.xai.get_current_prediction().then((response) => {
				return response.json();
			});
			questions_promise = backend.xai.get_questions().then((response) => {
				return response.json();
			});
			return response.json();
		});
	});

</script>

<div class="col-start-1 col-end-2 h-full">
	{#await datapoint_promise}
		<p>...waiting</p>
	{:then datapoint}
		<TTMDatapoint
			data={datapoint}
			bind:selected_prediction={datapoint_answer_selected}
			bind:datapoint_count={datapoint_count}
			on:next={handleNext}
		/>
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</div>
{#if datapoint_answer_selected}
	<div class="col-start-2 col-end-3 h-full overflow-y-scroll">
		<TTMChat {messages} />
	</div>
	<div class="col-auto h-full overflow-y-scroll">
		{#await questions_promise}
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
