<script setup lang="ts">
import { computed, watch, type Ref } from 'vue';
import MainHeader from '@/components/MainHeader.vue';
import { useUserStore } from '@/stores';
import { useRouter } from 'vue-router';
import { LOCAL_STORAGE_CURRENT_USER_DATA } from '@/constants';
import type { List, User } from '@/types';

const userStore = useUserStore();
const router = useRouter();

const currentUserData: Ref<User> = computed(() => {
  return userStore.currentUserData
    ? userStore.currentUserData
    : JSON.parse(localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_DATA) ?? '');
});

watch(
  () => currentUserData,
  (newValue) => userStore.setUserData(newValue.value),
  { deep: true, immediate: true }
);

function onListClick(list: List) {
  userStore.setUserList(list);
  router.push({ name: 'list' });
}
</script>

<template>
  <MainHeader title="My lists" backRoute="accounts" />

  <section>
    <v-card
      v-for="list in currentUserData?.lists"
      :key="list?.name"
      @click="onListClick(list)"
      class="card"
      elevation="2"
      max-width="344"
    >
      <v-card-item class="card-item">
        <v-card-title>
          {{ list?.name }}
        </v-card-title>
        <v-card-subtitle class="card-subtitle"> {{ list?.words.length }} words </v-card-subtitle>
      </v-card-item>
    </v-card>
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
}

.card:first-child {
  margin-top: 0;
}

.card {
  width: 100%;
  margin-top: 20px;
  cursor: pointer;
}
</style>
