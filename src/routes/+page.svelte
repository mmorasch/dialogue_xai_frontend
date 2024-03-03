<script lang="ts">
    import {goto} from '$app/navigation';
    import {base} from '$app/paths';
    import {userId} from '$lib/shared';
    import {PUBLIC_DATASET_NAME} from '$env/static/public';


    function newExperiment() {
        userId.set(crypto.randomUUID());
        goto(`${base}/intro/${PUBLIC_DATASET_NAME}`);
    }
</script>

<div class="col-start-2 col-end-3"
     style="display: flex !important; justify-content: center !important; align-items: center !important;">
    <button type="button" class="btn btn-xl variant-filled" on:click={newExperiment}>Start experiment</button>
</div>