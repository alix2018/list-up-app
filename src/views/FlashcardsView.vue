<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import { useUserStore } from '@/stores';
import { useRouter } from 'vue-router';
import type { User } from '@/types';
</script>

<template>
  <header>
    <h1>Flashcards</h1>
    <p>x/y</p>
  </header>

  <section>CARD</section>
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

button {
  margin-top: 25px;
}

button:first-child {
  margin-top: 0;
}
</style>
