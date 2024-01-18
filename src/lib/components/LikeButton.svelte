<script lang="ts">
    import like from '$lib/assets/like.png';
    import Modal from './Modal.svelte';
    import '../../global.css';
    import backend from '$lib/backend';

    let showModal = false;
    let comment = '';
    let userId = 'user_id'; // replace with actual user id
    let datapointCount = 0; // replace with actual datapoint count
    let likeType = 'positive'; // replace with actual like type



     function handleLike() {
         showModal = !showModal;
         if (showModal) {
             backend.firebase.logLikeEvent(userId, datapointCount, likeType, comment);
         }
     }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<img class="mr-2.5 mt-2 clickable" src={like} alt="" width="20" height="20" on:click={handleLike}/>
<Modal type={"positive"} showModal={showModal}/>