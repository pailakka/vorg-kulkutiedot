<script>
    import { operators } from './stores/metadata'

    export let operatorShortCode


    let operator
    $: operator = $operators[operatorShortCode]
</script>

<span>{operator ? operator.operatorName : operatorShortCode}</span>