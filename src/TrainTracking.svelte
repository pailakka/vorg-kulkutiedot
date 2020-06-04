<script>
    import { onMount } from 'svelte';
    import { getDigitrafficEndpoint } from "./lib/util.js";
    import { DTMQTT } from './stores/mqttClient'
    import FormattedDate from './FormattedDate.svelte'
    import Station from "./Station.svelte";

    export let trainNumber;
    export let departureDate;

    let trainTracking = []

    onMount(() => {
        const mqttTopic = `train-tracking/${departureDate}/${trainNumber}/#`
        DTMQTT.addSubscription(mqttTopic, (topic, data) => {
            trainTracking = [JSON.parse(data), ...trainTracking]
        })
        getDigitrafficEndpoint(`train-tracking/${departureDate}/${trainNumber}`)
                .then(dtTrainTracking => {
                    trainTracking = [...dtTrainTracking, ...trainTracking]
                    getDigitrafficEndpoint(`train-tracking/${departureDate}/${trainNumber}?version=${Math.max(...dtTrainTracking.map(tt => tt.version))}`)
                            .then(versionDtTrainTracking => {
                                trainTracking = [...versionDtTrainTracking, ...trainTracking]
                            })
                })

        return () => {
            DTMQTT.removeSubscription(mqttTopic)
        };
    });

</script>
<table>
    <thead>
    <tr>
        <th>Aika</th>
        <th>Tyyppi</th>
        <th>Liikennepaikka</th>
        <th>Raideosuus</th>
    </tr>
    </thead>
    <tbody>
    {#each trainTracking as tt (tt.id)}
        <tr>
            <td>
                <FormattedDate date={new Date(tt.timestamp)} />
            </td>
            <td>{tt.type}</td>
            <td>{tt.station}</td>
            <td>{tt.trackSection}</td>
        </tr>
    {/each}
    </tbody>
</table>
