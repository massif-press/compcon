<template>
  <v-list-item
    :key="indexItem.path"
    :prepend-icon="indexItem.icon"
    :title="indexItem.title"
    border
    class="my-1"
    :subtitle="unCamelCase(indexItem.type)"
    @click="navTo(indexItem.path)">
    <template v-if="!mobile" #append>
      <i class="text-caption">{{ indexItem.pack }}</i>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { unCamelCase } from '@/classes/utility/accent_fold'
import { IndexItem, NavStore } from '@/stores'

const props = defineProps<{
  indexItem: Record<string, any>
  mobile?: boolean
}>()

const emit = defineEmits<{ onNav: [] }>()
const router = useRouter()

function navTo(path: string) {
  router.push(path)
  NavStore().setSearchHistory(props.indexItem as IndexItem)
  emit('onNav')
}
</script>
