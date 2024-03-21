<script setup lang="ts">
import { onMounted, computed, ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore, useLearningStore } from '@/stores';
import { LOCAL_STORAGE_CURRENT_LEARNING_LIST, LOCAL_STORAGE_CURRENT_USER_LIST } from '@/constants';
import type { Word, List } from '@/types';
import MainHeader from '@/components/MainHeader.vue';

const userStore = useUserStore();
const learningStore = useLearningStore();
const router = useRouter();
const index: Ref<number> = ref(0);
const answer: Ref<string> = ref('');
const isCorrection: Ref<boolean> = ref(false);

const currentWordsList: Ref<Word[]> = computed(() => {
  const storageValue = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_LIST) ?? '');
  return userStore.currentUserList ? userStore.currentUserList.words : storageValue.words;
});

const subtitle: Ref<string> = computed(() => {
  return `${index.value + 1}/${currentWordsList.value?.length}`;
});

const currentLearningList: Ref<Word[]> = computed(() => {
  return learningStore.currentLearningList.length > 0
    ? learningStore.currentLearningList
    : JSON.parse(localStorage.getItem(LOCAL_STORAGE_CURRENT_LEARNING_LIST) ?? '');
});

function goToNextStep() {
  if (index.value < currentWordsList.value?.length - 1) {
    isCorrection.value = false;
    answer.value = '';
    index.value++;
  } else {
    // TODO: Add end page
    router.push({ name: 'list' });
  }
}

function checkTranslation() {
  const userAnswer = answer.value.toLowerCase();
  const correctAnswer = currentLearningList.value[index.value].translation.toLowerCase();

  if (userAnswer === correctAnswer) {
    goToNextStep();
  } else {
    isCorrection.value = !isCorrection.value;
  }
}
</script>

<template>
  <MainHeader title="Learn" :subtitle="subtitle" backRoute="list" />

  <section>
    {{ currentLearningList[index].source }}
    <form v-if="!isCorrection" @submit.prevent="checkTranslation">
      <input v-model="answer" />
      <button type="submit">Submit</button>
      <br />
      <button class="btn-pass" @click="isCorrection = !isCorrection">Pass 🙅‍♀️</button>
    </form>
    <template v-else>
      <p>Correct answer: {{ currentLearningList[index].translation }}</p>
      <button class="btn-next" @click="goToNextStep">Next</button>
    </template>
  </section>
</template>

<style scoped>
section {
  display: flex;
  justify-content: center;
  padding: 0 25%;
}

section {
  flex-direction: column;
  padding: 20px 25%;
}

button input {
  margin-top: 30px;
}

form {
  margin-top: 10px;
}

.btn-pass {
  width: fit-content;
  text-decoration: underline;
  margin-top: 10px;

  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
}

.btn-next {
  margin-top: 50px;
}
</style>
