<script lang="ts">
    import LikeButton from './LikeButton.svelte';
    import DislikeButton from './DislikeButton.svelte';
    import {createEventDispatcher} from 'svelte';
    import CommentButton from './CommentButton.svelte';
    import type {TChatMessage} from '$lib/types';
    import {fade} from 'svelte/transition';

    export let message: TChatMessage;

    const dispatch = createEventDispatcher();

    function forwardEvent(event) {
        dispatch('feedbackButtonClick', event.detail);
    }
</script>

<div class="flex items-end mb-2.5 {message.isUser ? 'right-msg' : 'left-msg'}">
    <div class="msg-bubble max-w-md p-2.5 rounded-2xl">

        {@html message.text}
        {#if !message.isUser}
            {#if message.feedback}
                <br/>
                <span class="float-right flex flex-wrap" in:fade={{delay: 1000, duration: 250}}>
					<LikeButton {message} on:feedbackButtonClick={forwardEvent}/>
                    <DislikeButton {message} on:feedbackButtonClick={forwardEvent}/>
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
