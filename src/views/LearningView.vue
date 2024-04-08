<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useLearningLogic } from '@/composables';
import { useLearningStore } from '@/stores';
import MainHeader from '@/components/MainHeader.vue';

const learningStore = useLearningStore();
const learningLogic = useLearningLogic();

const answer: Ref<string> = ref('');
const isPassed: Ref<boolean> = ref(false);

function onPassClick() {
  isPassed.value = true;
  learningLogic.isCorrection = true;
  const currentWord = learningStore.subsetList?.[learningLogic.subsetIndex];
  learningStore.incorrectList.push(currentWord);
}

function markAsCorrect() {
  learningStore.learnedList.push(learningStore.subsetList?.[learningLogic.subsetIndex]);
  learningStore.incorrectList.pop();
  goToNext();
}

function goToNext() {
  resetForm();
  learningLogic.goToNext();
}

function verifyTranslation() {
  const userAnswer = answer.value.toLowerCase();
  const currentWord = learningStore.subsetList?.[learningLogic.subsetIndex];
  const correctAnswer = currentWord.translation.toLowerCase();

  if (userAnswer === correctAnswer) {
    learningStore.learnedList.push(currentWord);
    goToNext();
  } else {
    learningStore.incorrectList.push(currentWord);
    learningLogic.isCorrection = true;
  }
}

function resetForm() {
  learningLogic.resetForm();
  isPassed.value = false;
  answer.value = '';
}
</script>

<template>
  <MainHeader
    title="Learn"
    :subtitle="learningLogic.subtitle"
    backRoute="list"
    :progress="learningLogic.currentProgress"
  />

  <section>
    <p class="current-word">{{ learningStore.subsetList?.[learningLogic.subsetIndex]?.source }}</p>
    <form v-if="!learningLogic.isCorrection" @submit.prevent="verifyTranslation">
      <v-text-field
        class="input"
        label="Answer"
        variant="underlined"
        v-model="answer"
        append-inner-icon="mdi-send"
        @click:append-inner="verifyTranslation"
      />
      <v-btn-text class="btn-pass" @click="onPassClick">Pass 🙅‍♀️</v-btn-text>
    </form>
    <template v-else>
      <template v-if="!isPassed">
        <div class="user-answer">
          <p class="user-answer-label">Your answer:</p>
          <v-btn-text class="btn-correct" append-icon="mdi-check" @click="markAsCorrect"
            >I was right</v-btn-text
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
        :value="learningStore.subsetList?.[learningLogic.subsetIndex]?.translation"
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
