<script>
    import ExitQuestionnaire from './ExitQuestionnaire.svelte';
    import {userId, studyGroup} from "$lib/shared.ts";

    let user_id;
    let study_group;
    if (typeof window !== 'undefined') {
        user_id = userId.get();
        study_group = studyGroup.get();
    }
</script>

<div class="col-span-3 space-y-4 p-6 sm:p-8 md:space-y-6 w-3/4 mx-auto">
    {#if user_id}
        <ExitQuestionnaire {user_id} {studyGroup}/>
    {/if}
</div>