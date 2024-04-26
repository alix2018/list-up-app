<script setup lang="ts">
import { computed, type Ref, ref } from 'vue';
import MainHeader from '@/components/MainHeader.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const listTitle: Ref<string> = ref('');
const valid: Ref<boolean | null | undefined> = ref(null);
const rules: Ref<{
  required: boolean | string;
}> = computed(() => {
  return {
    required: !!listTitle.value || 'Field is required'
  };
});

function onClickCreateList() {
  router.push({ name: 'lists' });
}
</script>

<template>
  <MainHeader title="Create a list" backRoute="lists" />

  <v-form v-model="valid" class="form">
    <v-text-field
      :rules="[rules.required]"
      class="list-title"
      label="List title"
      variant="underlined"
      v-model="listTitle"
      clearable
    />

    <v-table class="table" density="comfortable" fixed-header>
      <thead class="thead">
        <tr>
          <th class="th">Source</th>
          <th class="th">Translation</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <v-text-field class="input" variant="underlined" />
          </td>
          <td><v-text-field class="input" variant="underlined" /></td>
        </tr>
      </tbody>
    </v-table>

    <!-- TODO: Compute valid property -->
    <v-btn class="btn-create" @click="onClickCreateList" :disabled="!valid"> Create </v-btn>
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

.btn-create {
  margin-top: 20px;
  width: 100%;
  flex: none;
}

td {
  padding: 10px 20px;
}
</style>
