<script lang="ts">
    // URL is defined but not used - assuming you want to use it in returnToProlific function.
    const prolific_url = "https://app.prolific.com/submissions/complete?cc=CLA1QC0Z";

    function returnToProlific() {
        window.location.href = prolific_url;
    }
</script>


<div class="col-start-2 col-end-3 center-content">
    <div class="content-container">
        <p>Thank you! You are done. <br> Your experiment data has been anonymized.
            <br>Click the button to complete the
            experiment and return to prolific.</p>
        <button class="end-btn" on:click={returnToProlific}>Finish Experiment</button>
    </div>
</div>

<style>
    .center-content {
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
    }

    .end-btn {
        @apply bg-black text-white rounded-lg cursor-pointer mx-0 my-5 px-5 py-3.5 border-none;
        margin-top: 10px;
        width: 100%;
    }
</style>