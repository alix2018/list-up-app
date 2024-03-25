import { type Ref, ref } from 'vue';
import { defineStore } from 'pinia';
import type { Word } from '@/types';
import { LOCAL_STORAGE_CURRENT_LEARNING_LIST } from '@/constants';

export const useLearningStore = defineStore('learningStore', () => {
  const currentList: Ref<Word[]> = ref([]);
  const subsetList: Ref<Word[]> = ref([]);
  const incorrectList: Ref<Word[]> = ref([]);
  const learnedList: Ref<Word[]> = ref([]);
  const subsetLeftoverList: Ref<Word[]> = ref([]);

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
