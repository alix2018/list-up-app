<script setup lang="ts">
import { watch, onUnmounted, onMounted, computed, ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore, useLearningStore } from '@/stores';
import { LOCAL_STORAGE_CURRENT_LEARNING_LIST } from '@/constants';
import { concatAndShuffleArrays, shuffleArray } from '@/utils';
import type { Word } from '@/types';
import MainHeader from '@/components/MainHeader.vue';

const userStore = useUserStore();
const learningStore = useLearningStore();
const router = useRouter();

const subsetIndex: Ref<number> = ref(0);
const answer: Ref<string> = ref('');
const isCorrection: Ref<boolean> = ref(false);
const isPassed: Ref<boolean> = ref(false);
const wordsPerRound: Ref<number> = ref(7);

const subtitle: Ref<string> = computed(() => {
  return `${learningStore.learnedList.length}/${learningStore.currentList.length}`;
});

const listToLearn: Ref<Word[]> = computed(() => {
  let currentList: Word[] = [];

  if (userStore.currentUserList?.words?.length && userStore.currentUserList.words.length > 0) {
    currentList = userStore.currentUserList.words;
  } else {
    currentList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CURRENT_LEARNING_LIST) ?? '');
  }

  return currentList;
});

watch(
  () => listToLearn,
  (newValue) => learningStore.setCurrentList(newValue.value),
  { deep: true, immediate: true }
);

function onPassClick() {
  isPassed.value = true;
  isCorrection.value = false;
}

function markAsCorrect() {
  learningStore.learnedList.push(learningStore.subsetList?.[subsetIndex.value]);
  learningStore.incorrectList.pop();
  goToNext();
}

function goToNext() {
  resetForm();
  if (subsetIndex.value < learningStore.subsetList?.length - 1) {
    subsetIndex.value++;
  } else if (
    subsetIndex.value === learningStore.subsetList?.length - 1 &&
    (learningStore.subsetLeftoverList.length > 0 || learningStore.incorrectList.length > 0)
  ) {
    subsetIndex.value = 0;
    createNextSubsetLists();
  } else {
    // TODO: Add end page
    router.push({ name: 'list' });
  }
}

function verifyTranslation() {
  const userAnswer = answer.value.toLowerCase();
  const currentWord = learningStore.subsetList?.[subsetIndex.value];
  const correctAnswer = currentWord.translation.toLowerCase();

  if (userAnswer === correctAnswer) {
    learningStore.learnedList.push(currentWord);
    goToNext();
  } else {
    learningStore.incorrectList.push(currentWord);
    isCorrection.value = true;
  }
}

function resetForm() {
  isCorrection.value = false;
  isPassed.value = false;
  answer.value = '';
}

function resetLists() {
  subsetIndex.value = 0;
  learningStore.subsetList = [];
  learningStore.incorrectList = [];
  learningStore.learnedList = [];
  learningStore.subsetLeftoverList = [];
}

function initSubsetLists() {
  const shuffledList = shuffleArray(learningStore.currentList);
  const subsetToLearn = shuffledList.slice(0, wordsPerRound.value);
  const subsetLeftToLearn = shuffledList.slice(wordsPerRound.value, shuffledList.length);
  learningStore.subsetList = subsetToLearn;
  learningStore.subsetLeftoverList = subsetLeftToLearn;
}

function createNextSubsetLists() {
  const shuffledList = shuffleArray(learningStore.subsetLeftoverList);
  const missingWordsCount = wordsPerRound.value - learningStore.incorrectList.length;
  const subsetToLearn = concatAndShuffleArrays(
    learningStore.incorrectList,
    shuffledList.slice(0, missingWordsCount)
  );
  const subsetLeftoverList = shuffledList.slice(missingWordsCount, shuffledList.length);
  learningStore.subsetList = subsetToLearn;
  learningStore.subsetLeftoverList = subsetLeftoverList;
  learningStore.incorrectList = [];
}

onMounted(() => {
  initSubsetLists();
});

onUnmounted(() => {
  resetForm();
  resetLists();
});
</script>

<template>
  <MainHeader title="Learn" :subtitle="subtitle" backRoute="list" />

  <section>
    {{ learningStore.subsetList?.[subsetIndex]?.source }}
    <form v-if="!isCorrection" @submit.prevent="verifyTranslation">
      <input v-model="answer" />
      <button type="submit">Submit</button>
      <br />
      <button class="btn-pass" @click="onPassClick">Pass 🙅‍♀️</button>
    </form>
    <template v-else>
      <p>Correct answer: {{ learningStore.subsetList?.[subsetIndex]?.translation }}</p>
      <div class="user-answer" v-if="!isPassed">
        <p>You said: {{ answer }}</p>
        <button @click="markAsCorrect">I was right</button>
      </div>
      <button class="btn-next" @click="goToNext">Next</button>
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

.user-answer {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

p {
  margin-top: 20px;
  margin-bottom: 0;
}
</style>
