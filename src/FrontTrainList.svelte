<script>
    import {link} from 'svelte-spa-router'
    import {trains} from './stores/trains'
    import {CATEGORY_TRANSLATE} from "./stores/domain/trains";
    import {settings} from './stores/settings'
    import {filterTrains} from './lib/util'
    import TrainBadge from './TrainBadge.svelte'
    import FormattedDate from './FormattedDate.svelte'

</script>
<span>Junien tiedot päivitetty: <FormattedDate date={$trains.updated}/></span>
<div>
    <form class="pure-form pure-form-stacked">
        <fieldset>
            <legend><h3>Suodattimet</h3></legend>
            <div class="pure-g">
                <div class="pure-u-1 pure-u-md-1-3">
                    <br/>
                    <button class="pure-button"
                            class:pure-button-active={$settings.showOnlyRunning}
                            on:click={() => $settings.showOnlyRunning = !$settings.showOnlyRunning}
                            type="button">
                        {$settings.showOnlyRunning ? "Näytä kaikki junat" : "Näytä vain kulussa olevat junat"}
                    </button>
                </div>
                <div class="pure-u-1 pure-u-md-1-3">
                    <label>Näytä vain junatyypit</label>
                    <input type=text bind:value={$settings.filterTrainTypes} class="pure-u-23-24">
                </div>
                <div class="pure-u-1 pure-u-md-1-3">
                    <label>Näytä vain linjatunnukset</label>
                    <input type=text bind:value={$settings.filterCommuterLineID} class="pure-u-23-24">
                </div>
            </div>
            <fieldset>
                <legend><h4>Suodata junalajeja</h4></legend>
                <div class="cateogry-container">
                    {#each $trains.getCategories() as category}
                        <div class="category-input">
                            <label>{CATEGORY_TRANSLATE[category] || category} <input type="checkbox" value={category}
                                                                                     bind:group={$settings.filterTrainCategories}/></label>
                        </div>
                    {/each}
                </div>
            </fieldset>
        </fieldset>
    </form>
</div>
{#each $trains.trainsByCategory() as category (category.key)}
    <fieldset>
        <legend><h3>{CATEGORY_TRANSLATE[category.key] || category.key}</h3></legend>
        <div class="front-train-container">
            {#each category.trains.filter(filterTrains($settings)) as train (train.key)}
                <a href={`/train/${train.key}`} use:link>
                    <TrainBadge train={train}/>
                </a>
            {/each}
        </div>
    </fieldset>
{/each}

<style>
    .front-train-container {
        display: grid;
        grid-gap: 0.5rem;
        grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
    }

    .front-train-container a:hover {
        text-decoration: none;
        font-weight: bold;
    }

    .cateogry-container {
        display: grid;
        grid-gap: 0.5rem;
        grid-template-columns: repeat(auto-fit, minmax(135px, 1fr));
    }
</style>
