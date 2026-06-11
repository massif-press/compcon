<template>
  <cc-panel color="primary"
    style="position: relative"
    class="text-center"
    :height="mobile ? '' : '94px'"
    :width="mobile ? '' : '200px'"
    density="compact">
    <transition name="fade">
      <v-card-text class="pa-0"
        v-if="creating">
        <v-text-field ref="nameField"
          v-model="name"
          placeholder="Counter name"
          density="compact"
          hide-details
          variant="solo"
          flat
          tile
          @keypress.esc="cancel"
          @keypress.enter="create" />
        <v-row no-gutters
          class="mt-2">
          <v-col>
            <v-btn block
              flat
              tile
              height="20px"
              variant="text"
              @click="cancel">{{ $t('common.cancel') }}</v-btn>
          </v-col>
          <v-col>
            <v-btn block
              flat
              tile
              height="20px"
              variant="text"
              :disabled="!name"
              @click="create">
              {{ $t('common.add') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-btn v-else
        block
        flat
        tile
        stacked
        variant="text"
        style="height: 100%"
        @click="startCreating">
        <div :class="mobile ? '' : 'py-1'">
          <v-icon icon="mdi-plus"
            :size="mobile ? 'default' : 'x-large'" />
          <div v-if="!mobile">{{ $t('ui.counter.addCustom') }}</div>
        </div>
      </v-btn>
    </transition>
  </cc-panel>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useDisplay } from 'vuetify'

const { mdAndDown: mobile } = useDisplay()

const emit = defineEmits<{ create: [name: string] }>()

const creating = ref(false)
const name = ref('')
const nameField = ref<any>(null)

async function startCreating(): Promise<void> {
  creating.value = true;
  await nextTick();
  nameField.value?.focus();
}

function cancel(): void {
  name.value = '';
  creating.value = false;
}

function create(): void {
  if (!name.value) return;
  emit('create', name.value);
  name.value = '';
  creating.value = false;
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms ease-in-out;
  position: absolute;
  width: 100%;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */
  {
  opacity: 0;
}
</style>
