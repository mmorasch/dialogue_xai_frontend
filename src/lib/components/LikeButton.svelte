<script lang="ts">
	import like from '$lib/assets/like.png';
	import Modal from './Modal.svelte';
    import '../../global.css';
    import backend from '$lib/backend';

	let showModal = false;

     function handleLike() {
      showModal = !showModal;
      // Assuming 'posts' is your collection and 'postId' is the id of the post
      backend.firebase.positive_feedback()
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<img class="mr-2.5 mt-2 clickable" src={like} alt="" width="20" height="20" on:click={handleLike}/>
<Modal type={"positive"} showModal={showModal} />