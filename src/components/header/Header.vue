<template>
    <div class="flex justify-between">
        <RouterLink v-for="route in routes" :to="{name: route}">
            {{ route }}
        </RouterLink>
    </div>
</template>

<script setup lang="ts">
    import { RouterLink } from 'vue-router';
    import router from '@/router';

    const routes = router.getRoutes().map((element) => element.name)

   
</script>

<style scoped>

</style>