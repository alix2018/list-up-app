<script setup lang="ts">
import type { Word } from '@/types';

type Props = {
  data?: Word[];
};

const props = withDefaults(defineProps<Props>(), {
  data: () => []
});
</script>

<template>
  <v-table class="table" density="comfortable" fixed-header>
    <thead class="thead">
      <tr>
        <th class="th">Source</th>
        <th class="th">Translation</th>
      </tr>
    </thead>
    <tbody v-if="props.data && props.data?.length > 0">
      <tr v-for="word in props.data" :key="word.source">
        <td>{{ word.source }}</td>
        <td>{{ word.translation }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<style>
.table {
  display: flex;
  flex: 1;
  overflow-y: auto;
}

.th {
  font-weight: bold !important;
}

td {
  padding: 10px 20px;
}
</style>
