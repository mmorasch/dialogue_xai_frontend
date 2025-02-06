<script lang="ts">
    import {onMount, onDestroy} from 'svelte';
    import {typewriter} from '$lib/typewriter';

    // Define the list of progress labels.
    const states = [
        '...',
        'thinking',
        '...',
        'analyzing data',
        '...',
        'preparing response',
        '...',
        'preparing response',
        '...',
        '...',
        '...',
        '...',
        '...'
    ];

    let currentStateIndex = 0;
    let currentState = states[currentStateIndex];

    // Reference to the DOM element that will display the text.
    let container: HTMLDivElement;
    // Holds the reference to the typewriter action instance.
    let typewriterAction: { update: (newSpeed: number) => void; destroy: () => void } | null = null;
    // Holds the interval ID for cycling states.
    let stateInterval: number;

    /**
     * Initializes the typewriter effect.
     * The typewriter action will read the container's innerHTML,
     * clear it, and then type the text word-by-word.
     */
    function startTypewriter() {
        if (container) {
            // Set the container content to the current progress state.
            container.innerHTML = currentState;
            // Run the typewriter effect on the container.
            typewriterAction = typewriter(container, 80);
        }
    }

    /**
     * Advances to the next progress state.
     * The current typewriter action is destroyed before re-initializing.
     */
    function nextState() {
        currentStateIndex = (currentStateIndex + 1) % states.length;
        currentState = states[currentStateIndex];
        if (typewriterAction) {
            typewriterAction.destroy();
            typewriterAction = null;
        }
        startTypewriter();
    }

    onMount(() => {
        startTypewriter();
        // Change to the next state every 2 seconds.
        stateInterval = setInterval(nextState, 2000);
    });

    onDestroy(() => {
        if (stateInterval) clearInterval(stateInterval);
        if (typewriterAction) typewriterAction.destroy();
    });
</script>

<!-- Use the same bubble structure and styling as your non-user messages -->
<div class="flex items-end mb-2.5 left-msg">
    <div class="msg-bubble max-w-md p-2.5 rounded-2xl" bind:this={container}>
        <!-- The text will be inserted and animated by the typewriter action -->
    </div>
</div>

<style lang="postcss">
    /* Adapted from your message bubble styling for non-user messages */
    .left-msg .msg-bubble {
        @apply rounded-bl-none variant-ghost-surface;
    }
</style>