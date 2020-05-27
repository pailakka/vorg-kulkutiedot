<script>
    import Router, {link} from 'svelte-spa-router'

    import { trains } from './stores/trains'
    import FrontTrainList from './FrontTrainList.svelte'
    import TrainPage from './TrainPage.svelte'
    import NotFound from './NotFound.svelte'

    const routes = {
        '/': FrontTrainList,
        '/train/:keyDate/:keyNumber': TrainPage,
        '*': NotFound,
    }
</script>

<main>
    <h1><a href="/" use:link>Kulkutiedot</a></h1>
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
</style>