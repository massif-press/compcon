<template>
  <v-fade-transition leave-absolute>
    <div v-if="!editing"
      class="d-inline-block"
      key="str"
      style="position: relative">
      <span style="width: fit-content">
        <slot />
      </span>
      <v-btn v-if="!readonly"
        size="x-small"
        icon
        variant="plain"
        style="position: absolute; right: -30px; bottom: 0px"
        @click="edit">
        <v-icon size="15"
          icon="mdi-circle-edit-outline" />
      </v-btn>
    </div>
    <div v-else
      key="editname">
      <v-text-field v-model="newStr"
        :density="large ? 'comfortable' : 'compact'"
        :height="large ? '50px' : ''"
        :placeholder="placeholder"
        required
        hide-details
        :min-width="minWidth"
        @blur="submit()"
        @keyup.enter="submit()"
        @focus="$event.target.select()" />
    </div>
  </v-fade-transition>
</template>

<script setup lang="ts">
import { ref, useSlots } from 'vue'

defineOptions({ name: 'cc-short-string-editor' })

const props = withDefaults(defineProps<{
  placeholder?: string
  large?: boolean
  absolute?: boolean
  readonly?: boolean
  justify?: string
  maxWidth?: string | boolean
  minWidth?: string
}>(), {
  justify: 'center'
})

const emit = defineEmits<{
  'set': []
}>()

const slots = useSlots()
const newStr = ref('')
const editing = ref(false)

if (props.placeholder) newStr.value = props.placeholder;

function edit() {
  if (props.readonly) return;
  editing.value = true;
  const slotVnodes = slots.default ? slots.default() : [];
  if (slotVnodes.length && slotVnodes[0]) {
    const vn = slotVnodes[0];
    let prev = '';
    if (typeof vn.children === 'string') prev = vn.children.trim();
    else if (Array.isArray(vn.children) && vn.children[0] && typeof vn.children[0].children === 'string')
      prev = vn.children[0].children.trim();
    newStr.value = prev;
  }
}
function submit() {
  emit('set', newStr.value);
  editing.value = false;
}
</script>

<style scoped>
.name.fade-transition-enter-active {
  position: relative;
  top: -2px;
}

.name.fade-transition-leave-active {
  position: relative;
  bottom: 1px;
}

.v-input {
  padding: 0 !important;
  margin: 0 !important;
  font-size: inherit !important;
  line-height: inherit !important;
  min-height: min-content !important;
}

.v-input input {
  max-height: fit-content !important;
}

.v-input__slot {
  margin-bottom: 0 !important;
  font-size: inherit !important;
  min-height: min-content !important;
  line-height: inherit !important;
}

.label {
  font-size: 1em;
  font-weight: bold;
}
</style>
