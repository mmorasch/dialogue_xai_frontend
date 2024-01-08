<script lang="ts">
	import { PUBLIC_TEACH_TEST_CYCLES } from '$env/static/public';
	import { createEventDispatcher } from 'svelte';
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import Header from './Header.svelte';
	import Datapoint from './Datapoint.svelte';
	import type { TTestOrTeaching } from '$lib/types';

	const dispatch = createEventDispatcher();

	export let data: { [key: string]: string };
	export let prediction_question =
		'Do you think the model will predict the person as high risk or low risk of having diabetes?';

	export let datapoint_count: number | null = null;
    export let tooltips: { [key: string]: string };

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
	class="inputarea h-full flex-1 overflow-y-auto shadow-[0_15px_15px_-5px_rgba(0,0,0,0.2)] mx-2.5 my-0"
>
	<Header>Patient</Header>
	<main>
		<Datapoint
			header={['Attribute', 'Value']}
			body={Object.keys(data).map((key) => [key, data[key].toString()])}
            {tooltips}
		/>
	</main>
	<div class="content-align">
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
		</form>
		{#if datapoint_count}
			<div>
				<p class="text-center text-[#999] text-[10px] mt-8">
					{datapoint_count} of {PUBLIC_TEACH_TEST_CYCLES} datapoints
				</p>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.inputarea {
		background: var(--questions-bg);
	}
	.content-align {
		width: 80%; /* Same width as your table */
		margin: 0 auto; /* To center it */
	}
</style>
