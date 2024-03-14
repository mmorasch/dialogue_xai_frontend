<script lang="ts">
    import FeedbackWindow from "$lib/components/FeedbackWindow.svelte";
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
    <h1 class="center-text text-xl">Thank you for your participation!</h1>

        <h2 class="center-text text-xl">
        By participating, you help to bridge the gap between AI and humans. <br>
        With our research project we aim to understand how different people understand the <br>
        predictions of machine learning models in order to foster trust and transparency. <br> <br></h2>

    <h2 class="center-text">Please leave any additional opinion about the experiment :)</h2>
    <FeedbackWindow
            placeholder="To me, the experiment..."
            submitLabel="End Experiment"
            on:feedbackSubmit={handleFeedbackSubmit}
    />

    <h2>You can contact me in case you have any questions: <br>
        <b>dimitry.mindlin@uni-bielefeld.de</b> <br></h2>
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
        width: 100vw;
        margin: 5vh;
    }
</style>