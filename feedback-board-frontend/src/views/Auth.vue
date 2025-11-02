<script setup>
import { computed, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification'

const authStore = useAuthStore()
const username = ref('')
const password = ref('')
const verifyPassword = ref('')
const isAdmin = ref(false)
const toast = useToast()
const isRegisterPage = ref(false);

const isValid = computed(() => password.value === verifyPassword.value && username.value.length > 1 && password.value.length > 1)

async function handleSubmit(){
  if(!username.value || !password.value){
    toast.error('Invalid username or password!', {
      timeout: 2000,
    })
    return
  }

  const payload = { 
    username: username.value.trim(),
    password: password.value.trim() 
  }

  try{
    await authStore.login(payload)
    toast.success('Login success!', {
      timeout: 2000,
    })
    username.value = '';
    password.value = '';
  }catch(err){
    toast.error(err, {
      timeout: 2000,
    })
  }
}

async function handleRegister(){
  try{
    const payload = { 
      username: username.value.trim(),
      password: password.value.trim(),
      role: isAdmin.value ? 'admin' : 'user'
    }

    await authStore.register(payload)
    toast.success('Register success!', {
      timeout: 2000,
    })
    username.value = '';
    password.value = '';
    verifyPassword.value = '';
    isAdmin.value = false;
    isRegisterPage.value = false;
  }catch(err){
    toast.error(err, {
      timeout: 2000,
    })
  }
}
</script>

<template>
  <div class="h-screen w-screen flex flex-col items-center justify-center">
    <h1 class="text-3xl font-bold mb-8">Feedback Board</h1>
    <div v-if="!isRegisterPage" class="border rounded p-8 bg-slate-100 border-slate-200 shadow-2xl">
      <h2 class="text-2xl font-bold text-center mb-4">Login</h2>
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-2">
        <div class="flex flex-col">
          <label for="username">Username</label>
          <input id="username" type="text" v-model="username" class="border px-2 border-slate-600 rounded py-1 bg-white" autocomplete="username"/>
        </div>
        
        <div class="flex flex-col mb-4">
          <label for="password">Password</label>
          <input id="password" type="password" v-model="password" class="border px-2 border-slate-600 rounded py-1 bg-white" autocomplete="password" />
        </div>
        
        <button type="submit" class="cursor-pointer bg-blue-200 hover:bg-blue-100 transition-500 px-2 py-1 rounded text-slate-700">
          {{ authStore.isLoggingIn ? 'Logging in...' : 'Login' }}
        </button>
        <p @click="isRegisterPage = true" class="text-sm text-blue-500 hover:text-blue-800 underline text-center cursor-pointer select-none">Go to register</p>
      </form>
    </div>

    <div v-else class="border rounded p-8 bg-slate-100 border-slate-200 shadow-2xl">
      <h2 class="text-2xl font-bold text-center mb-4">Register</h2>
      <form @submit.prevent="handleRegister" class="flex flex-col gap-2">
        <div class="flex flex-col">
          <label for="username">Username</label>
          <input id="username" type="text" v-model="username" class="border px-2 border-slate-600 rounded py-1 bg-white" autocomplete="new-username" />
        </div>

        <div class="flex flex-col">
          <label for="password">Password</label>
          <input id="password" type="password" v-model="password" class="border px-2 border-slate-600 rounded py-1 bg-white" autocomplete="new-password" />
        </div>

        <div class="flex flex-col">
          <label for="verify-password">Re-Enter Password</label>
          <input id="verify-password" type="password" v-model="verifyPassword" class="border px-2 border-slate-600 rounded py-1 bg-white" autocomplete="new-password" />
        </div>

        <div class="flex items-center gap-2">
          <input id="role" type="checkbox" v-model="isAdmin" class="border border-slate-600 rounded" />
          <label for="role">Admin Role</label>
        </div>

        <button
          type="submit"
          class="px-2 py-1 rounded transition-500 text-slate-600"
          :class="{
            'bg-blue-200 hover:bg-blue-100 cursor-pointer': isValid,
            'bg-blue-200 cursor-not-allowed opacity-50': !isValid
          }"
          :disabled="!isValid"
        >
          {{ authStore.isLoggingIn ? 'Submitting...' : 'Register' }}
        </button>

        <p @click="isRegisterPage = false" class="text-sm text-blue-500 hover:text-blue-800 underline cursor-pointer select-none text-center mt-2">
          Back to Login
        </p>
      </form>
    </div>

  </div>
</template>