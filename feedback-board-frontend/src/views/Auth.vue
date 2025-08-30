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
      role: isAdmin ? 'admin' : 'user'
    }

    await authStore.register(payload)
    username.value = '';
    password.value = '';
    verifyPassword.value = '';
    isAdmin.value = false;
  }catch(err){
    toast.error(err, {
      timeout: 2000,
    })
  }
}
</script>

<template>
  <div class="h-screen w-screen flex flex-col items-center justify-center">
    <div v-if="!isRegisterPage">
      <h1 class="text-3xl font-bold">Feedback Board</h1>
      <br />
      <p @click="isRegisterPage = true" class="text-sm text-blue-500 underline">Register</p>
      <br />
      <p class="text-2xl font-bold">Login</p>
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-2">
        <label for="username">Username</label>
        <input id="username" type="text" v-model="username" class="border px-2" />

        <label for="password">Password</label>
        <input id="password" type="password" v-model="password" class="border px-2" />
        <button type="submit" class="cursor-pointer bg-blue-100 hover:bg-blue-200 transition-500">
          {{ authStore.isLoggingIn ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>

    <div v-else>
      <h1 class="text-3xl font-bold">Feedback Board</h1>
      <br />
      <p @click="isRegisterPage = false" class="text-sm text-blue-500 underline">Login</p>
      <br />
      <p class="text-2xl font-bold">Register</p>
      <form @submit.prevent="handleRegister" class="flex flex-col gap-2">
        <label for="username">Username</label>
        <input id="username" type="text" v-model="username" class="border px-2" />

        <label for="password">Password</label>
        <input id="password" type="password" v-model="password" class="border px-2" />

        <label for="verify-password">Re-Enter Password</label>
        <input id="verify-password" type="password" v-model="verifyPassword" class="border px-2" />

        <label for="role">Role</label>
        <input id="role" type="checkbox" v-model="isAdmin" class="border px-2" />
        <button type="submit" class="bg-blue-100 hover:bg-blue-200 transition-500" :class="{'cursor-pointer': isValid,'cursor-not-allowed opacity-50': !isValid}" :disabled="!isValid">
          {{ authStore.isLoggingIn ? 'Submitting' : 'Register' }}
        </button>
      </form>
    </div>
  </div>
</template>