<script setup lang="ts">
import { computed, watch, type Ref } from 'vue';
import MainHeader from '@/components/MainHeader.vue';
import TableData from '@/components/TableData.vue';
import { useUserStore } from '@/stores';
import { useRouter } from 'vue-router';
import { LOCAL_STORAGE_CURRENT_USER_LIST } from '@/constants';
import type { List } from '@/types';

const userStore = useUserStore();
const router = useRouter();
// const fromSourceToTranslation: Ref<Boolean> = ref(true);

const subtitle: Ref<string> = computed(() => {
  return `(${userStore?.currentUserList?.words.length} words)`;
});

const currentUserList: Ref<List> = computed(() => {
  return userStore.currentUserList
    ? userStore.currentUserList
    : JSON.parse(localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_LIST) ?? '');
});

watch(
  () => currentUserList,
  (newValue) => userStore.setUserList(newValue.value),
  { deep: true, immediate: true }
);

// function onWordsSwitch() {
//   fromSourceToTranslation.value = !fromSourceToTranslation.value;
// }

function onFlashcardsClick() {
  if (userStore.currentUserList?.words) {
    router.push({ name: 'flashcards' });
  }
}

function onTypingClick() {
  if (userStore.currentUserList?.words) {
    router.push({ name: 'typing' });
  }
}
</script>

<template>
  <MainHeader :title="userStore?.currentUserList?.name" :subtitle="subtitle" backRoute="lists" />

  <!-- <v-btn @click="onWordsSwitch">Switch</v-btn> -->
  <TableData :data="userStore?.currentUserList?.words" />

  <v-btn class="btn-learn">
    Learn
    <v-menu activator="parent">
      <v-list>
        <v-list-item @click="onFlashcardsClick">
          <v-list-item-title>Flashcards</v-list-item-title>
        </v-list-item>
        <v-list-item @click="onTypingClick">
          <v-list-item-title>Typing</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-btn>
</template>

<style scoped>
.btn-learn {
  margin-top: 20px;
  width: 100%;
  flex: none;
}
</style>
