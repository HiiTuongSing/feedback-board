import { defineStore } from 'pinia'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import router from '@/router'

const apiUrl = 'http://localhost:3001/api'
const DEVICE_ID_KEY = 'device_id'

axios.defaults.withCredentials = true

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isRegistering: false,
    isLoggingIn: false,
    loginError: null,
    registerError: null,
    deviceId: null,
    isLoggedIn: false,
  }),

  actions: {
    initDeviceId() {
      // check localStorage
      let storedId = localStorage.getItem(DEVICE_ID_KEY)
      if (!storedId) {
        storedId = uuidv4()
        localStorage.setItem(DEVICE_ID_KEY, storedId)
      }
      this.deviceId = storedId
      return storedId
    },

    async login(payload) {
      this.isLoggingIn = true
      this.loginError = null

      try {
        // ensure deviceId exists before login
        const deviceId = this.deviceId || this.initDeviceId()

        await new Promise((resolve) => setTimeout(resolve, 1000)) // simulate delay
        const response = await axios.post(`${apiUrl}/auth/login`, {
          ...payload,
          deviceId, 
        })
        this.isLoggedIn = true
        router.push({ name: 'FeedbackBoard' })
      } catch (err) {
        const message =
          err.response?.data?.error ||
          err.message ||
          'Error logging in.'

        this.loginError = message
        throw message
      } finally {
        this.isLoggingIn = false
      }
    },

    async register(payload){
      this.isRegistering = true;
      this.registerError = null;
      
      try{
        const response = await axios.post(`${apiUrl}/auth/register`, payload)
      }catch (err) {
        const message =
          err.response?.data?.error ||
          err.message ||
          'Error register account.'

        this.registerError = message
        throw message
      } finally {
        this.isRegistering = false
      }
    },

    async authCheck(){
      try{
        const response = await axios.get(`${apiUrl}/auth/user`, {
          withCredentials: true,
        })
        this.isLoggedIn = true
      }catch(err){
        this.isLoggedIn = false
      }
    },

    async logout(){
      try{
        const response = await axios.post(`${apiUrl}/auth/logout`, {
          withCredentials: true,
        })
        this.isLoggedIn = false
        router.push({name: 'Auth'})
      }catch(err){
        this.isLoggedIn = true
      }
    }
  },
})
