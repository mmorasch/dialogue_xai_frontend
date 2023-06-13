<script lang="ts">
	import TTMDatapoint from '$lib/components/TTM-Datapoint.svelte';
	import TTMChat from '$lib/components/TTM-Chat.svelte';
	import TTMQuestions from '$lib/components/TTM-Questions.svelte';
	import type { PageData } from './$types';
	import type { TChatMessage } from '$lib/types';
	import backend from '$lib/backend';

	export let data: PageData;

	let messages: TChatMessage[] = [
		{
			text: 'Hello, I am a chatbot. How can I help you?',
			isUser: false
		}
	];

	let datapoint_selected: string | null = null;

	async function submitQuestion(e: any) {
		console.log(e.detail);
		let question: number = parseInt(e.detail.question);
		let feature: number = parseInt(e.detail.feature);
		let text = ((): string => {
			for (let i = 0; i < data.general_questions.length; i++) {
				if (data.general_questions[i].id === question) {
					return data.general_questions[i].question;
				}
			}
			for (let i = 0; i < data.feature_questions.length; i++) {
				if (data.feature_questions[i].id === question) {
					for (let j = 0; j < data.feature_names.length; j++) {
						if (data.feature_names[j].id === feature) {
							return data.feature_questions[i].question.replace(
								/\[feature X\]/,
								function (i, match) {
									return data.feature_names[j].feature_name;
								}
							);
						}
					}
				}
			}
			return '';
		})();

		messages.push({
			text: text,
			isUser: true
		});

		messages = messages;
		backend.get_response(question, feature).then((response) => {
			response.text().then((text) => {
				messages.push({
					text: text,
					isUser: false
				});
				setTimeout(() => {
					messages = messages;
				}, 1000);
			});
		});
	}
</script>

<div class="col-start-1 col-end-2 h-full">
	<TTMDatapoint data={data.datapoint} bind:selected_prediction_one={datapoint_selected} />
</div>
{#if datapoint_selected}
	<div class="col-start-2 col-end-3 h-full overflow-y-scroll">
		<TTMChat {messages} />
	</div>
	<div class="col-auto h-full overflow-y-scroll">
		<TTMQuestions
			feature_questions={data.feature_questions}
			general_questions={data.general_questions}
			feature_questions_dropdown={data.feature_names}
			on:submit={submitQuestion}
		/>
	</div>
{/if}
