<script>
    import FormattedDate from './FormattedDate.svelte'
    export let ttr = {}
</script>


<tr>
    <td>{ttr.stationShortCode}</td>
    <td>{ttr.commercialTrack}</td>
    <td>{ttr.richType}</td>
    <td><FormattedDate date={ttr.scheduledTime}/></td>
    <td><FormattedDate date={ttr.liveEstimateTime}/></td>
    <td><FormattedDate date={ttr.actualTime}/></td>
    <td>{ttr.differenceInMinutes}</td>
    <td>{JSON.stringify(ttr.causes,null,4)}</td>
</tr>
