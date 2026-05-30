<template>
  <quill-editor v-model:content="text"
    :options="editorOptions"
    theme="snow"
    content-type="html"
    style="min-height: 75px;" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { options } from '@/ui/style/quillSetup'
import { debounce } from 'lodash-es'

defineOptions({ name: 'CcTextEditor' })

const props = withDefaults(defineProps<{
  original?: string
}>(), {
  original: '',
})

const emit = defineEmits<{ save: [value: string] }>()

const title = ref('')
const text = ref('')

const editorOptions = computed(() => options)

const emitSave = debounce((value: string) => emit('save', value), 300)

watch(text, (value) => {
  emitSave(value)
})

if (props.original) text.value = props.original
</script>
