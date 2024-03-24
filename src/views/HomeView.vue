<template>
  <div>
    Home

    <button @click="handleClick">
      Login
    </button>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { getApiPermissions } from '@/router';
  import router from '@/router';

  const handleClick = async () => {
    await getApiPermissions()
    alert('Permisos actualizados')
    console.log(router.getRoutes())
  }
</script>

<style scoped>

</style>