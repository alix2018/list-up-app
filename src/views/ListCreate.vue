<script setup lang="ts">
import { computed, type Ref, ref } from 'vue';
import MainHeader from '@/components/MainHeader.vue';
import { useRouter } from 'vue-router';
import type { Word } from '@/types';

const router = useRouter();

// TODO: temporary until the original Word type is fixed
type wordsArrayType = Array<Word & { id: string }>;
const listTitle: Ref<string> = ref('');
const valid: Ref<boolean | null | undefined> = ref(null);
const rules: Ref<{
  titleRequired: boolean | string;
}> = computed(() => {
  return {
    titleRequired: !!listTitle.value || 'Field is required'
  };
});
const inputsArray: Ref<wordsArrayType> = ref([
  { id: self.crypto.randomUUID(), source: '', translation: '' }
]);

const hasAtLeastOneEntry = computed(() => {
  const hasOneItem = inputsArray.value.length === 1;
  const isSourceEmpty = inputsArray.value[0].source === '';
  const isTranslationEmpty = inputsArray.value[0].translation === '';
  if (hasOneItem && (isSourceEmpty || isTranslationEmpty)) {
    return false;
  } else {
    return true;
  }
});

const isLastRowEmpty = computed(() => {
  const inputsArrayLength = inputsArray.value.length;
  const isSourceEmpty = inputsArray.value[inputsArrayLength - 1].source === '';
  const isTranslationEmpty = inputsArray.value[inputsArrayLength - 1].translation === '';
  return isSourceEmpty && isTranslationEmpty;
});

function onClickRemoveRow(index: number) {
  inputsArray.value.splice(index, 1);
}

// TODO: Be able to at x rows in once
function onClickAddRow() {
  inputsArray.value.push({ id: self.crypto.randomUUID(), source: '', translation: '' });
}

function formatArray(inputsArray: wordsArrayType) {
  const resArray = [];
  for (const input of inputsArray) {
    if (input.source !== '' && input.translation !== '') {
      resArray.push(input);
    }
  }

  return resArray;
}

function onClickCreateList() {
  const formattedArray = formatArray(inputsArray.value);
  console.log('formattedArray', formattedArray);
  // TODO: Call POST endpoint to create a list
  router.push({ name: 'lists' });
}
</script>

<template>
  <MainHeader title="Create a list" backRoute="lists" />

  <v-form v-model="valid" class="form">
    <v-text-field
      :rules="[rules.titleRequired]"
      class="list-title"
      label="List title"
      variant="underlined"
      v-model="listTitle"
      clearable
    />

    <v-table class="table" density="compact" fixed-header>
      <thead class="thead">
        <tr>
          <th class="th">Source</th>
          <th class="th">Translation</th>
          <th class="th last-th"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(input, index) in inputsArray" :key="index">
          <td>
            <v-text-field variant="underlined" v-model="input.source" />
          </td>
          <td>
            <v-text-field variant="underlined" v-model="input.translation" />
          </td>
          <td>
            <!-- Add validation for empty inputs -->
            <v-btn-text
              class="btn-remove"
              icon="mdi-delete-outline"
              @click="onClickRemoveRow(index)"
            />
          </td>
        </tr>
        <tr class="btn-add-container">
          <v-btn-text class="btn-add" @click="onClickAddRow" :disabled="isLastRowEmpty">
            + Add
          </v-btn-text>
        </tr>
      </tbody>
    </v-table>

    <v-btn class="btn-create" @click="onClickCreateList" :disabled="!valid || !hasAtLeastOneEntry">
      Create
    </v-btn>
  </v-form>
</template>

<style scoped>
.form {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.list-title {
  flex: none;
  margin-bottom: 20px;
}

.table {
  display: flex;
  flex: 1;
  overflow-y: auto;
}

.th {
  font-weight: bold !important;
}

.last-th {
  width: 20px !important;
}

.btn-add-container {
  position: relative;
  height: 45px;
}

.btn-add {
  position: absolute;
  right: 10px;
  margin-top: 5px;
}

.btn-create {
  margin-top: 20px;
  width: 100%;
  flex: none;
}

td {
  padding: 10px 20px;
}
</style>
