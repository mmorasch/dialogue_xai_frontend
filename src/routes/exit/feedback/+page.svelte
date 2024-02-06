<script lang="ts">
    import Feedback from "$lib/components/FeedbackWindow.svelte";
    import {base} from '$app/paths';
    import backend from "$lib/backend";
    import {goto} from "$app/navigation";

    // Get user_id from URL
    const urlParams = new URLSearchParams(window.location.search);
    const user_id = urlParams.get('user_id');

    async function handleFeedbackSubmit(event) {
        const {feedback} = event.detail;

        try {
            // Submit feedback to the backend
            const response = await fetch(`${base}/api/exit/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({user_id, feedback}),
            });

            if (!response.ok) throw new Error('Failed to submit feedback');

            await backend.xai(user_id).finish();
            goto(`${base}/exit/endscreen`);
        } catch (error) {
            console.error("Error during feedback submission:", error);
        }
    }
</script>

<div class="center-page">
    {#if user_id}
        <h1 class="center-text text-xl">Thank you for the participation!</h1>
        <h2>Since this is the prestudy, please leave any opinion and your name here so we can talk and I can link the
            experiment results to you for further analysis together. :)</h2>
        <Feedback
                {user_id}
                placeholder="Please leave any opinion and your name here..."
                submitLabel="End Experiment"
                on:feedbackSubmit={handleFeedbackSubmit}
        />
    {/if}
</div>


<style>
    .center-text {
        display: block;
        text-align: center;
    }

    .center-page {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 100vh;
        width: 100vw;
    }
</style>