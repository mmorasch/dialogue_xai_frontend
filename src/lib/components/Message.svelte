<script lang="ts">
	import LikeButton from './LikeButton.svelte';
	import DislikeButton from './DislikeButton.svelte';
	import CommentButton from './CommentButton.svelte';
	import { typewriter } from '../typewriter';
	import type { TChatMessage } from '$lib/types';
	import { fade } from 'svelte/transition';

	export let message: TChatMessage;
</script>

<div class="flex items-end mb-2.5 {message.isUser ? 'right-msg' : 'left-msg'}">
	<div class="msg-bubble max-w-md p-2.5 rounded-2xl">

		{@html message.text}
		{#if !message.isUser}
			{#if message.feedback}
				<br />
				<span class="float-right flex flex-wrap" in:fade={{delay: 1000, duration: 250}}>
					<LikeButton />
					<DislikeButton />
					<CommentButton />
				</span>
			{/if}
		{/if}
	</div>
</div>

<style lang="postcss">
	.left-msg .msg-bubble {
		@apply rounded-bl-none variant-ghost-surface;
	}
	.right-msg {
		@apply flex-row-reverse;
	}
	.right-msg .msg-bubble {
		@apply rounded-br-none variant-ghost-tertiary;
	}
</style>
