<script lang="ts">
    import {createEventDispatcher} from 'svelte';
    export let showModal: boolean;
    export let userInput = '';

    const dispatch = createEventDispatcher();

    let dialog: HTMLDialogElement;

    function handleSubmit() {
        dialog.close();
        dispatch('close', userInput);
    }

    $: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
        bind:this={dialog}
        on:close={() => (showModal = false)}
        on:click|self={() => dialog.close()}
>
    <div on:click|stopPropagation>
        <slot>
            <textarea bind:value={userInput} placeholder="Provide additional feedback"></textarea>
            <div class="button-container">
                <button on:click={handleSubmit}>Submit</button>
                <!-- svelte-ignore a11y-autofocus -->
                <button autofocus on:click={() => dialog.close()}>Cancel</button>
            </div>
        </slot>
    </div>
</dialog>

<style>
	dialog {
		max-width: 32em;
		min-height: 10em;
		border-radius: 0.2em;
		border: none;
		padding: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	 button {
	  display: block;
	  padding: 10px 20px; /* Add padding */
	  border: none; /* Remove default border */
	  border-radius: 5px; /* Add border radius */
	  background-color: black;
	  color: white; /* Change text color */
	  cursor: pointer; /* Change cursor on hover */
	 }
	.button-container {
	  display: flex;
	  justify-content: space-between;
	}
	 textarea {
	  width: 100%;
	  height: 7em;
	 }

</style>
