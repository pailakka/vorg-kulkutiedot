<script>
    import {link} from 'svelte-spa-router'
    import {sortBy} from 'lodash'
    import {stations} from './stores/metadata'
    import {trains} from './stores/trains'
    import {settings} from './stores/settings'
    import {filterTrains} from './lib/util'
    import {EVENT_HUMAN_READABLE} from "./stores/metadata"
    import FormattedDate from './FormattedDate.svelte'
    import Causes from './Causes.svelte'
    import Station from './Station.svelte'
    import {CATEGORY_TRANSLATE} from "./stores/domain/trains";

    export let params = {}

    const paramShortCode = decodeURI(params.stationShortCode)

    let station = null
    let stationTrains = null
    let trainsByStations = {}
    $: {
        const trainFilter = filterTrains($settings)
        station = $stations[paramShortCode]
        stationTrains = $trains.trainsByStation(paramShortCode, trainFilter)

        if (stationTrains) {
            stationTrains.sort((t1, t2) => t2.ttr.referenceTime - t1.ttr.referenceTime)
        }
    }
</script>

<div>
    <form class="pure-form pure-form-stacked">
        <fieldset>
            <legend>Suodattimet</legend>
            <div class="pure-g">
                <div class="pure-u-1 pure-u-md-1-3">
                    <br/>
                    <button class="pure-button"
                            class:pure-button-active={$settings.showOnlyRunning}
                            on:click={() => $settings.showOnlyRunning = !$settings.showOnlyRunning}
                            type="button">
                        {$settings.showOnlyRunning ? "Näytä kaikki junat" : "Näytä vain kulussa olevat junat"}
                    </button>
                </div>
                <div class="pure-u-1 pure-u-md-1-3">
                    <label>Näytä vain junatyypit</label>
                    <input type=text bind:value={$settings.filterTrainTypes} class="pure-u-23-24">
                </div>
                <div class="pure-u-1 pure-u-md-1-3">
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
<a href="/stations" use:link>Palaa takaisin asemalistaukseen</a>
{#if station}
    <h2>{station.stationName} ({station.stationShortCode} / {station.stationUICCode})</h2>
    <h3>Kulkutiedot</h3>
    {#if stationTrains}
        <table class="pure-table pure-table-bordered pure-table-striped">
            <thead>
            <tr>
                <th>Juna</th>
                <th>Raide</th>
                <th>Tapahtuma</th>
                <th>Aikataulu</th>
                <th>Ennuste</th>
                <th>Toteutunut</th>
                <th>Ero</th>
                <th>Syyluokka</th>
                <th>Lähtöpaikka</th>
                <th>Määränpää</th>
            </tr>

            </thead>
            <tbody>
            {#each stationTrains as {train, ttr} (ttr.key)}
                <tr>
                    <td><a href={`/train/${train.key}`}
                           use:link>{train.commuterLineID || train.trainType} {train.trainNumber}</a></td>
                    <td>{ttr.commercialTrack}</td>
                    <td>{EVENT_HUMAN_READABLE[ttr.richType] ? EVENT_HUMAN_READABLE[ttr.richType] : ttr.richType}</td>
                    <td>
                        <FormattedDate date={ttr.scheduledTime}/>
                    </td>
                    <td>
                        <FormattedDate date={ttr.liveEstimateTime}/>
                    </td>
                    <td>
                        <FormattedDate date={ttr.actualTime}/>
                    </td>
                    <td>{ttr.differenceInMinutes ? ttr.differenceInMinutes : ''}</td>
                    <td>{#if ttr.causes.length > 0}
                        <Causes causes={ttr.causes}/>{/if}</td>
                    <td>
                        {#if train.cancelled}
                            Peruttu
                        {:else}
                            <a href={`/stations/${train.getFirstTimetableRow().stationShortCode}`} use:link>
                                <Station stationShortCode={train.getFirstTimetableRow().stationShortCode}/>
                            </a>
                        {/if}

                    </td>
                    <td>
                        {#if train.cancelled}
                            Peruttu
                        {:else}

                            <a href={`/stations/${train.getLastTimetableRow().stationShortCode}`} use:link>
                                <Station stationShortCode={train.getLastTimetableRow().stationShortCode}/>
                            </a>
                        {/if}
                    </td>
                </tr>
            {/each}
            </tbody>
        </table>
    {:else}
        <p>Liikennepaikalla ei junia</p>
    {/if}
{:else}
    Asemaa ei löydy
{/if}

<style>
    table {
        width: 100%;
    }

    .cateogry-container {
        display: grid;
        grid-gap: 0.5rem;
        grid-template-columns: repeat(auto-fit, minmax(135px, 1fr));
    }
</style>
