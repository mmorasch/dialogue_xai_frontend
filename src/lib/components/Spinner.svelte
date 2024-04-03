<script>
    import {SyncLoader} from 'svelte-loading-spinners';
    import { onMount } from 'svelte';

    let loading = false;

    onMount(() => {
        setTimeout(() => {
            loading = true;
        }, 200);
    });
</script>

{#if loading}
<div class="spinner">
    <SyncLoader size="40" color="Green" unit="px" duration="1s" />
</div>
{/if}

<style>
.spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.5);
}
</style>