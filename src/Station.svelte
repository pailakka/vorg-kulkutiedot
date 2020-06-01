<script>
    import {stations} from './stores/metadata'

    export let stationUICCode = null

    let station
    $: station = $stations[stationUICCode]
</script>


{#if station}
    <span title={station.stationName} class:notstation={station.type !== 'STATION'}>{station.stationShortCode}</span>
{/if}


<style>
    .notstation {
        font-style: italic;
    }
</style>