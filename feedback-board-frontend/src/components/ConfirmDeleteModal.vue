<script setup>
const props = defineProps({
  deleteName: String,
  isLoading: Boolean,
})

const emit = defineEmits(['cancel', 'delete'])

function handleCancel() {
  emit('cancel')
}

function handleConfirm() {
  emit('delete')
}
</script>

<template>
  <div class="bg-slate-500/50 fixed inset-0 flex items-center">
    <div class="bg-white lg:min-w-lg max-w-3xl rounded m-auto p-8">
      <h1 class="text-lg font-semibold mb-4">Confirm Delete</h1>
      <p class="mb-8">
        Are you sure you want to delete
        <span class="text-red-500 font-semibold">{{ props.deleteName }}</span
        >?
      </p>

      <div class="flex justify-end gap-4">
        <button
          class="px-4 py-1 rounded-md bg-slate-600 text-white cursor-pointer hover:bg-slate-500"
          @click="handleCancel"
        >
          Cancel
        </button>
        <button
          class="px-4 py-1 rounded-md text-white"
          :class="{
            'bg-red-600 cursor-pointer hover:bg-red-500': !props.isLoading,
            'bg-red-600/50 cursor-not-allowed hover:bg-red-500/50': props.isLoading,
          }"
          :disabled="props.isLoading"
          @click="handleConfirm"
        >
          {{ props.isLoading ? 'Deleting' : 'Delete' }}
        </button>
      </div>
    </div>
  </div>
</template>
