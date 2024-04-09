<script>
    import {SyncLoader} from 'svelte-loading-spinners';
    import { onMount } from 'svelte';

    export let dark_background = true; // Change this line to accept a prop

    let loading = false;

    onMount(() => {
        setTimeout(() => {
            loading = true;
        }, 200);
    });
</script>

{#if loading}
<div class="spinner" style="background-color: {dark_background ? 'rgba(0, 0, 0, 0.5)' : 'transparent'}">
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
}
</style>