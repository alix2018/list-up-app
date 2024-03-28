<script setup lang="ts">
import { computed, watch, type Ref, ref } from 'vue';
import MainHeader from '@/components/MainHeader.vue';
import { useUserStore } from '@/stores';
import { useRouter } from 'vue-router';
import { LOCAL_STORAGE_CURRENT_USER_LIST } from '@/constants';
import type { List } from '@/types';

const userStore = useUserStore();
const router = useRouter();
const fromSourceToTranslation: Ref<Boolean> = ref(true);

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

function onLearnClick() {
  if (userStore.currentUserList?.words) {
    router.push({ name: 'learning' });
  }
}
</script>

<template>
  <MainHeader :title="userStore?.currentUserList?.name" :subtitle="subtitle" backRoute="lists" />

  <section>
    <!-- <v-btn @click="onWordsSwitch">Switch</v-btn> -->

    <v-table class="table" fixed-header density="comfortable">
      <thead>
        <tr>
          <th class="th">Source</th>
          <th class="th">Translation</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="word in userStore?.currentUserList?.words" :key="word.source">
          <td>{{ word.source }}</td>
          <td>{{ word.translation }}</td>
        </tr>
      </tbody>
    </v-table>
  </section>
  <v-btn class="btn-learn" @click="onLearnClick">Learn</v-btn>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  overflow-y: auto;
}

.table {
  width: 100%;
}

.th {
  font-weight: bold !important;
}

.btn-learn {
  margin-top: 20px;
  width: 100%;
  flex: none;
}

table {
  margin-top: 10px;
}

td {
  padding: 10px 20px;
}
</style>
