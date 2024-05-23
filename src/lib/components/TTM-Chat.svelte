<script lang="ts">
    import type {TChatMessage} from '$lib/types';
    import {afterUpdate, beforeUpdate} from 'svelte';
    import Header from './Header.svelte';
    import Message from './Message.svelte';
    import {createEventDispatcher} from 'svelte';

    export let messages: TChatMessage[] = [];
    let element: HTMLElement;
    let inputMessage = '';
    export let user_input = true;

    let autoscroll = false;

    const dispatch = createEventDispatcher();

    function forwardEvent(event) {
        dispatch('feedbackButtonClick', event.detail);
    }

    function handleKeydown(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Stop the form from submitting
            sendMessage();
        }
    }

    function sendMessage() {
        dispatch('submit', {message: inputMessage});
        inputMessage = '';
    }

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
    <Header>Chatbot</Header>
    <main
            bind:this={element}
            class="flex-1 overflow-y-auto h-full p-3"
    >
        {#each messages as message}
            <Message {message} on:feedbackButtonClick={forwardEvent}/>
        {/each}
    </main>
    {#if user_input}
        <div class="input-area">
            <input class="variant-ghost-surface" bind:value={inputMessage} type="text" placeholder="Ask a question..."
                   on:keydown={handleKeydown}/>
            <button class="variant-ghost-primary" on:click={sendMessage}>Send</button>
        </div>
    {/if}
</div>


<style lang="postcss">
    .ttm {
        flex-flow: column wrap;
        background: var(--ttm-bg);
        min-height: 97vh;
        max-height: 97vh;
    }

    .input-area {
        display: flex;
        justify-content: space-between;
        padding: 10px;
    }

    .input-area input {
        flex-grow: 1;
        margin-right: 10px;
    }
    
    .input-area button {
        @apply rounded-lg cursor-pointer mx-0 px-5 py-2.5 border-2;
    }
</style>
