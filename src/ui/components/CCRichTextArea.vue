<template>
  <div>
    <v-card
      v-if="readonly"
      variant="outlined"
      class="pa-2"
      style="border-color: rgb(var(--v-theme-panel))"
    >
      <p v-html-safe="modelValue" />
    </v-card>
    <quill-editor
      v-else
      :content="content"
      :options="options"
      content-type="html"
      @blur="emitUpdate.flush()"
      @update:content="emitUpdate"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount } from 'vue'
  import { options } from '@/ui/style/quillSetup'
  import { debounce } from 'lodash-es'

  const props = withDefaults(
    defineProps<{
      modelValue?: string
      readonly?: boolean
    }>(),
    {
      modelValue: '',
    }
  )

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  const content = computed(() => {
    if (!props.modelValue?.includes('ql-cursor')) return props.modelValue
    const template = document.createElement('template')
    template.innerHTML = props.modelValue
    template.content
      .querySelectorAll('.ql-cursor')
      .forEach(el => el.replaceWith(...Array.from(el.childNodes)))
    return template.innerHTML.replace(/\uFEFF/g, '')
  })

  const emitUpdate = debounce((value: string) => emit('update:modelValue', value), 100)

  onBeforeUnmount(() => {
    emitUpdate.flush()
  })
</script>

<style>
  .ql-toolbar.ql-snow {
    border: 1px solid rgb(var(--v-theme-panel));
    border-top-right-radius: 3px;
    border-top-right-radius: 3px;

    box-sizing: border-box;
    font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    padding: 2px;
  }

  .ql-container.ql-snow {
    border: 1px solid rgb(var(--v-theme-panel));
    border-bottom-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }
</style>
