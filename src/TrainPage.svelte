<script>
    export let params = {}
    const trainKey = `${params.keyDate}/${params.keyNumber}`
    import { trains } from './stores/trains'

    let train
    $: train = $trains.getTrain(trainKey)
</script>
<div>
    <h2>{train.trainNumber} / {train.departureDate}</h2>
    <pre>{JSON.stringify(train, null, 4)}</pre>
</div>
