<script setup>
import { onMounted, ref } from 'vue'
import { useFeedbackStore } from '../stores/feedback'
import { useAuthStore } from '@/stores/auth'
import CreateFeedbackModal from '@/components/CreateFeedbackModal.vue'
import EditFeedbackModal from '@/components/EditFeedbackModal.vue'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue'
import { useToast } from 'vue-toastification'

const feedbackStore = useFeedbackStore()
const authStore = useAuthStore()
const toast = useToast()

const editObj = ref(null)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const deleteObj = ref(false)

async function handleCreate({ title, message }) {
  const payload = {
    title,
    message,
  }

  try {
    await feedbackStore.createFeedback(payload)
    toast.success('Create success!', {
      timeout: 2000,
    })
    showCreateModal.value = false
    await feedbackStore.fetchAllFeedback()
  } catch (err) {
    toast.error('Error submitting!', {
      timeout: 2000,
    })
    console.error('Error submitting!')
  }
}

function handleCancelCreate() {
  showCreateModal.value = false
}

async function handleDelete() {
  try {
    const id = deleteObj.value.id
    await feedbackStore.deleteFeedback(id)
    toast.success('Delete success!', {
      timeout: 2000,
    })
    showDeleteModal.value = false
    deleteObj.value = null
    await feedbackStore.fetchAllFeedback()
  } catch (err) {
    toast.error('Error deleting!', {
      timeout: 2000,
    })
    console.error('Error deleting!')
  }
}

function handleShowEditModal(obj) {
  showEditModal.value = true
  editObj.value = obj
}

function handleShowDeleteModal(obj) {
  showDeleteModal.value = true
  deleteObj.value = obj
}

async function handleLogout(){
  try{
    await authStore.logout();
    toast.success('Logout success!', {
      timeout: 2000,
    })
  }catch(err){
    console.error(err);
  }
}

async function handleEdit({ title, message }) {
  const id = editObj.value.id
  const payload = {
    title,
    message,
  }

  try {
    await feedbackStore.editFeedback(id, payload)
    toast.success('Edit success!', {
      timeout: 2000,
    })
    editObj.value = null
    showEditModal.value = false
    await feedbackStore.fetchAllFeedback()
  } catch (err) {
    toast.error('Error editing!', {
      timeout: 2000,
    })
    console.error('Error editing!')
  }
}

function handleCancelEdit() {
  showEditModal.value = false
  editObj.value = null
}

function handleCancelDelete() {
  showDeleteModal.value = false
  deleteObj.value = null
}

onMounted(() => {
  feedbackStore.fetchAllFeedback()
})
</script>

<template>
  <div class="max-w-3xl m-auto py-8">
    <h1 class="text-center font-bold text-3xl mb-8 text-blue-800">Feedback Board</h1>

    <div class="h-[80vh]">
      <div class="w-full flex justify-end mb-4">
        <button
          class="px-4 py-1 rounded-md text-white"
          :class="{
            'bg-green-600 hover:bg-green-500 cursor-pointer': !feedbackStore.isLoading,
            'bg-green-600/50 hover:bg-green-500/50 cursor-not-allowed': feedbackStore.isLoading,
          }"
          @click="showCreateModal = true"
          :disabled="feedbackStore.isLoading"
        >
          Create
        </button>
        <button
          class="px-4 py-1 rounded-md text-black"
          @click="handleLogout"
        >
          logout
        </button>
      </div>
      <div
        v-if="feedbackStore.isLoading"
        class="border p-8 rounded border-slate-200 text-blue-500 flex flex-col items-center"
      >
        <div class="w-[50px] h-[50px] bg-blue-100 rounded flex items-center justify-center mb-2">
          <svg
            class="animate-spin h-5 w-5 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
        <h1>Loading...</h1>
        <p class="font-light text-sm">We're fetching the feedbacks.</p>
      </div>

      <div
        v-else-if="feedbackStore.error"
        class="border p-8 rounded border-slate-200 text-red-500 flex flex-col items-center"
      >
        <div class="w-[50px] h-[50px] bg-red-100 rounded flex items-center justify-center mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>
        <h1>Error:</h1>
        <p class="font-light text-sm">{{ feedbackStore.error }}</p>
      </div>

      <div
        v-else-if="feedbackStore.feedbackList.length === 0"
        class="border p-8 rounded border-slate-200 flex flex-col items-center"
      >
        <div
          class="w-[50px] h-[50px] bg-slate-400 text-white rounded flex items-center justify-center mb-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
            />
          </svg>
        </div>
        <h1>No feedback available.</h1>
        <p class="font-light text-sm">Come back later for more feedback</p>
      </div>

      <ul v-else>
        <li
          v-for="feedback in feedbackStore.feedbackList"
          :key="feedback.id"
          class="mb-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm text-slate-400 mb-1">#{{ feedback.id }}</p>
              <h3 class="text-lg font-semibold text-slate-800">{{ feedback.title }}</h3>
              <p class="text-slate-600 mt-1">{{ feedback.message }}</p>
            </div>
            <div class="flex gap-2 ml-4">
              <button
                class="text-sm text-blue-600 hover:underline cursor-pointer"
                @click="handleShowEditModal(feedback)"
              >
                Edit
              </button>
              <button
                class="text-sm text-red-600 hover:underline cursor-pointer"
                @click="handleShowDeleteModal(feedback)"
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <CreateFeedbackModal
      v-if="showCreateModal"
      :is-loading="feedbackStore.isCreating"
      @submit="handleCreate"
      @cancel="handleCancelCreate"
    />

    <EditFeedbackModal
      v-if="showEditModal"
      :is-loading="feedbackStore.isEditing"
      :edit-obj="editObj"
      @submit="handleEdit"
      @cancel="handleCancelEdit"
    />

    <ConfirmDeleteModal
      v-if="showDeleteModal"
      :is-loading="feedbackStore.isDeleting"
      :delete-name="deleteObj.title"
      @delete="handleDelete"
      @cancel="handleCancelDelete"
    />
  </div>
</template>

<style scoped></style>
