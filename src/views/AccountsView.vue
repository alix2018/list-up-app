<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import { useUserStore } from '@/stores';
import { useRouter } from 'vue-router';
import type { User } from '@/types';

const jsonData: Ref<User[] | null> = ref(null);

const userStore = useUserStore();
const router = useRouter();

function onUserClick(user: User) {
  userStore.setUserData(user);
  router.push({ name: 'lists' });
}

onMounted(() => {
  fetch('./data.json')
    .then((response) => response.json())
    .then((json) => {
      jsonData.value = json;
    });
});
</script>

<template>
  <header>
    <h1>List up!</h1>
  </header>

  <section>
    <button v-for="user in jsonData" :key="user?.name" @click="onUserClick(user)">
      {{ user?.name }}
    </button>
  </section>
</template>

<style scoped>
header,
section {
  display: flex;
  justify-content: center;
  padding: 0 25%;
}

section {
  flex-direction: column;
  padding: 20px 25%;
}

button {
  margin-top: 25px;
}

button:first-child {
  margin-top: 0;
}
</style>
