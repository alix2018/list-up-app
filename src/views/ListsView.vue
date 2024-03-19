<script setup lang="ts">
import { computed, watch, type Ref } from 'vue';
import { useUserStore } from '@/stores';
import { useRouter } from 'vue-router';
import { LOCAL_STORAGE_CURRENT_USER_DATA } from '@/constants';
import type { List, User } from '@/types';

const userStore = useUserStore();
const router = useRouter();

const currentUserData: Ref<User> = computed(() => {
  return userStore.currentUserData
    ? userStore.currentUserData
    : JSON.parse(localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_DATA) ?? '');
});

watch(
  () => currentUserData,
  (newValue) => userStore.setUserData(newValue.value),
  { deep: true, immediate: true }
);

function onListClick(list: List) {
  userStore.setUserList(list);
  router.push({ name: 'list' });
}
</script>

<template>
  <header>
    <h1>My lists</h1>
  </header>

  <section>
    <button v-for="list in currentUserData?.lists" :key="list?.name" @click="onListClick(list)">
      {{ list?.name }} <br />
      ({{ list?.words.length }} words)
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
