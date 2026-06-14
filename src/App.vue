<script setup lang="ts">
  import AppGuest from './pages/AppGuest.vue';
  import AppLogin from './pages/user/AppLogin.vue';
  import AppRegister from './pages/user/AppRegister.vue';
  import ContactsList from './pages/authenticated/ContactsList.vue';
  import Dashboard from './pages/authenticated/Dashboard.vue';
  import PendingUser from './pages/user/PendingUser.vue';
  import { computed, onMounted } from 'vue';
  import { useAuthStore } from './stores/auth';
  import { useContactStore } from './stores/contacts.ts';
  import { usePageStore } from './stores/pages';
  import ProgressLine from './components/ProgressLine.vue';

  const pages = usePageStore()
  const auth = useAuthStore()
  const contacts = useContactStore()

  const isLoading = computed(()=> {
     return contacts.isLoading
  })

  onMounted(async () => {
    if (auth.token) {
      pages.active = 'dashboard'
      await contacts.fetchContacts()
    } else if (auth.userIsPending) {
      pages.active = 'user-pending'
    } else {
      pages.active = 'home'
    }

  })
</script>

<template>
  <ProgressLine :loading=isLoading />
  <AppGuest v-if="pages.active === 'home'" />
  <AppLogin v-if="pages.active === 'login'" />
  <AppRegister v-if="pages.active === 'register'" />
  <PendingUser v-if="pages.active === 'user-pending'" />
  <Dashboard v-if="pages.active === 'dashboard'" />
  <ContactsList v-if="pages.active === 'contacts-list'" />
</template>