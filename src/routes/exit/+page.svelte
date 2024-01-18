<script>
  import ExitQuestionnaire from './ExitQuestionnaire.svelte';

  // Get user_id from URL
    const urlParams = new URLSearchParams(window.location.search);
    const user_id = urlParams.get('user_id');

</script>

<div class="col-span-3 space-y-4 p-6 sm:p-8 md:space-y-6 w-3/4 mx-auto">
  {#if user_id}
    <ExitQuestionnaire {user_id}/>
  {/if}
</div>