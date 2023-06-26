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

<div class="col-[2] flex-1 overflow-y-auto h-full">
	<div
		class="ttm flex justify-between w-full h-full border-[length:var(--border)] shadow-[0_15px_15px_-5px_rgba(0,0,0,0.2)] rounded-[5px]"
	>
		<Header>Chat Window</Header>
		<main bind:this={element} class="col-[2] flex-1 overflow-y-auto h-full p-2.5 justify-end flex-col">
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
