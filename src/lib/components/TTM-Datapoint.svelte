<script lang="ts">
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import Header from './Header.svelte';

	export let data = {
		Name: 'First Last',
		Age: 25,
		SthSth: 'SthSth',
		Sth: 'SthSth'
	};

	export let prediction_one_question =
		'Do you think the model will predict the applicant as high risk or low risk?';
	const options = ['Surely High Risk', 'Rather High Risk', "I don't know", 'Rather Low Risk', 'Surely Low Risk'];

	// get event categories
	export let selected_prediction_one: string | null = null;
</script>

<div class="col-[1] h-[calc(100%_-_10px)] flex-1 overflow-y-auto border-[length:var(--border)] shadow-[0_15px_15px_-5px_rgba(0,0,0,0.2)] rounded-[5px]">
	<Header>Applicant</Header>
	<main>
		{#each Object.entries(data) as [key, value]}
			<p class="mx-2.5 my-[5px]">{key}: <span class="float-right">{value}</span></p>
		{/each}
	</main>

	<div class="mt-8">
		<p>{prediction_one_question}</p>
		<RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary" display="flex-col">
			<RadioItem bind:group={selected_prediction_one} name="justify" value={options[0]}>{options[0]}</RadioItem>
			<RadioItem bind:group={selected_prediction_one} name="justify" value={options[1]}>{options[1]}</RadioItem>
			<RadioItem bind:group={selected_prediction_one} name="justify" value={options[2]}>{options[2]}</RadioItem>
			<RadioItem bind:group={selected_prediction_one} name="justify" value={options[3]}>{options[3]}</RadioItem>
			<RadioItem bind:group={selected_prediction_one} name="justify" value={options[4]}>{options[4]}</RadioItem>
		</RadioGroup>
	</div>

	{#if selected_prediction_one}
		<div class="mt-8">
		    <p>
		        If you want to log in your prediction, click next.
		    </p>
			<div class="btn variant-filled"><p>Next!</p></div>
		</div>
	{/if}
</div>

