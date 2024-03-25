<template>
    <div class="flex justify-between">
      <div class="cursor-pointer" v-for="(route,index) in routeNames" :key="index" @click="handleNavigate(route.path)">
        {{ route.name }}
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import router from '@/router';
  
  const routeNames = [
    {
      name: 'home',
      path: '/'
    },
    {
      name: 'about',
      path: '/about'
    },
    {
      name: 'child',
      path: '/child'
    },
    {
      name: 'protected',
      path: '/protected'
    }
  ]

  const handleNavigate = (path: string) => {
    router.push(path)
  }

</script>
  
  <style scoped>
  /* Estilos si es necesario */
  </style>
  