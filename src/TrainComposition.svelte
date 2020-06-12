<script>
    import {getDigitrafficEndpoint} from "./lib/util.js";
    import Station from "./Station.svelte";
    import {link} from 'svelte-spa-router'

    export let trainNumber;
    export let departureDate;

    const composition = getDigitrafficEndpoint(`compositions/${departureDate}/${trainNumber}`)
</script>

<h3>Kokoonpano</h3>
{#await composition}
    <span>Ladataan kokoonpanoa... {departureDate} / {trainNumber}</span>
{:then composition}
    {#if composition.errorMessage}
        <p>Virhe: {composition.errorMessage}</p>
    {:else}
        <table class="pure-table pure-table-bordered pure-table-striped">
            {#each composition.journeySections as section}
                <thead>
                <tr>
                    <th colspan="6">Välillä
                        <Station stationShortCode={section.beginTimeTableRow.stationShortCode}/>
                        -
                        <Station stationShortCode={section.endTimeTableRow.stationShortCode}/>
                        / Pituus: {section.totalLength} m
                        / SN: {section.maximumSpeed} km/h
                    </th>
                </tr>
                <tr>
                    <th colspan="6">Veturit</th>
                </tr>
                <tr>
                    <th>Sijainti</th>
                    <th colspan="4">Tyyppi</th>
                    <th>Numero</th>
                </tr>
                </thead>
                <tbody>
                {#each section.locomotives as loco}
                    <tr>
                        <td>{loco.location}</td>
                        <td colspan="4">{loco.locomotiveType} ({loco.powerType})</td>
                        <td>{loco.vehicleNumber || ""}</td>
                    </tr>
                {/each}
                </tbody>
                <thead>
                <tr>
                    <th colspan="6">Vaunut</th>
                </tr>
                <tr>
                    <th>Sijainti</th>
                    <th>Myyntinumero</th>
                    <th>Tyyppi</th>
                    <th>Pituus</th>
                    <th>Palvelut</th>
                    <th>Numero</th>
                </tr>
                </thead>
                <tbody>
                {#each section.wagons as wago}
                    <tr>
                        <td>{wago.location}</td>
                        <td>{wago.salesNumber}</td>
                        <td>{wago.wagonType}</td>
                        <td>{wago.length} mm</td>
                        <td>{#each ['playground', 'pet', 'catering','video','luggage','smoking','disabled'] as service}{#if wago[service]}{service}
                            &nbsp;{/if}{/each}</td>
                        <td>{wago.vehicleNumber || ""}</td>
                    </tr>
                {/each}
                </tbody>
            {/each}
        </table>
    {/if}
{:catch error}
    <p>Kokoonpanon lataaminen epäonnistui</p>
{/await}

<style>
    table {
        width: 100%;
    }
</style>