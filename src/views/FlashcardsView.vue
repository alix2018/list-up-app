<script setup lang="ts">
import { onUnmounted, onMounted, computed, ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLearningStore } from '@/stores';
import { concatAndShuffleArrays, shuffleArray } from '@/utils';
import MainHeader from '@/components/MainHeader.vue';

// TODO: Write composable to factorize the code of Leaning and Flashcards components
// https://vuejs.org/guide/reusability/composables.html#composables

const learningStore = useLearningStore();
const router = useRouter();

const subsetIndex: Ref<number> = ref(0);
const isCorrection: Ref<boolean> = ref(false);
const wordsPerRound: Ref<number> = ref(7);

const subtitle: Ref<string> = computed(() => {
  return `${learningStore.learnedList.length}/${learningStore.currentList.length}`;
});

const currentProgress: Ref<number> = computed(
  () => (learningStore.learnedList.length / learningStore.currentList.length) * 100
);

function onLearnAgainClick(event: Event) {
  event.stopPropagation();
  const currentWord = learningStore.subsetList?.[subsetIndex.value];
  learningStore.incorrectList.push(currentWord);
  isCorrection.value = false;
  goToNext();
}

function onCorrectClick(event: Event) {
  event.stopPropagation();
  const currentWord = learningStore.subsetList?.[subsetIndex.value];
  learningStore.learnedList.push(currentWord);
  isCorrection.value = false;
  goToNext();
}

function onFlipCard() {
  isCorrection.value = !isCorrection.value;
}

function goToNext() {
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

function resetForm() {
  isCorrection.value = false;
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
  <MainHeader
    title="Flashcards"
    :subtitle="subtitle"
    backRoute="list"
    :progress="currentProgress"
  />

  <!-- TODO: Flipping card effect -->
  <v-card v-if="!isCorrection" class="card" @click="onFlipCard">
    <v-card-title class="card-title">
      {{ learningStore.subsetList?.[subsetIndex]?.source }}</v-card-title
    >
  </v-card>

  <v-card v-if="isCorrection" class="card" @click="onFlipCard">
    <v-card-title class="card-title">
      {{ learningStore.subsetList?.[subsetIndex]?.translation }}</v-card-title
    >
    <v-card-actions class="card-actions">
      <v-btn-text prepend-icon="mdi-close" class="btn-wrong" @click="onLearnAgainClick"
        >To learn</v-btn-text
      >
      <v-btn-text prepend-icon="mdi-check" class="btn-right" @click="onCorrectClick"
        >Correct</v-btn-text
      >
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.card {
  position: relative;
  height: 100%;
}

.card-title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  width: 100%;
  white-space: normal !important;
  text-align: center;
}

.card-actions {
  position: absolute;
  display: flex;
  justify-content: space-between;
  bottom: 0;
  width: 100%;
}

.btn-container {
  display: flex;
  justify-content: space-between;
}

.btn-wrong {
  color: var(--color-danger) !important;
}

.btn-right {
  color: var(--color-success) !important;
}
</style>
