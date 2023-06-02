<script lang="ts">
	import Header from './Header.svelte';

	export let data = {
		Name: 'First Last',
		Age: 25,
		SthSth: 'SthSth',
		Sth: 'SthSth'
	};
</script>

<div>
	<Header>Datapoint</Header>
	<main>
		{#each Object.entries(data) as [key, value]}
			<p>{key}: <span>{value}</span></p>
		{/each}
	</main>
</div>

<style lang="postcss">
	div {
		@apply col-[1] h-[calc(100%_-_10px)] flex-1 overflow-y-auto border-[length:var(--border)] shadow-[0_15px_15px_-5px_rgba(0,0,0,0.2)] rounded-[5px];
		background: var(--ttm-bg);
	}
	p {
		@apply mx-2.5 my-[5px];
	}
	span {
		@apply float-right;
	}
</style>
