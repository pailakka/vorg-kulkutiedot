<script>
    export let train;
</script>

<div
        class="train-badge"
        class:adhoc={train.timetableType === 'ADHOC'}
        class:running={train.running}
        class:cancelled={!train.running && train.cancelled}
        class:upcoming={train.isUpcoming}
        class:past={train.isPast}
        class:late={train.running && train.isLate}
        class:early={train.running && train.isEarly}
        class:partcancelled={train.running && train.isPartcancelled}
        class:trainready={train.isUpcoming && train.hasTrainReady}
>
    {train.commuterLineID || train.trainType} {train.trainNumber}
</div>


<style>
    .train-badge {
        text-align: center;
        border: 1px solid black;
        padding: 3px;
        color: black
    }

    .adhoc {
        border: 2px solid blue;
    }

    .trainready {
        color: green;
    }

    .upcoming {
        background-color: #99D1FF;
    }

    .past {
        background-color: #E5E4E2;
    }

    .running {
        background-color: #D3FFB8;
    }

    .cancelled {
        background-color: #FF7070;
    }

    .partcancelled {
        background-color: #FFA58A;
    }

    .late {
        font-weight: bold;
        color: red;
    }

    .early {
        font-weight: bold;
        color: green;
    }
</style>