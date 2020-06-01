<script>
    import {trains} from './stores/trains'
    import {link} from 'svelte-spa-router'
    import {settings} from './stores/settings'
    import Operator from './Operator.svelte'
    import TrainTimeTableRow from './TrainTimeTableRow.svelte'

    export let params = {}
    const trainKey = `${params.keyDate}/${params.keyNumber}`

    let train
    $: train = $trains.getTrain(trainKey)

</script>
<div>
    <span>{$trains.maxVersion} / {$trains.updated}</span>
    <div>
        <h3>Suodattimet</h3>
        <label>Näytä ohitukset <input type=checkbox bind:checked={$settings.showPassing}></label>
    </div>
    <a href="/" use:link>Palaa takaisin junalistaukseen</a>
    <h2>{train.trainNumber} / {train.departureDate}}</h2>
    <table>
        <tr>
            <th>Tyyppi:</th>
            <td>{train.trainCategory}</td>
        </tr>
        <tr>
            <th>Laji:</th>
            <td>{train.trainType}</td>
        </tr>
        <tr>
            <th>Numero:</th>
            <td>{train.trainNumber}</td>
        </tr>
        <tr>
            <th>Linjatunnus:</th>
            <td>{train.commuterLineID}</td>
        </tr>
        <tr>
            <th>Operaattori:</th>
            <td>
                <Operator operatorShortCode={train.operatorShortCode}/>
            </td>
        </tr>
        <tr>
            <th>Kulussa:</th>
            <td>{train.runningCurrently}</td>
        </tr>
        <tr>
            <th>Peruttu:</th>
            <td>{train.cancelled}</td>
        </tr>
        <tr>
            <th>Aikataululaji:</th>
            <td>{train.timetableType}</td>
        </tr>
        <tr>
            <th>Aikataulu hyväksytty:</th>
            <td>{train.timetableAcceptanceDate}</td>
        </tr>
        <tr>
            <th>Tietojen versio:</th>
            <td>{train.version}</td>
        </tr>
        <tr>
            <th>Tiedot päivitetty:</th>
            <td>{train.updated}</td>
        </tr>
    </table>
    {#if train.lastTrainReady !== undefined}
        <h3>Lähtövalmiusilmoitus</h3>
        <table>
            <tr>
                <th>Aika:</th>
                <td>{train.lastTrainReady.timestamp}</td>
            </tr>
            <tr>
                <th>Hyväksytty:</th>
                <td>{train.lastTrainReady.accepted}</td>
            </tr>
            <tr>
                <th>Järjestelmä:</th>
                <td>{train.lastTrainReady.source}</td>
            </tr>
        </table>
    {/if}
    <h3>Kulkutiedot</h3>
    <table>
        <thead>
        <tr>
            <th>Asema</th>
            <th>Raide</th>
            <th>Tapahtuma</th>
            <th>Aikataulu</th>
            <th>Ennuste</th>
            <th>Toteutunut</th>
            <th>Ero</th>
            <th>Syykoodit</th>
        </tr>
        </thead>
        {#each train.timeTableRows.filter(ttr => $settings.showPassing || ttr.trainStopping) as ttr (ttr.key)}
            <TrainTimeTableRow {ttr}/>
        {/each}
    </table>
    <pre>{JSON.stringify(train, null, 4)}</pre>
</div>
