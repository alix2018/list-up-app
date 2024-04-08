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

function onAddListClick() {
  // TODO when connecting to BE
}
</script>

<template>
  <MainHeader title="My lists" backRoute="users" />

  <!-- TODO: Add lists folders -->
  <section>
    <v-card
      v-for="list in currentUserData?.lists"
      :key="list?.name"
      @click="onListClick(list)"
      class="card"
      elevation="2"
      max-width="344"
      style="max-width: none"
    >
      <v-card-item class="card-item">
        <v-card-title>
          {{ list?.name }}
        </v-card-title>
        <v-card-subtitle class="card-subtitle"> {{ list?.words.length }} words </v-card-subtitle>
      </v-card-item>
    </v-card>
  </section>
  <v-btn size="x-large" icon="mdi-plus" disabled class="btn-add" @click="onAddListClick"></v-btn>
</template>

<style scoped>
section {
  display: block;
  margin: 0 auto 80px;
  padding-bottom: 5px;
  width: 100%;
  overflow-y: auto;
}

.card:first-child {
  margin-top: 0;
}

.card {
  width: 100%;
  margin-top: 20px;
  cursor: pointer;
}

.btn-add {
  position: absolute;
  bottom: var(--app-bottom-padding);
  right: var(--app-side-padding);
  border-radius: 100% !important;
}
</style>
