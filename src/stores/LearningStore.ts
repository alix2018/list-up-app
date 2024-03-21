import { type Ref, ref } from 'vue';
import { defineStore } from 'pinia';
import type { List, User, Word } from '@/types';
import { LOCAL_STORAGE_CURRENT_LEARNING_LIST } from '@/constants';

export const useLearningStore = defineStore('learningStore', () => {
  const currentLearningList: Ref<Word[]> = ref([]);
  const learningListLeft: Ref<Word[]> = ref([]);

  function setCurrentLearningList(list: Word[]) {
    currentLearningList.value = list;
    localStorage.setItem(
      LOCAL_STORAGE_CURRENT_LEARNING_LIST,
      JSON.stringify(currentLearningList?.value)
    );
  }

  return { currentLearningList, learningListLeft, setCurrentLearningList };
});
