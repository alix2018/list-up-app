import { reactive, toRefs, onUnmounted, onMounted, computed, ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLearningStore } from '@/stores';
import { concatAndShuffleArrays, shuffleArray } from '@/utils';

export function useLearningLogic() {
  const learningStore = useLearningStore();
  const router = useRouter();

  const wordsPerRound: Ref<number> = ref(7);

  const state = reactive({
    subsetIndex: 0,
    isCorrection: false
  });

  const subtitle: Ref<string> = computed(() => {
    return `${learningStore.learnedList.length}/${learningStore.currentList.length}`;
  });

  const currentProgress: Ref<number> = computed(
    () => (learningStore.learnedList.length / learningStore.currentList.length) * 100
  );

  function goToNext() {
    if (state.subsetIndex < learningStore.subsetList?.length - 1) {
      state.subsetIndex++;
    } else if (
      state.subsetIndex === learningStore.subsetList?.length - 1 &&
      (learningStore.subsetLeftoverList.length > 0 || learningStore.incorrectList.length > 0)
    ) {
      state.subsetIndex = 0;
      createNextSubsetLists();
    } else {
      // TODO: Add end page
      router.push({ name: 'list' });
    }
  }

  function resetForm() {
    state.isCorrection = false;
  }

  function resetLists() {
    state.subsetIndex = 0;
    learningStore.subsetList = [];
    learningStore.incorrectList = [];
    learningStore.learnedList = [];
    learningStore.subsetLeftoverList = [];
  }

  function initSubsetLists() {
    const shuffledList = shuffleArray(learningStore.currentList);
    const subsetToLearn = shuffledList.slice(0, wordsPerRound.value);
    const subsetLeftToLearn = shuffledList.slice(wordsPerRound.value, shuffledList.length);
    learningStore.subsetList = subsetToLearn;
    learningStore.subsetLeftoverList = subsetLeftToLearn;
  }

  function createNextSubsetLists() {
    const shuffledList = shuffleArray(learningStore.subsetLeftoverList);
    const missingWordsCount = wordsPerRound.value - learningStore.incorrectList.length;
    const subsetToLearn = concatAndShuffleArrays(
      learningStore.incorrectList,
      shuffledList.slice(0, missingWordsCount)
    );
    const subsetLeftoverList = shuffledList.slice(missingWordsCount, shuffledList.length);
    learningStore.subsetList = subsetToLearn;
    learningStore.subsetLeftoverList = subsetLeftoverList;
    learningStore.incorrectList = [];
  }

  onMounted(() => {
    initSubsetLists();
  });

  onUnmounted(() => {
    resetForm();
    resetLists();
  });

  const composable = reactive({
    ...toRefs(state),
    subtitle,
    currentProgress,
    goToNext,
    resetForm
  });

  return composable;
}
