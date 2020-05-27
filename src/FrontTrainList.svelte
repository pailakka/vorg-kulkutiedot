<script>
    import {link} from 'svelte-spa-router'
    import { trains } from './stores/trains'
    import TrainBadge from './TrainBadge.svelte'

    $: console.log($trains)
</script>
<span>{$trains.maxVersion} / {$trains.updated}</span>

{#each $trains.trainsByCategory() as category (category.key)}
    <fieldset>
        <legend>{category.key}</legend>
        <div class="front-train-container">
            {#each category.trains as train (train.key)}
                <a href={`/train/${train.key}`} use:link><TrainBadge train={train} /></a>
            {/each}
        </div>
    </fieldset>
{/each}

<style>
    .front-train-container {
        display: grid;
        grid-gap: 0.5rem;
        grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
    }
</style>
