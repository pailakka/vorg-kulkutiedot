<script>
    export let date = null
</script>

<span>{date ? date.toLocaleTimeString() : ''}</span>