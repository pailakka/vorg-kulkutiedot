<script>
    import {causeCodes} from './stores/metadata'

    export let causes

    let displayCauses
    $: displayCauses = $causeCodes && causes.map(cause => {
        const mostDetailedId = cause.thirdCategoryCodeId || cause.detailedCategoryCodeId || cause.categoryCodeId
        const mostDetailedCause = $causeCodes[mostDetailedId]
        return mostDetailedCause
    })
    $: console.log('displayCauses', displayCauses, '$causeCodes', $causeCodes)
</script>
{#if displayCauses}
    {#each displayCauses as cause,i (cause.id) }
        <span title={cause.name}>{cause.code}</span>{#if i < displayCauses.length-1}, {/if}
    {/each}
{:else}
    <span>{causes.map(cause => cause.thirdCategoryCode || cause.detailedCategoryCode || cause.categoryCode).join(', ')}</span>
{/if}