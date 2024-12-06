<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let isCorrect = false;
    export let correctAnswered = 0;  // Correct answers count
    export let totalAnswered = 0;    // Total answers count

    function closePopup() {
        dispatch('close');
    }
</script>

<div class="overlay">
    <div class="popup">
        <h2 class="title">
            {#if isCorrect}
                ✅ Correct!
            {:else}
                ❌ Incorrect
            {/if}
        </h2>

        <!-- Display the correct/total counts -->
        <p>You have answered {correctAnswered} out of {totalAnswered} datapoints correctly.</p>

        <button class="close-button" on:click={closePopup}>Close</button>
    </div>
</div>

<style>
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
        display: flex;
        justify-content: center;
        align-items: flex-end; /* Aligns the popup at the bottom */
        z-index: 10000; /* Ensure it's above other elements */
        padding-bottom: 50px; /* Add some space at the bottom */
    }

    .popup {
        background-color: white;
        border-radius: 10px;
        padding: 30px;
        text-align: center;
        width: 300px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .title {
        font-size: 1.5em;
        margin-bottom: 20px;
    }

    .close-button {
        padding: 10px 20px;
        border: none;
        background-color: #007bff;
        color: white;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1em;
    }

    .close-button:hover {
        background-color: #0056b3;
    }
</style>