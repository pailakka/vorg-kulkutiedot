<script>
    import { link } from 'svelte-spa-router'
    import { sortBy } from 'lodash'
    import { stations } from './stores/metadata'
    import { trains } from './stores/trains'
    import { settings } from './stores/settings'
    import { filterTrains } from './lib/util'

    let stationsByFirstLetter = {}
    let firstLetters = []
    let trainsByStations = {}
    $: {
        stationsByFirstLetter = {}

        const trainFilter = filterTrains($settings)
        trainsByStations = $trains.trainsByStation(null, trainFilter)
        console.log('trainsByStations',trainsByStations)
        Object.values($stations).forEach(st => {
            const firstLetter = st.stationShortCode[0]
            st.trainCount = trainsByStations[st.stationShortCode] ? trainsByStations[st.stationShortCode].length : 0
            if (stationsByFirstLetter[firstLetter] === undefined) {
                stationsByFirstLetter[firstLetter] = []
            }
            stationsByFirstLetter[firstLetter].push(st)
        })
        firstLetters = Object.keys(stationsByFirstLetter)
        firstLetters.sort((a, b) => a.localeCompare(b))
    }
</script>
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
    <label>Näytä vain asemat joilla junia <input type=checkbox bind:checked={$settings.hideEmptyStations}></label>
</div>
{#each  firstLetters as firstLetter}
    <fieldset>
        <legend>{firstLetter}</legend>
        <div class="station-container">
            {#each stationsByFirstLetter[firstLetter] as station}
                {#if !$settings.hideEmptyStations || station.trainCount > 0}
                    <a href={`/stations/${station.stationShortCode}`} use:link>
                        <div class="station-badge">{station.stationShortCode} ({station.trainCount})</div>
                    </a>
                {/if}
            {/each}
        </div>
    </fieldset>
{/each}

<style>
    .station-badge {
        text-align: center;
        border: 2px solid black;
        padding: 3px;
        color: black
    }

    .station-container {
        display: grid;
        grid-gap: 0.5rem;
        grid-template-columns: repeat(auto-fit, 90px);
    }
</style>

