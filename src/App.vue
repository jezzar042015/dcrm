<script setup lang="ts">
  import AppGuest from './pages/AppGuest.vue';
  import AppLogin from './pages/user/AppLogin.vue';
  import AppRegister from './pages/user/AppRegister.vue';
  import { onMounted } from 'vue';
  import { useAuthStore } from './stores/auth';
  import { usePageStore } from './stores/pages';

  const pages = usePageStore()
  const auth = useAuthStore()

  onMounted(async () => {
    if (auth.token) {
      pages.active = 'dashboard'
    } else {
      pages.active = 'home'
    }
  })
</script>

<template>

  <div class="p-4">
    <AppGuest v-if="pages.active === 'home'" />
    <AppLogin v-if="pages.active === 'login'" />
    <AppRegister v-if="pages.active === 'register'" />
  </div>
</template>