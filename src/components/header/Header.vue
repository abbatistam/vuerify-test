<template>
    <div class="flex justify-between">
        <RouterLink v-for="route in routes" :to="{name: route}">
            {{ route }}
        </RouterLink>
    </div>
</template>

<script setup lang="ts">
    import { RouterLink } from 'vue-router';

    const routes = [
        'home',
        'about',
        'protected',
    ]
</script>

<style scoped>

</style>