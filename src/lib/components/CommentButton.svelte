<script lang="ts">
	import comment from '$lib/assets/comment.png';
	import backend from '$lib/backend';
    import '../../global.css';
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<img class="mr-2.5 mt-2 clickable" src={comment} alt="" width="20" height="20" on:click={backend.firebase.comment}/>
