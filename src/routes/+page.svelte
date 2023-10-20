<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { userId } from '$lib/shared';

	function newExperiment() {
		userId.set(crypto.randomUUID());
		goto(`${base}/intro`);
	}
</script>

<div class="col-start-1 col-end-4 mx-auto">
	<button type="button" class="btn btn-xl variant-filled" on:click={newExperiment}>Start experiment</button>
</div>
