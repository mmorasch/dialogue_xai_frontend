<script lang="ts">
	import LikeButton from './LikeButton.svelte';
	import DislikeButton from './DislikeButton.svelte';
	import CommentButton from './CommentButton.svelte';
	import { typewriter } from './typewriter.ts';

	export let message = {
		text: '',
		isUser: false,
		feedback: true
	};
</script>

<div class="flex items-end mb-2.5 {message.isUser ? 'right-msg' : 'left-msg'}">
    <div
        class="msg-bubble max-w-md p-2.5 rounded-2xl"
        use:typewriter={message.isUser ? null : 50}
    >
        {@html message.text}
        {#if !message.isUser}
            {#if message.feedback}
                <br />
                <span class="float-right flex flex-wrap">
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
