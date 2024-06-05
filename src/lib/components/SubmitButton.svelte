<script>
    export let next;
    export let label = "Proceed"; // Default label if none is provided
    export let customStyle = ""; // Accept custom inline styles
</script>

<input
    type="submit"
    value={label}
    class="submit-button"
    style={customStyle}
    on:click|preventDefault={next}
/>

<style lang="postcss">
    .submit-button {
        @apply bg-black text-white rounded-lg cursor-pointer px-5 border-none;
        margin: 1px;
    }
</style>