<script>
    import {trains} from './stores/trains'
    import {link} from 'svelte-spa-router'
    import {settings} from './stores/settings'
    import Operator from './Operator.svelte'
    import TrainTimeTableRow from './TrainTimeTableRow.svelte'
    import TrainComposition from './TrainComposition.svelte'
    import TrainRoutesets from './TrainRoutesets.svelte'
    import TrainTracking from './TrainTracking.svelte'
    import FormattedDate from './FormattedDate.svelte'
    import Station from "./Station.svelte";
    import {CATEGORY_TRANSLATE} from "./stores/domain/trains";

    export let params = {}
    const trainKey = `${params.keyDate}/${params.keyNumber}`

    let showTrainRouteSets = false
    let showTrainTracking = false
    let train
    $: train = $trains.getTrain(trainKey)

</script>
<div>
    <a href="/" use:link>Palaa takaisin junalistaukseen</a>
    <h2>{train.trainNumber} / {train.departureDate}</h2>
    <table class="pure-table pure-table-bordered pure-table-striped">
        <tr>
            <th>Tyyppi:</th>
            <td>{CATEGORY_TRANSLATE[train.trainCategory]}</td>
        </tr>
        <tr>
            <th>Numero:</th>
            <td>{train.trainType} {train.trainNumber}{#if train.commuterLineID} ({train.commuterLineID}){/if}</td>
        </tr>
        <tr>
            <th>Operaattori:</th>
            <td>
                <Operator operatorShortCode={train.operatorShortCode}/>
            </td>
        </tr>
        <tr>
            <th>Kulussa:</th>
            <td>{train.runningCurrently ? "Kyllä" : "Ei"}</td>
        </tr>
        <tr>
            <th>Peruttu:</th>
            <td>{train.cancelled ? "Kyllä" : "Ei"}</td>
        </tr>
        <tr>
            <th>Aikataululaji:</th>
            <td>{train.timetableType}</td>
        </tr>
        <tfoot>
        <tr>
            <th colspan="2">
                <small>Junan tiedot päivitetty:
                    <FormattedDate date={train.updated}/>
                </small>
            </th>
        </tr>
        </tfoot>
    </table>
    <h3>Kulkutiedot</h3>

    <table class="pure-table pure-table-bordered pure-table-striped">
        <thead>
        <tr>
            <th colspan="8">
                <label>Näytä ohitukset <input type=checkbox bind:checked={$settings.showPassing}></label>
            </th>
        </tr>
        <tr>
            <th>Asema</th>
            <th>Raide</th>
            <th>Tapahtuma</th>
            <th>Aikataulu</th>
            <th>Ennuste</th>
            <th>Toteutunut</th>
            <th>Ero</th>
            <th>Huomautukset</th>
        </tr>
        </thead>
        {#each train.timeTableRows.filter(ttr => $settings.showPassing || ttr.trainStopping) as ttr (ttr.key)}
            <TrainTimeTableRow {ttr}/>
        {/each}
    </table>
    <TrainComposition trainNumber={train.trainNumber} departureDate={train.departureDate}/>
    <h3><a on:click={() => showTrainRouteSets = !showTrainRouteSets}>{#if showTrainRouteSets}
        Kulkutievaraukset{:else}Näytä kulkutievaraukset{/if}</a></h3>
    {#if showTrainRouteSets}
        <TrainRoutesets trainNumber={train.trainNumber} departureDate={train.departureDate}/>
    {/if}
    <h3><a on:click={() => showTrainTracking = !showTrainTracking}>{#if showTrainTracking}
        Kulkutieviestit{:else}Näytä kulkutieviestit{/if}</a></h3>
    {#if showTrainTracking}
        <TrainTracking trainNumber={train.trainNumber} departureDate={train.departureDate}/>
    {/if}
</div>

<style>
    table {
        width: 100%;
    }
</style>
