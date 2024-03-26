<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
type Props = {
  title?: string;
  subtitle?: string;
  backRoute?: string | undefined;
};

const props = withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
  backRoute: undefined
});

function onBackButtonClick() {
  router.push({ name: props.backRoute });
}
</script>

<template>
  <header>
    <v-btn
      v-if="backRoute"
      @click="onBackButtonClick"
      rounded="xl"
      icon="mdi-arrow-left-thick"
      size="small"
    ></v-btn>
    <h1>{{ title }}</h1>
    <p>{{ subtitle }}</p>
  </header>
</template>

<style scoped>
button {
  position: absolute;
  left: 7%;
  top: 30x;
}

header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 44px;
}

p {
  margin-top: 0;
}
</style>
