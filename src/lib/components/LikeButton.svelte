<script lang="ts">
	import like from '$lib/assets/like.png';
	import Modal from './Modal.svelte';

	let showModal = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<img class="mr-2.5 mt-2" src={like} alt="" width="20" height="20" on:click={() => showModal = !showModal}/>
<Modal type={"positive"} showModal={showModal} />