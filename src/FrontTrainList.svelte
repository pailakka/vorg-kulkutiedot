<script>
    import { link } from 'svelte-spa-router'
    import { trains } from './stores/trains'
    import { settings } from './stores/settings'
    import { filterTrains } from './lib/util'
    import TrainBadge from './TrainBadge.svelte'
    import FormattedDate from './FormattedDate.svelte'

</script>
<span>Junien tiedot päivitetty: <FormattedDate date={$trains.updated} /></span>
<div>
    <h3>Suodattimet</h3>
    <label>Näytä vain junalajit <select multiple bind:value={$settings.filterTrainCategories}>
        {#each $trains.getCategories() as category}
            <option value={category}>
                {category}
            </option>
        {/each}
    </select></label><br/>
    <label>Näytä vain junatyypit <input type=text bind:value={$settings.filterTrainTypes}></label><br/>
    <label>Näytä vain linjatunnukset <input type=text bind:value={$settings.filterCommuterLineID}></label><br/>
    <label>Näytä vain kulussa olevat junat <input type=checkbox bind:checked={$settings.showOnlyRunning}></label>
</div>
{#each $trains.trainsByCategory() as category (category.key)}
    <fieldset>
        <legend>{category.key}</legend>
        <div class="front-train-container">
            {#each category.trains.filter(filterTrains($settings)) as train (train.key)}
                <a href={`/train/${train.key}`} use:link>
                    <TrainBadge train={train} />
                </a>
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
