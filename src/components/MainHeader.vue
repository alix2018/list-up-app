<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
type Props = {
  title?: string;
  subtitle?: string;
  backRoute?: string | undefined;
  progress: number | null;
};

const props = withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
  backRoute: undefined,
  progress: null
});

function onBackButtonClick() {
  router.push({ name: props.backRoute });
}
</script>

<template>
  <header>
    <v-btn
      v-if="backRoute"
      rounded="xl"
      icon="mdi-arrow-left-thick"
      size="x-small"
      class="btn-back"
      @click="onBackButtonClick"
    ></v-btn>
    <section>
      <h1>{{ title }}</h1>
      <p>{{ subtitle }}</p>
    </section>
    <v-progress-linear
      v-if="progress != null && progress >= 0"
      class="progress"
      :model-value="progress"
    ></v-progress-linear>
  </header>
</template>

<style scoped>
header {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: none;
  align-items: center;
  padding: 16px;
  width: calc(100% + 2 * var(--app-side-padding));
  margin-left: calc(-1 * var(--app-side-padding));
  margin-right: calc(-1 * var(--app-side-padding));
  box-shadow:
    0 4px 8px 0 rgba(87, 99, 183, 0.05),
    0 6px 20px 0 rgba(87, 99, 183, 0.15);
  margin-bottom: 34px;
}

.btn-back {
  position: absolute;
  left: var(--app-side-padding);
}

section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 48px;
}

p {
  margin-top: 0;
}

.progress {
  position: absolute;
  top: auto !important;
  bottom: 0;
  color: var(--color-dark-purple);
}
</style>
