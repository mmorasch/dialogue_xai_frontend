<script lang="ts">
	import type { TChatMessage } from '$lib/types';
	import Header from './Header.svelte';
	import Message from './Message.svelte';

	export let messages: TChatMessage[] = [];
</script>

<div class="col-[2] flex-1 overflow-y-auto h-[calc(100%_-_10px)]">
	<div class="ttm flex justify-between w-full h-[calc(100%_-_10px)] border-[length:var(--border)] shadow-[0_15px_15px_-5px_rgba(0,0,0,0.2)] rounded-[5px]">
		<Header>TalkToModel</Header>
		<main class="col-[2] flex-1 overflow-y-auto h-[calc(100%_-_10px)] p-2.5">
			{#each messages as message}
				<Message {message}/>
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
