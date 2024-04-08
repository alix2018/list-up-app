import { type Ref, ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import type { Word } from '@/types';
import { LOCAL_STORAGE_CURRENT_LEARNING_LIST } from '@/constants';
import { useUserStore } from '@/stores';

export const useLearningStore = defineStore('learningStore', () => {
  const currentList: Ref<Word[]> = ref([]);
  const subsetList: Ref<Word[]> = ref([]);
  const incorrectList: Ref<Word[]> = ref([]);
  const learnedList: Ref<Word[]> = ref([]);
  const subsetLeftoverList: Ref<Word[]> = ref([]);

  const userStore = useUserStore();

  // TODO: Improve this flow when connecting to BE
  const listToLearn: Ref<Word[]> = computed(() => {
    let currentList: Word[] = [];

    if (userStore.currentUserList?.words?.length && userStore.currentUserList.words.length > 0) {
      currentList = userStore.currentUserList.words;
    } else {
      currentList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CURRENT_LEARNING_LIST) ?? '');
    }

    return currentList;
  });

  watch(
    () => listToLearn,
    (newValue) => setCurrentList(newValue.value),
    { deep: true, immediate: true }
  );

  function setCurrentList(list: Word[]) {
    currentList.value = list;
    localStorage.setItem(LOCAL_STORAGE_CURRENT_LEARNING_LIST, JSON.stringify(currentList?.value));
  }

  return {
    currentList,
    subsetList,
    incorrectList,
    learnedList,
    subsetLeftoverList,
    setCurrentList
  };
});
