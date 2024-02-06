<script lang="ts">
    import {createEventDispatcher} from 'svelte';

    export let placeholder = "Enter your feedback..."; // Default placeholder
    export let submitLabel = "End Experiment"; // Default submit button label
    let feedback = "";
    const dispatch = createEventDispatcher();

    function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        dispatch('feedbackSubmit', {feedback});
    }
</script>

<form on:submit={handleSubmit}>
    <div class="form-container">
        <textarea class="feedback-textarea" bind:value={feedback} placeholder={placeholder}></textarea>
        <input type="submit" value={submitLabel}>
    </div>
</form>


<style>
    .form-container {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    input[type='submit'] {
        @apply bg-[black] text-[white] rounded-lg cursor-pointer mx-0 my-[5px] px-5 py-3.5 border-[none];
    }

    .feedback-textarea {
        width: 100%;
        max-width: 100%;
        height: 15vw;
        padding: 10px;
        margin-top: 20px;
        box-sizing: border-box;
    }
</style>