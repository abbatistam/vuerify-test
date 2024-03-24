<template>
<div class="w-full h-fit" >
    <!-- Carousel wrapper -->
    <div class="overflow-hidden h-56 rounded-lg md:h-96">         
        <transition name="slide" v-for="(item, index) in images">
            <div v-if="selected===index" class="relative h-auto flex justify-center items-center">
                <img :src="item" class="absolute flex max-w-full max-h-56 md:max-h-96 top-0 bottom-0 object-contain" alt="">
            </div>
        </transition>        
    </div>
    <div class="flex justify-center items-center pt-4">
        <button class="flex justify-center items-center mr-4 h-full cursor-pointer group focus:outline-none" @click="prev()">            
            <font-awesome-icon icon="fa fa-solid fa-arrow-left" />                            
        </button>        
        <button class="flex justify-center items-center h-full cursor-pointer group focus:outline-none" @click="next()">
            <font-awesome-icon icon="fa fa-solid fa-arrow-right" />                            
        </button>
    </div>
</div>
</template>

<script setup lang="ts">
    import { ref, type Ref } from 'vue'

    interface Props {
        images: string[]
    }

    const props = defineProps<Props>()
    
    const selected : Ref<number> = ref(0)

    const next = () => {
        if (selected.value < props.images.length - 1) {
            selected.value = selected.value + 1;
        } else {
            selected.value = 0;
        }
    };

    const prev = () => {
        if (selected.value > 0) {
            selected.value = selected.value - 1;
        } else {
            selected.value = props.images.length - 1;
        }
    };

    
    setInterval(() => {
        next()
    }, 4000)

</script>

<style scoped>
    
    .slide-enter-active,
    .slide-leave-active {
        transition: transform .45s;
    }

    .slide-enter-from {
        transform: translateX(100%)
    }
    .slide-leave-to {
        transform: translateX(-100%);
    }
</style>