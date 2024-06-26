<script lang="ts">
    import LikeButton from './LikeButton.svelte';
    import DislikeButton from './DislikeButton.svelte';
    import {createEventDispatcher} from 'svelte';
    import type {TChatMessage} from '$lib/types';
    import {fade} from 'svelte/transition';

    export let message: TChatMessage;

    const dispatch = createEventDispatcher();

    // Function to forward event
    function forwardEvent(event) {
        dispatch('feedbackButtonClick', event.detail);
    }

    // Function to handle button click for questions
    function buttonOnClick(questionId: string, featureId: string) {
        dispatch('questionClick', {questionId, featureId});
    }
</script>

<div class="flex items-end mb-2.5 {message.isUser ? 'right-msg' : 'left-msg'}">
    <div class="msg-bubble max-w-md p-2.5 rounded-2xl">
        {@html message.text}
        {#if !message.isUser && message.feedback}
            <br/>
            <span class="float-right flex flex-wrap" in:fade={{delay: 1000, duration: 250}}>
                <LikeButton {message} on:feedbackButtonClick={forwardEvent}/>
                <DislikeButton {message} on:feedbackButtonClick={forwardEvent}/>
            </span>
            <!-- Check if the followup array is not empty -->
        {/if}<br/>
        {#if message.followup && message.followup.length > 0}
            <div class="">
                <p><b>Question Suggestions</b></p>
                {#each message.followup as question}
                    <button
                            data-value={question.id}
                            type="button"
                            class="btn variant-ghost-primary"
                            style="font-size: 0.75rem;"
                            on:click={() => buttonOnClick(question.id, question.feature)}>{question.question}</button>
                {/each}
            </div>
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

    .follow-up-questions p {
        @apply font-semibold;
    }

    .msg-bubble .btn, .btn {
        @apply m-1 p-2 bg-transparent border border-solid border-gray-300 rounded cursor-pointer text-left block w-full;
        white-space: normal; /* Ensure text wraps */
        overflow: hidden; /* Keep the content within the button */
        max-width: 100%;
        transition: background-color 0.3s ease;

        &:hover {
            @apply bg-gray-200;
        }
    }
</style>
