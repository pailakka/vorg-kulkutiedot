<script>
    import { link } from 'svelte-spa-router'
    import { sortBy } from 'lodash'
    import { stations } from './stores/metadata'
    import { trains } from './stores/trains'
    import { settings } from './stores/settings'
    import { filterTrains } from './lib/util'
    import FormattedDate from './FormattedDate.svelte'
    import Causes from './Causes.svelte'
    import Station from './Station.svelte'

    export let params = {}

    const paramShortCode = decodeURI(params.stationShortCode)
    console.log('params.stationShortCode',params.stationShortCode)

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
<a href="/stations" use:link>Palaa takaisin asemalistaukseen</a>
{#if station}
    <h2>{station.stationName} ({station.stationShortCode} / {station.stationUICCode})</h2>
    <span><strong>Tyyppi:</strong> {station.type}
        , <strong>Matkustajaliikennettä:</strong> {station.passengerTraffic}</span>
    <h3>Kulkutiedot</h3>
    {#if stationTrains}
        <table>
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
                    <td>{ttr.richType}</td>
                    <td>
                        <FormattedDate date={ttr.scheduledTime} />
                    </td>
                    <td>
                        <FormattedDate date={ttr.liveEstimateTime} />
                    </td>
                    <td>
                        <FormattedDate date={ttr.actualTime} />
                    </td>
                    <td>{ttr.differenceInMinutes ? ttr.differenceInMinutes : ''}</td>
                    <td>{#if ttr.causes.length > 0}
                        <Causes causes={ttr.causes} />{/if}</td>
                    <td>
                        {#if train.cancelled}
                            Peruttu
                        {:else}
                            <a href={`/stations/${train.getFirstTimetableRow().stationShortCode}`} use:link>
                                <Station stationShortCode={train.getFirstTimetableRow().stationShortCode} />
                            </a>
                        {/if}

                    </td>
                    <td>
                        {#if train.cancelled}
                            Peruttu
                        {:else}

                            <a href={`/stations/${train.getLastTimetableRow().stationShortCode}`} use:link>
                                <Station stationShortCode={train.getLastTimetableRow().stationShortCode} />
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