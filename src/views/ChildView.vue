<template>
    <div>
        <span class="cursor-pointer" @click="navigate('/child1')">
            child1
        </span>
        <span class="cursor-pointer" @click="navigate('/child2')">
            child2
        </span>
        <span class="cursor-pointer" @click="navigate('/child3')">
            child3
        </span>
    </div>
</template>

<script setup lang="ts">
    import router from '@/router'

    const navigate = (route: string) => {
        router.push(route)
    }
</script>

<style scoped>

</style>