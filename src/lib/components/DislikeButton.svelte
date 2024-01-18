<script lang="ts">
	import like from '$lib/assets/like.png';
	import backend from '$lib/backend';
    import '../../global.css';
    import Modal from "$lib/components/Modal.svelte";

    let showModal = false;

    function handleDislike() {
      showModal = !showModal;
      // Assuming 'posts' is your collection and 'postId' is the id of the post
      backend.firebase.negative_feedback();
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<img class="mr-2.5 mt-2 rotate-180 clickable" src={like} alt="" width="20" height="20" on:click={handleDislike}/>
<Modal type={"negative"} showModal={showModal} />