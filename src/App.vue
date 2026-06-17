<script setup lang="ts">
  import AppGuest from './pages/AppGuest.vue';
  import AppLogin from './pages/user/AppLogin.vue';
  import AppRegister from './pages/user/AppRegister.vue';
  import ContactDetails from './pages/authenticated/contacts/ContactDetails.vue';
  import ContactsList from './pages/authenticated/contacts/ContactsList.vue';
  import Dashboard from './pages/authenticated/Dashboard.vue';
  import PendingUser from './pages/user/PendingUser.vue';
  import ProgressLine from './components/ProgressLine.vue';
  import { computed, KeepAlive, onMounted } from 'vue';
  import { useAuthStore } from './stores/auth';
  import { useContactStore } from './stores/contacts.ts';
  import { usePageStore } from './stores/pages';
  import { useTerritoryStore } from './stores/territories.ts';
  import { useContactCallStore } from './stores/calls.ts';
  import { usePublishersStore } from './stores/pubs.ts';
import ContactsMap from './pages/maps/ContactsMap.vue';

  const pages = usePageStore()
  const auth = useAuthStore()
  const contacts = useContactStore()
  const calls = useContactCallStore()
  const terr = useTerritoryStore()
  const pubs = usePublishersStore()

  const isLoading = computed(() => {
    return contacts.isLoading || terr.isLoading || calls.isLoading
  })

  onMounted(async () => {
    if (auth.token) {
      pages.active = 'dashboard'
      // contacts.fetchFromServer()
      // calls.fetchFromServer()
      terr.fetchFromServer()
      // pubs.fetchFromServer()

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
  <ContactDetails v-if="pages.active === 'contact-details'" />
  <ContactsMap v-if="pages.active === 'map'" />

  <KeepAlive>
    <ContactsList v-if="pages.active === 'contacts-list'" />
  </KeepAlive>
</template>