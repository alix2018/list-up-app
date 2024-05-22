<script setup lang="ts">
import { computed, type Ref, ref } from 'vue';
import MainHeader from '@/components/MainHeader.vue';
import TableData from '@/components/TableData.vue';
import { useRouter } from 'vue-router';
import type { Word } from '@/types';

const router = useRouter();

const listTitle: Ref<string> = ref('');
const fileContent: Ref<string> = ref('');
const parsedArray: Ref<Word[]> = ref([]);
const isImportSuccessful: Ref<boolean> = ref(false);
const valid: Ref<boolean | null | undefined> = ref(null);
const rules: Ref<{
  titleRequired: boolean | string;
  textareaRequired: boolean | string;
  textareaValid: boolean | string;
}> = computed(() => {
  return {
    titleRequired: !!listTitle.value || 'Field is required',
    textareaRequired: !!fileContent.value || 'Field is required',
    textareaValid: validateTextareaContent(fileContent.value) || 'The format is not valid'
  };
});

function validateTextareaContent(text: string) {
  const lines = text.split('\n');
  const pattern = /^([^,]+,)+[^,]+$/;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      // Skip empty lines
      continue;
    }
    if (!pattern.test(trimmedLine)) {
      return false;
    }
  }

  return true;
}

function parseTextareaContent(text: string) {
  const lines = text.split('\n');
  const resArray = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      // Skip empty lines
      continue;
    }
    const [source, ...translations] = trimmedLine.split(',');
    const translation = translations.join(',').trim();
    resArray.push({ id: self.crypto.randomUUID(), source: source.trim(), translation });
  }

  return resArray;
}

function onClickImportList() {
  parsedArray.value = parseTextareaContent(fileContent.value);
  isImportSuccessful.value = true;
}

function onClickCancel() {
  isImportSuccessful.value = false;
}
function onClickCreateList() {
  console.log('parsedArray:', parsedArray.value);
  router.push({ name: 'lists' });
}
</script>

<template>
  <MainHeader title="Import a list" backRoute="lists" />

  <v-form v-if="!isImportSuccessful" v-model="valid" class="form">
    <div class="form-container">
      <v-text-field
        :rules="[rules.titleRequired]"
        class="list-title"
        label="List title"
        variant="underlined"
        v-model="listTitle"
        clearable
      />
      <p>Paste here your CSV file with the correct format:</p>
      <!-- TODO: Fix height of the field -->
      <v-textarea
        :rules="[rules.textareaRequired, rules.textareaValid]"
        placeholder="Example:&#10;word1, translation1&#10;word2, translation2&#10;..."
        auto-grow
        clearable
        v-model="fileContent"
        rows="10"
        class="textarea"
      ></v-textarea>
    </div>
    <v-btn class="btn-import" @click="onClickImportList" :disabled="!valid"> Import </v-btn>
  </v-form>

  <template v-else>
    <TableData :data="parsedArray" />

    <section class="btn-container">
      <v-btn class="btn-cancel" @click="onClickCancel" :disabled="!valid"> Cancel </v-btn>
      <v-btn class="btn-create" @click="onClickCreateList" :disabled="!valid"> Create </v-btn>
    </section>
  </template>
</template>

<style scoped>
.form {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
}

.list-title {
  flex: none;
  margin-bottom: 20px;
}

.textarea {
  flex: none !important;
  margin-top: 5px;
}

.btn-import,
.btn-container {
  margin-top: 20px;
  width: 100%;
  flex: none;
}

.btn-container {
  display: flex;
  justify-content: space-between;
}

.btn-cancel,
.btn-create {
  width: 48%;
}
</style>
