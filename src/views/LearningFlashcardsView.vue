<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useLearningLogic } from '@/composables';
import { useLearningStore } from '@/stores';
import MainHeader from '@/components/MainHeader.vue';

const learningStore = useLearningStore();
const learningLogic = useLearningLogic();
const noTransition: Ref<boolean> = ref(false);

function goToNext({ event, isCorrect }: { event: Event; isCorrect: boolean }) {
  event.stopPropagation();
  disableTransition();
  const currentWord = learningStore.subsetList?.[learningLogic.subsetIndex];
  if (isCorrect) {
    learningStore.learnedList.push(currentWord);
  } else {
    learningStore.incorrectList.push(currentWord);
  }
  learningLogic.isCorrection = false;
  learningLogic.goToNext();
  enableTransition();
}

function disableTransition() {
  noTransition.value = true;
}

function enableTransition() {
  setTimeout(() => {
    noTransition.value = false;
  }, 1);
}

function onFlipCard() {
  learningLogic.isCorrection = !learningLogic.isCorrection;
}
</script>

<template>
  <MainHeader
    title="Flashcards"
    :subtitle="learningLogic.subtitle"
    backRoute="list"
    :progress="learningLogic.currentProgress"
  />

  <v-card
    class="card"
    :ripple="false"
    @click="onFlipCard"
    :class="{ 'flip-card': learningLogic.isCorrection, 'no-transition': noTransition }"
  >
    <div class="card-face front">
      <v-card-title class="card-title">
        {{ learningStore.subsetList?.[learningLogic.subsetIndex]?.source }}</v-card-title
      >
    </div>

    <div class="card-face back">
      <v-card-title class="card-title">
        {{ learningStore.subsetList?.[learningLogic.subsetIndex]?.translation }}</v-card-title
      >
      <v-card-actions class="card-actions">
        <v-btn-text
          prepend-icon="mdi-close"
          class="btn-wrong"
          @click="goToNext({ event: $event, isCorrect: false })"
          >To learn</v-btn-text
        >
        <v-btn-text
          prepend-icon="mdi-check"
          class="btn-right"
          @click="goToNext({ event: $event, isCorrect: true })"
          >Correct</v-btn-text
        >
      </v-card-actions>
    </div>
  </v-card>
</template>

<style scoped>
.container {
  height: 100%;
  width: 100%;
}

.card {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.5s;
  transform-style: preserve-3d;
  overflow: unset !important;
}

.card.flip-card {
  transform: rotateY(180deg);
}

.card.no-transition {
  transition: none;
}

.card-face {
  position: absolute;
  height: 100%;
  width: 100%;
  backface-visibility: hidden;
}

.back {
  transform: rotateY(180deg);
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
