<script>
    import { onMount } from 'svelte';
    import { getDigitrafficEndpoint } from "./lib/util.js";
    import { DTMQTT } from './stores/mqttClient'
    import Station from "./Station.svelte";

    export let trainNumber;
    export let departureDate;

    let rawRoutesets = null

    function getChunkedRoutesets (rawRoutesets) {
        const concatRoutes = rawRoutesets.reduce((allRouteSets, routeSet) => ([...allRouteSets, ...routeSet.routesections.map(section => ({
            ...section,
            version: routeSet.version,
            messageTime: routeSet.messageTime,
            messageId: routeSet.messageId,
            routeType: routeSet.routeType
        }))]), [])

        const chunkedRoutes = []
        let routeChunk = []
        concatRoutes.reduce((prevStation, section) => {
            if (!prevStation) {
                routeChunk.push(section)
            } else if (prevStation !== section.stationCode) {
                chunkedRoutes.push(routeChunkObject(routeChunk))
                routeChunk = [section]
            } else {
                routeChunk.push(section)
            }
            return section.stationCode
        }, null)

        chunkedRoutes.push(routeChunkObject(routeChunk))

        return chunkedRoutes
    }

    onMount(() => {
        console.log('onMount', trainNumber, departureDate)
        const mqttTopic = `routesets/${departureDate}/${trainNumber}/#`
        DTMQTT.addSubscription(mqttTopic, (topic, data) => {
            rawRoutesets = [...rawRoutesets, JSON.parse(data)]
        })
        getDigitrafficEndpoint(`routesets/${departureDate}/${trainNumber}`)
                .then(dtRoutesets => {
                    rawRoutesets = [...dtRoutesets]
                })

        return () => {
            DTMQTT.removeSubscription(mqttTopic)
        };
    });

    const routeChunkObject = (routeChunk) => ({
        stationCode: routeChunk[0].stationCode,
        version: routeChunk[0].version,
        key: routeChunk[0].stationCode + '/' + routeChunk[0].version,
        sections: routeChunk
    })

    let routesets = null
    $: routesets = rawRoutesets !== null ? getChunkedRoutesets(rawRoutesets) : []

</script>

{#if routesets === null}
    <span>Ladataan kulkutievarauksia... {departureDate} / {trainNumber}</span>
{:else}
    <table class="zebra">
        <thead>
        <tr>
            <th>Liikennepaikka</th>
            <th>Varaukset</th>
        </tr>
        </thead>
        <tbody>
        {#each routesets as stationChunk}
            <tr>
                <td>{stationChunk.stationCode}</td>
                <td>
                    {#each stationChunk.sections as section,i}
                        <span title={section.routeType + ' / ' + (new Date(section.messageTime)).toLocaleTimeString() + '' + (section.commercialTrackId ? ` / raide ${section.commercialTrackId}` : '')}>{section.sectionId}</span>{#if i < stationChunk.sections.length - 1}
                        &nbsp;-&nbsp;{/if}
                    {/each}
                </td>
            </tr>
        {/each}
        </tbody>
    </table>
{/if}

<style>
    table {
        width: 100%;
    }
</style>