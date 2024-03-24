<template>    
    <form>           
        <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <font-awesome-icon icon="fa fa-solid fa-search" />
            </div>
            <input type="text" class="block w-full p-4 px-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 outline-none focus:border-blue-500 " placeholder="Search" :value="value" @input="updateValue">
            
        </div>
    </form>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue'

    interface Props {
        modelValue: string
    }

    const props = defineProps<Props>()

    const emit = defineEmits(['update:modelValue'])

    const value = computed({
        get() {
            return props.modelValue
        },
        set(newValue) {
            emit('update:modelValue', newValue)
        }
    })

    const updateValue = (event: any) => {
        value.value = event.target.value;
    }
</script>

<style scoped>

</style>