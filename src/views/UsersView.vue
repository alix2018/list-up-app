<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import { useUserStore } from '@/stores';
import { useRouter } from 'vue-router';
import type { User } from '@/types';
import MainHeader from '@/components/MainHeader.vue';

const jsonData: Ref<User[] | null> = ref(null);

const userStore = useUserStore();
const router = useRouter();

function onUserClick(user: User) {
  userStore.setUserData(user);
  router.push({ name: 'lists' });
}

onMounted(() => {
  const version = new Date().getTime();
  fetch(`./data.json?version=${version}`)
    .then((response) => response.json())
    .then((json) => {
      jsonData.value = json;
    });
});
</script>

<template>
  <MainHeader title="List up!" />

  <section>
    <v-btn v-for="user in jsonData" :key="user?.name" class="button" @click="onUserClick(user)">
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
