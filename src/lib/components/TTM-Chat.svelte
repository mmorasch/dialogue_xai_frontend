<script lang="ts">
	import type { TChatMessage } from '$lib/types';
	import { afterUpdate, beforeUpdate, tick } from 'svelte';
	import Header from './Header.svelte';
	import Message from './Message.svelte';

	export let messages: TChatMessage[] = [];
	let element: HTMLElement;

	let autoscroll = false;

	beforeUpdate(() => {
		if (element) {
			const scrollableDistance = element.scrollHeight - element.offsetHeight;
			autoscroll = element.scrollTop > scrollableDistance - 20;
		}
	});

	afterUpdate(() => {
		if (autoscroll) {
			element.scrollTo(0, element.scrollHeight);
		}
	});
</script>

<div
	class="ttm flex h-full"
>
	<Header>Chat Window</Header>
	<main
		bind:this={element}
		class="flex-1 overflow-y-auto h-full p-3"
	>
		{#each messages as message}
			<Message {message} />
		{/each}
	</main>
</div>

<style lang="postcss">
	.ttm {
		flex-flow: column wrap;
		background: var(--ttm-bg);
	}
</style>
