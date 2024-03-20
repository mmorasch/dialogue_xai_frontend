<script>
    export let next;
    export let label = "Proceed"; // Default label if none is provided
</script>

<input type="submit" value={label} class="submit-button" on:click|preventDefault={next} />

<style lang="postcss">
    .submit-button {
        @apply bg-black text-white rounded-lg cursor-pointer mx-0 my-5 px-5 py-3.5 border-none;
        position: absolute;
        bottom: 0;
        left: 15%;
        width: 70%;
    }
</style>
