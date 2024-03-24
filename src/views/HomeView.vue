<template>
  <!--<div class="w-96">
    <SearchInput v-model="test"/>
    {{ test }}
  </div>
  
      <button class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button" @class="handleShowModal" @click="handleShowModal">
        Confirmar
      </button>
  <Modal :show="showModal" title="Custom Title" v-if="showModal" @close="handleShowModal">
    <template #content>
      Hello Fucking World!!!
    </template>
    <template #buttons>
      <button class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
        Confirmar
      </button>
    </template>
  </Modal>-->
  <!--<div class="">
    <Gallery :images="array" />
  </div>
-->
  <div>
    <h2>Location:</h2>
    <p>Lat: {{ lat }}</p>
    <p>Lon: {{ lon }}</p>
    <p v-if="error"> {{ error }} </p>
  </div>


  

  
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import SearchInput from '@/components/inputs/SearchInput.vue'
  import Modal from '@/components/modal/Modal.vue'
  import Gallery from '@/components/gallery/Gallery.vue'

  const test = ref('')

  const showModal = ref(false)

  const handleShowModal = () => {
    showModal.value = !showModal.value
  }

  const array = [
        'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg',
        'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg',
        'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg',
        'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg',
        'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg',

    ]

    const lat = ref<number>()
    const lon = ref<number>()
    const error = ref<string>()

    onMounted(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            lat.value = position.coords.latitude
            lon.value = position.coords.longitude
          },
          err => {
            error.value = err.message
          }
        )
      } else {
        error.value = "Geolocation is not supported by this browser."
      }
    })
</script>

<style scoped>

</style>