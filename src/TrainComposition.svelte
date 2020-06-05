<script>
    import {getDigitrafficEndpoint} from "./lib/util.js";
    import Station from "./Station.svelte";

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
        <table class="zebra">
            <thead>
            <tr>
                <th>Kulkuväli</th>
                <th>Veturit</th>
                <th>Vaunut</th>
                <th>Pituus</th>
                <th>SN</th>
            </tr>
            </thead>
            <tbody>
            {#each composition.journeySections as section}
                <tr>
                    <td>
                        <Station stationShortCode={section.beginTimeTableRow.stationShortCode}/>
                        -
                        <Station stationShortCode={section.endTimeTableRow.stationShortCode}/>
                    </td>
                    <td>{section.locomotives.map(loc => loc.locomotiveType).join(', ')}</td>
                    <td>{section.wagons.map(wag => wag.wagonType).join(', ')}</td>
                    <td>{section.totalLength} m</td>
                    <td>{section.maximumSpeed} km/h</td>
                </tr>
            {/each}
            </tbody>
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