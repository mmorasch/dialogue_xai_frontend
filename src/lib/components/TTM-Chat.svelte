<script lang="ts">
	import type { TChatMessage } from '$lib/types';
	import { afterUpdate, tick } from 'svelte';
	import Header from './Header.svelte';
	import Message from './Message.svelte';

	export let messages: TChatMessage[] = [];
	let element: HTMLElement;

	// Either afterUpdate()
	afterUpdate(() => {
		console.log('afterUpdate');
		if (messages) scrollToBottom(element);
	});

	$: if (messages && element) {
		console.log('tick');
		scrollToBottom(element);
	}

	const scrollToBottom = async (node: HTMLElement) => {
		node.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
	};
</script>

<div bind:this={element} class="col-[2] flex-1 overflow-y-auto h-full">
	<div
		class="ttm flex justify-between w-full h-full border-[length:var(--border)] shadow-[0_15px_15px_-5px_rgba(0,0,0,0.2)] rounded-[5px]"
	>
		<Header>Chat Window</Header>
		<main class="col-[2] flex-1 overflow-y-auto h-full p-2.5 justify-end">
			{#each messages as message}
				<Message {message} />
			{/each}
		</main>
	</div>
</div>

<style lang="postcss">
	.ttm {
		flex-flow: column wrap;
		background: var(--ttm-bg);
	}
</style>
