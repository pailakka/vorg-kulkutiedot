<script>
    import {getDigitrafficEndpoint} from "./lib/util.js";
    import Station from "./Station.svelte";

    export let trainNumber;
    export let departureDate;

    const routesets = getDigitrafficEndpoint(`routesets/${departureDate}/${trainNumber}`)

</script>

<h3>Kulkutievaraukset</h3>
{#await routesets}
    <span>Ladataan kulkutievarauksia... {departureDate} / {trainNumber}</span>
{:then routesets}
<table>
    <thead>
        <tr>
            <th>Tyyppi</th>
            <th>Järjestelmä</th>
            <th>Aika</th>
            <th>Varaukset</th>
        </tr>
    </thead>
    <tbody>
    {#each routesets as routemsg (routemsg.messageTime + routemsg.version)}
        <tr>
            <td>{routemsg.routeType}</td>
            <td>{routemsg.clientSystem}</td>
            <td>{routemsg.messageTime}</td>
            <td>{JSON.stringify(routemsg.routesections)}</td>
        </tr>
    {/each}
    </tbody>
</table>
<pre>{JSON.stringify(routesets, null, 4)}</pre>
{:catch error}
    <p>Kokoonpanon lataaminen epäonnistui</p>
{/await}