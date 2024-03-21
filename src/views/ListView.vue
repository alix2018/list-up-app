<script setup lang="ts">
import { computed, watch, type Ref, ref } from 'vue';
import MainHeader from '@/components/MainHeader.vue';
import { useLearningStore, useUserStore } from '@/stores';
import { useRouter } from 'vue-router';
import { LOCAL_STORAGE_CURRENT_USER_LIST } from '@/constants';
import type { List, Word } from '@/types';

const userStore = useUserStore();
const learningStore = useLearningStore();
const router = useRouter();
const fromSourceToTranslation: Ref<Boolean> = ref(true);

const subtitle: Ref<string> = computed(() => {
  return `(${userStore?.currentUserList?.words.length} words)`;
});

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

// function onFlashcardsClick() {
//   router.push({ name: 'flashcards-mode' });
// }

function selectRandomElements(array: Word[], x: number) {
  const shuffledArray = [...array];

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray.slice(0, x);
}

function onLearnClick() {
  if (userStore.currentUserList?.words) {
    const res = selectRandomElements(userStore.currentUserList.words, 10);
    console.log('res', res);
    learningStore.setCurrentLearningList(res);
    router.push({ name: 'learning-mode' });
  }
}
</script>

<template>
  <MainHeader :title="userStore?.currentUserList?.name" :subtitle="subtitle" backRoute="lists" />

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
    <!-- <button @click="onFlashcardsClick">Flashcards</button> -->
    <button @click="onLearnClick">Learn</button>
  </section>
</template>

<style scoped>
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
