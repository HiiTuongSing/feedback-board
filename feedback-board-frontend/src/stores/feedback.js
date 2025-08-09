import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

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
        const response = await axios.get('http://localhost:8080/feedback')
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
        const response = await axios.post('http://localhost:8080/feedback', payload)
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
        const response = await axios.put(`http://localhost:8080/feedback/${id}`, payload)
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
        const response = await axios.delete(`http://localhost:8080/feedback/${id}`)
      } catch (err) {
        this.deleteError = err.response.data.error || 'Delete failed'
        throw err
      } finally {
        this.isDeleting = false
      }
    },
  },
})
