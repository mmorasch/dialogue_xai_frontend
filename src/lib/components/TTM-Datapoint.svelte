<script lang="ts">
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import Header from './Header.svelte';
	import { createEventDispatcher } from 'svelte';
	import Datapoint from './Datapoint.svelte';
	import { PUBLIC_TEACH_TEST_CYCLES } from '$env/static/public';

	const dispatch = createEventDispatcher();

	export let data: {[key: string]: string};

	export let prediction_question =
		'Do you think the model will predict the applicant as high risk or low risk?';

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

	async function next(e: any) {
		e.preventDefault();
		console.log('TTM-Datapoint.svelte > next');
		console.log('selected_prediction', selected_prediction);
		if (selected_prediction) {
			console.log('dispatching');
			dispatch('next', null);
		} else {
			console.log('No question selected');
		}
	}
</script>

<div
	class="inputarea h-full flex-1 overflow-y-auto border-[length:var(--border)] shadow-[0_15px_15px_-5px_rgba(0,0,0,0.2)] mx-2.5 my-0 rounded-[5px]"
>
	<Header>Applicant</Header>
	<main>
		<Datapoint header={['Attribute', 'Value']} body={Object.keys(data).map((key) => [key, data[key].toString()])}/>
	</main>
	<hr class="!border-t-4 my-4" />
	<form>
		<div class="mt-8">
			<p class="mb-6">{prediction_question}</p>
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
		<hr class="!border-t-4 my-4" />
		{#if selected_prediction}
			<div class="mt-8 justify-center">
				{#if datapoint_count === 5}
					<p>Click next to get to the testing step.</p>
				{:else}
					<p>Click next to get to the next datapoint.</p>
				{/if}
				<input type="submit" value="Next" style="width: 100%;" on:click|preventDefault={next} />
			</div>
		{/if}
	</form>
	{#if datapoint_count}
		<div>
			<p class="text-center text-[#999] text-[10px] mt-8">
				{datapoint_count} of {PUBLIC_TEACH_TEST_CYCLES} datapoints
			</p>
		</div>
	{/if}
</div>

<style lang="postcss">
	.inputarea {
		background: var(--questions-bg);
	}
	input[type='submit'] {
		@apply bg-[black] text-[white] rounded-lg cursor-pointer mx-0 my-[5px] px-5 py-3.5 border-[none];
	}
</style>
