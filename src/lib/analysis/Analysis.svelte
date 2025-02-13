<script lang="ts">
    //export let id: number;
    export function flushData(): void {}

    const { id }: { id: number } = $props();
    $effect(() => {
        console.log('Analysis', id);
    });
</script>

<h1>{id}Analyzing activity....please wait...</h1>
<progress class="progress w-56"></progress>

<style>
    h1 {
        color: blue;
    }
</style>