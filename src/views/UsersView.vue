<script setup lang="ts">
import { useUserStore } from '@/stores';
import { useRouter } from 'vue-router';
import type { User } from '@/types';
import MainHeader from '@/components/MainHeader.vue';
import jsonData from '@/assets/data.json';

const userStore = useUserStore();
const router = useRouter();

function onUserClick(user: User) {
  userStore.setUserData(user);
  router.push({ name: 'lists' });
}
</script>

<template>
  <MainHeader title="List up!" />

  <section>
    <v-btn
      v-for="user in jsonData"
      :key="user?.name"
      class="button"
      @click="onUserClick(user as unknown as User)"
    >
      {{ user?.name }}
    </v-btn>
  </section>
</template>

<style scoped>
section {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.button {
  margin-top: 20px;
}

.button:first-child {
  margin-top: 0;
}
</style>
