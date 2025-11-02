import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import api from '@/services/apiService'

export const useFeedbackStore = defineStore('feedback', {
  state: () => ({
    isLoading: false,
    error: null,
    feedbackList: [],
    isCreating: false,
    createError: null,
    isEditing: false,
    editError: null,
    isDeleting: false,
    deleteError: null,
  }),

  actions: {
    async fetchAllFeedback() {
      this.isLoading = true
      this.error = null

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)) // simulate delay
        const response = await api.get(`/feedback`, {
          withCredentials: true,
        })
        this.feedbackList = response.data !== null ? response.data : []
      } catch (err) {
        this.error = err
        throw err
      } finally {
        this.isLoading = false
      }
    },
    async createFeedback(payload) {
      this.isCreating = true
      this.createError = null
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)) // simulate delay
        const response = await api.post(`/feedback`, payload)
      } catch (err) {
        this.createError = err.response.data.error || 'Submission failed'
        throw err
      } finally {
        this.isCreating = false
      }
    },
    async editFeedback(id, payload) {
      this.isEditing = true
      this.editError = null
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)) // simulate delay
        const response = await api.put(`/feedback/${id}`, payload)
      } catch (err) {
        this.editError = err.response.data.error || 'Submission failed'
        throw err
      } finally {
        this.isEditing = false
      }
    },
    async deleteFeedback(id) {
      this.isDeleting = true
      this.deleteError = null
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)) // simulate delay
        const response = await api.delete(`/feedback/${id}`)
      } catch (err) {
        this.deleteError = err.response.data.error || 'Delete failed'
        throw err
      } finally {
        this.isDeleting = false
      }
    },
  },
})
