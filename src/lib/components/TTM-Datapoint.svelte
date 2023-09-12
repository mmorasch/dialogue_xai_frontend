<script lang="ts">
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import Header from './Header.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let data = {
		Name: 'First Last',
		Age: 25,
		SthSth: 'SthSth',
		Sth: 'SthSth'
	};

	export let prediction_question =
		'Do you think the model will predict the applicant as high risk or low risk?';

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
	class="h-full flex-1 overflow-y-auto border-[length:var(--border)]"
>
	<Header>Applicant</Header>
	<main>
		{#each Object.entries(data) as [key, value]}
			<p class="mx-2.5 my-[5px]">{key}: <span class="float-right">{value}</span></p>
		{/each}
	</main>

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

		{#if selected_prediction}
			<div class="mt-8 justify-center">
				<p>If you want to log in your prediction, click next.</p>
				<input type="submit" value="Next" style="width: 100%;" on:click|preventDefault={next} />
			</div>
		{/if}
	</form>
</div>

<style lang="postcss">
	input[type='submit'] {
		@apply bg-[black] text-[white] rounded-lg cursor-pointer mx-0 my-[5px] px-5 py-3.5 border-[none];
	}
</style>
