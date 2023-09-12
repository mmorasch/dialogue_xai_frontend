<script lang="ts">
	import { goto } from '$app/navigation';
	import backend from '$lib/backend';
	import TTMDatapoint from '$lib/components/TTM-Datapoint.svelte';

	let datapoint_answer_selected: string | null = null;
	let datapoint_count: number = 1;
	let datapoint_promise: Promise<any>;

	async function handleNext(e: any) {
		console.log('test.svelte > handleNext');
		console.log('datapoint_answer_selected', datapoint_answer_selected);
		if (datapoint_answer_selected) {
			if (datapoint_count === 5) {
				goto('/exit');
			}
			console.log('dispatching');
			datapoint_count++;
			datapoint_promise = backend.xai.get_datapoint();
		} else {
			console.log('No question selected');
		}
	}
</script>

<div class="col-start-1 col-end-2 h-full">
	{#await datapoint_promise}
		<p>...waiting</p>
	{:then datapoint}
		<TTMDatapoint
			data={datapoint}
			bind:selected_prediction={datapoint_answer_selected}
			bind:datapoint_count
			on:next={handleNext}
		/>
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</div>
