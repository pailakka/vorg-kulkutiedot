<script>
    import Router from 'svelte-spa-router'
    import FrontTrainList from './FrontTrainList.svelte'
    import NotFound from './NotFound.svelte'

    const routes = {
        '/': FrontTrainList,
        '*': NotFound,
    }
</script>

<main>
    <h1>Kulkutiedot</h1>
    <Router {routes} />
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