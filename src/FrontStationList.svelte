<script>
    import {link} from 'svelte-spa-router'
    import {sortBy} from 'lodash'
    import {stations} from './stores/metadata'
    import {trains} from './stores/trains'
    import {settings} from './stores/settings'
    import {CATEGORY_TRANSLATE} from "./stores/domain/trains";
    import {filterTrains} from './lib/util'

    let stationsByFirstLetter = {}
    let firstLetters = []
    let trainsByStations = {}
    $: {
        stationsByFirstLetter = {}

        const trainFilter = filterTrains($settings)
        trainsByStations = $trains.trainsByStation(null, trainFilter)
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
    <form class="pure-form pure-form-stacked">
        <fieldset>
            <legend>Suodattimet</legend>
            <div class="pure-g">
                <div class="pure-u-1 pure-u-md-1-4">
                    <br/>
                    <button class="pure-button"
                            class:pure-button-active={$settings.showOnlyRunning}
                            on:click={() => $settings.showOnlyRunning = !$settings.showOnlyRunning}
                            type="button">
                        {$settings.showOnlyRunning ? "Näytä vain kulussa olevat junat" : "Näytä kaikki junat"}
                    </button>
                </div>
                <div class="pure-u-1 pure-u-md-1-4">
                    <br/>
                    <button class="pure-button"
                            class:pure-button-active={!$settings.hideEmptyStations}
                            on:click={() => $settings.hideEmptyStations = !$settings.hideEmptyStations}
                            type="button">
                        {$settings.hideEmptyStations ? "Näytä kaikki asemat" : "Näytä vain asemat joilla junia"}
                    </button>
                </div>
                <div class="pure-u-1 pure-u-md-1-4">
                    <label>Näytä vain junatyypit</label>
                    <input type=text bind:value={$settings.filterTrainTypes} class="pure-u-23-24">
                </div>
                <div class="pure-u-1 pure-u-md-1-4">
                    <label>Näytä vain linjatunnukset</label>
                    <input type=text bind:value={$settings.filterCommuterLineID} class="pure-u-23-24">
                </div>
            </div>
            <fieldset>
                <legend>Suodata junalajeja</legend>
                <div class="cateogry-container">
                    {#each $trains.getCategories() as category}
                        <div class="category-input">
                            <label>{CATEGORY_TRANSLATE[category] || category} <input type="checkbox" value={category}
                                                                                     bind:group={$settings.filterTrainCategories}/></label>
                        </div>
                    {/each}
                </div>
            </fieldset>
        </fieldset>
    </form>
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
        border: 1px solid black;
        padding: 3px;
        color: black
    }

    .station-container {
        display: grid;
        grid-gap: 0.5rem;
        grid-template-columns: repeat(auto-fit, 90px);
    }

    .cateogry-container {
        display: grid;
        grid-gap: 0.5rem;
        grid-template-columns: repeat(auto-fit, minmax(135px, 1fr));
    }
</style>

