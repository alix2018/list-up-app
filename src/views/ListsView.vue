<script setup lang="ts">
import { useUserStore } from '@/stores';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

function onListClick(list) {
  userStore.setUserList(list);
  router.push({ name: 'list' });
}
</script>

<template>
  <header>
    <h1>My lists</h1>
  </header>

  <section>
    <button v-for="list in userStore?.userData?.lists" :key="list.name" @click="onListClick(list)">
      {{ list.name }} <br />
      ({{ list.words.length }} words)
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
