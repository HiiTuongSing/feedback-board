<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  isLoading: Boolean,
})

const emit = defineEmits(['submit', 'cancel'])

const title = ref('')
const message = ref('')

const isDisabled = computed(() => {
  return props.isLoading || title.value.length === 0 || message.value.length === 0
})

function handleSubmit() {
  emit('submit', { title: title.value, message: message.value })
}

function handleCancel() {
  emit('cancel')
}
</script>

<template>
  <div class="bg-slate-500/50 fixed inset-0 flex items-center">
    <div class="bg-white lg:min-w-lg max-w-3xl rounded m-auto p-8">
      <h1 class="text-lg font-semibold mb-4">Create Feedback</h1>
      <div>
        <div class="flex flex-col mb-4">
          <label>Title</label>
          <input type="text" v-model="title" class="bg-slate-100 rounded p-2" />
        </div>
        <div class="flex flex-col mb-8">
          <label>Message</label>
          <input type="text" v-model="message" class="bg-slate-100 rounded p-2" />
        </div>
        <div class="flex gap-4 justify-end">
          <button
            @click="handleCancel"
            :disabled="props.isLoading"
            class="px-4 py-1 rounded-md bg-slate-600 text-white cursor-pointer hover:bg-slate-500"
          >
            Cancel
          </button>
          <button
            @click="handleSubmit"
            :disabled="isDisabled"
            class="px-4 py-1 rounded-md bg-green-600 text-white cursor-pointer hover:bg-green-500"
          >
            {{ props.isLoading ? 'Submitting...' : 'Submit' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
