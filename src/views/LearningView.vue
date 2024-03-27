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

const currentProgress: Ref<number> = computed(
  () => (learningStore.learnedList.length / learningStore.currentList.length) * 100
);

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
  isCorrection.value = true;
  const currentWord = learningStore.subsetList?.[subsetIndex.value];
  learningStore.incorrectList.push(currentWord);
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
  <MainHeader title="Learn" :subtitle="subtitle" backRoute="list" :progress="currentProgress" />

  <section>
    <p class="current-word">{{ learningStore.subsetList?.[subsetIndex]?.source }}</p>
    <form v-if="!isCorrection" @submit.prevent="verifyTranslation">
      <v-text-field
        class="input"
        label="Answer"
        variant="underlined"
        v-model="answer"
        append-inner-icon="mdi-send"
        @click:append-inner="verifyTranslation"
      />
      <v-btn variant="text" elevation="0" class="btn-pass" @click="onPassClick">Pass 🙅‍♀️</v-btn>
    </form>
    <template v-else>
      <template v-if="!isPassed">
        <div class="user-answer">
          <p class="user-answer-label">Your answer:</p>
          <v-btn
            variant="text"
            elevation="0"
            class="btn-correct"
            append-icon="mdi-check"
            @click="markAsCorrect"
            >I was right</v-btn
          >
        </div>

        <v-text-field
          class="incorrect-answer"
          variant="outlined"
          v-model="answer"
          prepend-inner-icon="mdi-close"
          readonly
        />
      </template>

      <p class="correct-answer-label">Correct answer:</p>
      <v-text-field
        class="correct-answer"
        variant="outlined"
        :value="learningStore.subsetList?.[subsetIndex]?.translation"
        prepend-inner-icon="mdi-check"
        readonly
      />

      <v-btn class="btn-next" @click="goToNext">Next</v-btn>
    </template>
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0;
}

.current-word {
  margin-bottom: 20px;
  font-weight: bold;
}

.btn-pass {
  display: block;
  padding: 0;
  margin-top: 5px;
}

.user-answer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

p {
  margin: 0;
}

.user-answer-label {
  color: var(--color-danger);
}

.incorrect-answer {
  margin-top: 5px;
  color: var(--color-danger);
}

.btn-correct {
  padding: 0;
}

.correct-answer-label {
  color: var(--color-success);
}

.correct-answer {
  margin-top: 10px;
  color: var(--color-success);
}

.btn-next {
  margin-top: 10px;
}
</style>
