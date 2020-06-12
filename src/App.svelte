<script>
    import Router, {link} from 'svelte-spa-router'
    import { onMount } from 'svelte';

    import { trains } from './stores/trains'
    import FrontTrainList from './FrontTrainList.svelte'
    import FrontStationList from './FrontStationList.svelte'
    import FrontCompositionList from './FrontCompositionList.svelte'
    import TrainPage from './TrainPage.svelte'
    import StationPage from './StationPage.svelte'
    import NotFound from './NotFound.svelte'

    const routes = {
        '/': FrontTrainList,
        '/stations': FrontStationList,
        '/compositions': FrontCompositionList,
        '/train/:keyDate/:keyNumber': TrainPage,
        '/stations/:stationShortCode': StationPage,
        '*': NotFound,
    }

    onMount(() => {
        window.onunhandledrejection = (e) => {
            console.error(e)
        }
    })
</script>

<main>
    <h1>Kulkutiedot</h1>
    <h2><a href="/" use:link>Junittain</a> - <a href="/stations" use:link>Liikennepaikoittain</a> - <a href="/compositions" use:link>Kokoonpanoittain</a></h2>
    {#if $trains.updated === null}
        <span>Ladataan junien tietoja...</span>
    {:else}
        <Router {routes} />
    {/if}
</main>

<style>
    nav {
        display: flex;
        align-content: stretch;
    }

    nav h2 {
        width: 50%;
    }

    :global(legend) {
        background: none !important;
    }
</style>