<template>  
  <!-- Main modal -->
  <div class="flex justify-center items-center fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full" >
      <div class="relative w-full max-w-2xl max-h-full">
          <!-- Modal content -->
          <div class="relative bg-white rounded-lg shadow-lg px-4" ref="target">
              <!-- Modal header -->
              <div class="flex items-start justify-between py-4 border-b rounded-t">
                  <h3 class="text-xl font-semibold text-gray-900">
                      {{ title ? title : 'Lorem Ipsum' }}
                  </h3>
                  <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 ml-auto inline-flex items-center " @click="handleClose">
                    <font-awesome-icon icon="fa fa-solid fa-close" />                      
                  </button>
              </div>
              <!-- Modal body -->
              <div class="p-6 space-y-6 text-gray-400">
                    <slot name="content">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, necessitatibus. Debitis tenetur est ducimus, mollitia non quibusdam magni et, reprehenderit ipsa velit deserunt doloribus repellendus esse praesentium reiciendis neque repellat.
                    </slot>
              </div>
              <!-- Modal footer -->
              <div class="flex items-center py-4 space-x-2 border-t border-gray-200 rounded-b ">
                    <slot name="buttons">
                        <button class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center " type="button">
                            Lorem
                        </button>
                    </slot>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { onClickOutside } from '@vueuse/core'

    interface Props {
        title: string,        
    }

    const props = defineProps<Props>()
    
    const emits = defineEmits(['close'])    

    const target = ref(null)

    const handleClose = () => {
        emits('close')        
    }

    onClickOutside(target, (event) => handleClose())

    
</script>