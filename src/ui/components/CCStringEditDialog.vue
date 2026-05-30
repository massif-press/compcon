<template>
  <v-dialog v-model="dialog"
    :width="mobile ? '100vw' : '50vw'">
    <v-card tile>
      <component :is="getComponent"
        v-model="newString"
        :label="label"
        :placeholder="placeholder"
        :type="number ? 'number' : 'text'"
        variant="outlined"
        hide-details
        autofocus
        class="pa-4"
        @focus="$event.target.select()"
        @keyup.enter="confirm()" />
      <v-divider />
      <v-card-actions>
        <v-btn size="small"
          variant="text"
          @click="dialog = false">Cancel</v-btn>
        <v-spacer />
        <v-btn v-if="!number"
          size="small"
          variant="text"
          color="primary"
          @click="reset()">
          Reset
        </v-btn>
        <v-btn size="small"
          variant="text"
          color="success darken-1"
          @click="confirm()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMobile } from '@/composables/useMobile';
import { VTextarea, VTextField } from 'vuetify/components';

const { mobile, portrait } = useMobile()

const props = withDefaults(defineProps<{
  label?: string
  placeholder: string
  dark?: boolean
  number?: boolean
  multiline?: boolean
}>(), {
  label: ''
})

const emit = defineEmits<{
  'reset': []
  'save': []
}>()

const newString = ref('')
const dialog = ref(false)

const getComponent = computed(() => {
      if (props.multiline) return VTextarea;
      if (props.number) return VTextField;
      return VTextField;
    })

function save() {
      if (newString.value) emit('save', newString.value);
      newString.value = '';
    }
function confirm() {
      save();
      dialog.value = false;
    }
function reset() {
      emit('reset');
      dialog.value = false;
    }
function show() {
      newString.value = props.placeholder;
      dialog.value = true;
    }
function hide() {
      dialog.value = false;
    }

defineExpose({ show, hide })
</script>
