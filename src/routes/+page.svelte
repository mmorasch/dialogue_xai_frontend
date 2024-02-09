<script lang="ts">
    import {goto} from '$app/navigation';
    import {base} from '$app/paths';
    import {userId} from '$lib/shared';

    function newExperiment() {
        userId.set(crypto.randomUUID());
        goto(`${base}/intro`);
    }
</script>

<div class="col-start-2 col-end-3" style="display: flex !important; justify-content: center !important; align-items: center !important;">
    <button type="button" class="btn btn-xl variant-filled" on:click={newExperiment}>Start experiment</button>
</div>
