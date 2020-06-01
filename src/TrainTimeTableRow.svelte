<script>
    import FormattedDate from './FormattedDate.svelte'
    import Station from './Station.svelte'
    import Causes from './Causes.svelte'

    import {EVENT_HUMAN_READABLE} from "./stores/metadata";

    export let ttr = {}
</script>


<tr>
    <td>
        <Station stationUICCode={ttr.stationUICCode}/>
    </td>
    <td>{ttr.commercialTrack}</td>
    <td>{EVENT_HUMAN_READABLE[ttr.richType] ? EVENT_HUMAN_READABLE[ttr.richType] : ttr.richType}</td>
    <td>
        <FormattedDate date={ttr.scheduledTime}/>
    </td>
    <td>
        <FormattedDate date={ttr.liveEstimateTime}/>
    </td>
    <td>
        <FormattedDate date={ttr.actualTime}/>
    </td>
    <td>{ttr.differenceInMinutes}</td>
    <td>{#if ttr.causes.length > 0}<Causes causes={ttr.causes}/>{/if}</td>
</tr>
