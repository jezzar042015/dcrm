<script setup lang="ts">
  import AppGuest from './pages/AppGuest.vue';
  import AppLogin from './pages/user/AppLogin.vue';
  import AppRegister from './pages/user/AppRegister.vue';
  import Dashboard from './pages/authenticated/Dashboard.vue';
  import PendingUser from './pages/user/PendingUser.vue';
  import { onMounted } from 'vue';
  import { useAuthStore } from './stores/auth';
  import { usePageStore } from './stores/pages';

  const pages = usePageStore()
  const auth = useAuthStore()

  onMounted(async () => {
    if (auth.token) {
      pages.active = 'dashboard'
    } else if (auth.userIsPending) {
      pages.active = 'user-pending'
    } else {
      pages.active = 'home'
    }

  })
</script>

<template>
  <AppGuest v-if="pages.active === 'home'" />
  <AppLogin v-if="pages.active === 'login'" />
  <AppRegister v-if="pages.active === 'register'" />
  <PendingUser v-if="pages.active === 'user-pending'" />
  <Dashboard v-if="pages.active === 'dashboard'" />
</template>