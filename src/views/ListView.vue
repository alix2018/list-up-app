<script setup lang="ts">
import { computed, watch, type Ref, ref } from 'vue';
import { useUserStore } from '@/stores';
import { LOCAL_STORAGE_CURRENT_USER_LIST } from '@/constants';
import type { List } from '@/types';

const userStore = useUserStore();
const fromSourceToTranslation: Ref<Boolean> = ref(true);

const currentUserList: Ref<List> = computed(() => {
  return userStore.currentUserList
    ? userStore.currentUserList
    : JSON.parse(localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_LIST) ?? '');
});

watch(
  () => currentUserList,
  (newValue) => userStore.setUserList(newValue.value),
  { deep: true, immediate: true }
);

function onWordsSwitch() {
  fromSourceToTranslation.value = !fromSourceToTranslation.value;
}
</script>

<template>
  <header>
    <h1>{{ userStore?.currentUserList?.name }}</h1>
    <p>({{ userStore?.currentUserList?.words.length }} words)</p>
  </header>

  <section>
    <button @click="onWordsSwitch">Switch</button>
    <table>
      <tr v-for="word in userStore?.currentUserList?.words" :key="word.source">
        <template v-if="fromSourceToTranslation">
          <td>{{ word.source }}</td>
          <td>{{ word.translation }}</td>
        </template>
        <template v-else>
          <td>{{ word.translation }}</td>
          <td>{{ word.source }}</td>
        </template>
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
  flex-direction: column;
  align-items: center;
}

table,
th,
td {
  border: 1px solid black;
}

button {
  margin-top: 20px;
}

table {
  margin-top: 10px;
}

td {
  padding: 10px 20px;
}
</style>
