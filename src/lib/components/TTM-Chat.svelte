<script lang="ts">
    import type {TChatMessage} from '$lib/types';
    import {afterUpdate, beforeUpdate, tick} from 'svelte';
    import Header from './Header.svelte';
    import Message from './Message.svelte';
    import { createEventDispatcher } from 'svelte';

    export let messages: TChatMessage[] = [];
    let element: HTMLElement;

    let autoscroll = false;

    const dispatch = createEventDispatcher();

     function forwardEvent(event) {
       dispatch('feedbackButtonClick', event.detail);
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
</div>


<style lang="postcss">
    .ttm {
        flex-flow: column wrap;
        background: var(--ttm-bg);
        min-height: 97vh;
        max-height: 97vh;
    }
</style>
