<script setup lang="ts">
import { computed, watch } from 'vue';
import { useUserStore } from '@/stores';
import { useRouter } from 'vue-router';

const userStore = useUserStore();

const currentUserList = computed(() => {
  return userStore.currentUserList
    ? userStore.currentUserList
    : JSON.parse(localStorage.getItem('CURRENT_USER_LIST') ?? '');
});

watch(
  () => currentUserList,
  (newValue) => userStore.setUserList(newValue.value),
  { deep: true, immediate: true }
);
</script>

<template>
  <header>
    <h1>{{ userStore.currentUserList.name }}</h1>
    <p>({{ userStore.currentUserList.words.length }} words)</p>
  </header>

  <section>
    <table>
      <tr v-for="word in userStore?.currentUserList?.words">
        <td>{{ word.source }}</td>
        <td>{{ word.translation }}</td>
      </tr>
    </table>
  </section>
</template>

<style scoped>
header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* padding: 0 25%; */
}

h1 {
  margin-bottom: 0;
}

p {
  margin-top: 0;
}

section {
  display: flex;
  justify-content: center;
}

table,
th,
td {
  border: 1px solid black;
}

table {
  margin-top: 20px;
}

td {
  padding: 10px 20px;
}
</style>
