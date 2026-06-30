<template>
  <v-dialog v-model="dialog"
    width="35vw">
    <v-card tile
      class="text-center">
      <v-card-text>
        <span class="heading h2">{{ $t('ui.widget.selectDamageType') }}</span>
        <cc-button v-for="t in availableTypes"
          :key="t"
          block
          size="small"
          class="mb-2"
          :prepend-icon="`cc:${t.toLowerCase()}`"
          :color="`damage--${t.toLowerCase()}`"
          @click="select(t)">
          {{ $enum('damageType', t) }}
        </cc-button>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { DamageType } from '@/classes/enums'


const props = withDefaults(defineProps<{
  allowedTypes?: any[]
}>(), {
  allowedTypes: () => []
})

const emit = defineEmits<{
  'select': [payload: any]
}>()

const dialog = ref(false)
const availableTypes = ref([] as string[])
const selected = ref('')

function damageTypes() {
  return Object.keys(DamageType)
    .map((k) => DamageType[k as any])
    .sort() as string[];
}
function show() {
  dialog.value = true;
}
function hide() {
  dialog.value = false;
}
function select(t: string) {
  emit('select', t);
  hide();
}

defineExpose({ show, hide })

onMounted(() => {
  availableTypes.value = damageTypes().filter((t) => props.allowedTypes?.includes(t));
})
</script>
