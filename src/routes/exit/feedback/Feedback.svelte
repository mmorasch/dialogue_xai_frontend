<script lang="ts">
    import backend from "$lib/backend.js";
    import {goto} from "$app/navigation";
    import {base} from "$app/paths";

    export let user_id;
    let feedback = "";

    async function handleSubmit(event) {
        event.preventDefault();
        fetch(`${base}/api/exit/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id,
                feedback
            })
        });
        await backend.xai(user_id).finish();
        goto(`${base}/exit/endscreen`);
    }
</script>

<form on:submit={handleSubmit}>
    <div class="col-span-3 space-y-4 p-6 sm:p-8 md:space-y-6 w-3/4 mx-auto">

        <h1 class="center-text text-xl">Thank you for the participation!</h1>
        <h2>Since this is the prestudy, please leave any opinion and your name here so we can talk and I can link the
            experiment results to you for further analysis together. :)</h2>
        <textarea class="feedback-textarea" bind:value={feedback}></textarea>
        <input type="submit" value="End Experiment">
    </div>
</form>

<style>
    .center-text {
        display: block;
        text-align: center;
    }

    .feedback-textarea {
        width: 100%; /* adjust as needed */
        height: 100px; /* adjust as needed */
        padding: 10px;
        margin-top: 20px;
        box-sizing: border-box;
    }

    input[type='submit'] {
        @apply bg-[black] text-[white] rounded-lg cursor-pointer mx-0 my-[5px] px-5 py-3.5 border-[none];
        position: absolute;
        bottom: 2vh;
        right: 4vh;
        left: auto;
    }

</style>