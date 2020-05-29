<script>
    import { link } from 'svelte-spa-router'
    import { trains } from './stores/trains'
    import { now } from './stores/now'
    import { settings } from './stores/settings'
    import TrainBadge from './TrainBadge.svelte'

    $: console.log('settings', $settings)
    $: console.log('trains', $trains)
    $: console.log('now', now)

    const filterTrains = (currentSettings) => {
        const {showOnlyRunning, filterTrainCategories, filterTrainTypes, filterCommuterLineID} = currentSettings
        const filterCategoriesSet = new Set(filterTrainCategories)
        const filterTrainTypesSet = new Set(filterTrainTypes.split(',').map(s => s.toUpperCase()))
        const filterCommuterLineIDSet = new Set(filterCommuterLineID.split(',').map(s => s.toUpperCase()))
        return (train) => {
            if (showOnlyRunning && !train.running) return false;
            if (filterTrainCategories.length > 0 && !filterCategoriesSet.has(train.trainCategory)) return false;
            if (filterTrainTypes.length > 0 && !filterTrainTypesSet.has(train.trainType)) return false;
            if (filterCommuterLineID.length > 0 && !filterCommuterLineIDSet.has(train.commuterLineID)) return false;
            return true;
        }
    }

</script>
<span>{$trains.maxVersion} / {$trains.updated}</span>
<div>
    <h3>Suodattimet</h3>
    <label>Näytä vain junalajit <select multiple bind:value={$settings.filterTrainCategories}>
        {#each $trains.getCategories() as category}
            <option value={category}>
                {category}
            </option>
        {/each}
    </select></label>
    <label>Näytä vain junatyypit <input type=text bind:value={$settings.filterTrainTypes}></label>
    <label>Näytä vain linjatunnukset <input type=text bind:value={$settings.filterCommuterLineID}></label>
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
