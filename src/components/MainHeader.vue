<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
type Props = {
  title?: string;
  subtitle?: string;
  showBackButton: boolean;
};

withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
  showBackButton: false
});
</script>

<template>
  <header>
    <button v-if="showBackButton" @click="router.go(-1)">Back</button>
    <h1>{{ title }}</h1>
    <p>{{ subtitle }}</p>
  </header>
</template>

<style scoped>
button {
  position: absolute;
  left: 10%;
  top: 30x;
}

header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 25%;
}

h1 {
  margin-bottom: 0;
}

p {
  margin-top: 0;
}
</style>
