<script>
    import {compositions} from './stores/compositions'
    import {link} from 'svelte-spa-router'
    import {trains} from './stores/trains'
    import {settings} from './stores/settings'
    import {filterTrains} from "./lib/util";
    import TrainBadge from "./TrainBadge.svelte";
    import {CATEGORY_TRANSLATE} from "./stores/domain/trains";

    let compTypes = {}
    let compTypeKeys = null
    $: {
        for (const k in $compositions) {
            if (!$compositions.hasOwnProperty(k)) {
                continue
            }

            const comp = $compositions[k]

            comp.journeySections.forEach(js => {
                js.locomotives.forEach(loco => {
                    if (compTypes[loco.locomotiveType] === undefined) {
                        compTypes[loco.locomotiveType] = new Set()
                    }
                    compTypes[loco.locomotiveType].add(comp.key)
                })

                js.wagons.forEach(loco => {
                    if (compTypes[loco.wagonType] === undefined) {
                        compTypes[loco.wagonType] = new Set()
                    }
                    compTypes[loco.wagonType].add(comp.key)
                })
            })
        }

        compTypeKeys = Object.keys(compTypes)
        compTypeKeys.sort()
    }
</script>
<div>
    <form class="pure-form pure-form-stacked">
        <fieldset>
            <legend>Suodattimet</legend>
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
                <legend>Suodata junalajeja</legend>
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
{#if compTypeKeys.length > 0}
    <div>
        {#each compTypeKeys as compType (compType)}
            <fieldset>
                <legend>{compType}</legend>
                <div class="front-train-container">
                    {#each $trains.getTrainsByKeys(Array.from(compTypes[compType]),filterTrains($settings)) as train}
                        <a href={`/train/${train.key}`} use:link>
                            <TrainBadge train={train}/>
                        </a>
                    {/each}
                </div>
            </fieldset>
        {/each}
    </div>
{/if}

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
