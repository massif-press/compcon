<template>
  <v-hover>
    <template #default="{ isHovering, props }">
      <v-row
        v-bind="props"
        dense
        class="mb-2"
        :style="`border: 1px solid rgb(var(--v-theme-primary); position: relative; cursor: pointer; border-radius: 3px; background-color: ${
          isHovering
            ? odd
              ? 'rgba(255,255,255,0.03)'
              : 'rgba(255,255,255,0.1)'
            : odd
              ? 'rgba(0,0,0,0.05)'
              : 'rgba(255,255,255,0.05'
        };`"
        @click="$emit('open', item)">
        <v-col cols="auto" class="pb-0">
          <v-badge :content="item.number" bordered color="primary">
            <v-card variant="tonal" class="rounded-0">
              <cc-img :aspect-ratio="1" :src="item.actor.PortraitController.Image" width="100" />
            </v-card>
          </v-badge>
        </v-col>

        <v-col class="pb-0 pl-2">
          <v-toolbar density="compact" color="panel" class="pr-1" style="height: 32px">
            <div class="mt-n4" style="width: 100%">
              <v-row dense>
                <v-col cols="auto">
                  <div :class="`heading h3 ${isHovering ? 'text-accent' : ''}`">
                    <slot name="title" />
                  </div>
                </v-col>

                <v-col cols="auto" class="ml-auto pt-0">
                  <combatant-settings-menu :readonly="readonly" :item="item" />
                </v-col>

                <v-col v-if="!readonly" cols="auto">
                  <v-menu v-model="deleteMenu">
                    <template #activator="{ props }">
                      <v-btn
                        v-bind.stop="props"
                        color="error"
                        text="Remove"
                        size="x-small"
                        flat
                        tile
                        variant="plain"
                        class="pt-1" />
                    </template>
                    <cc-confirmation
                      cancellable
                      :content="`Confirm deletion of ${item.actor.Name} from the encounter`"
                      @confirm="removeItem"
                      @cancel="deleteMenu = false" />
                  </v-menu>
                </v-col>
              </v-row>
            </div>
          </v-toolbar>
          <slot />
        </v-col>
        <v-tooltip v-if="!readonly" :open-delay="500" max-width="300px">
          <template #activator="{ props }">
            <v-icon
              v-bind="props"
              size="small"
              :color="item.actor.IsLinked ? 'success' : 'rgba(150, 150, 150, 0.5)'"
              :icon="item.actor.IsLinked ? 'mdi-link-variant' : 'mdi-link-variant-off'"
              style="position: absolute; bottom: 2px; right: 2px" />
          </template>
          <i18n-t v-if="item.actor.IsLinked" keypath="gm.combatant.linkedSource" tag="span" scope="global">
            <template #name><b class="text-accent">{{ item.actor.GetLinkedItem().Name }}</b></template>
          </i18n-t>
          <span v-else>{{ $t('gm.combatant.notLinkedSource') }}</span>
        </v-tooltip>
      </v-row>
    </template>
  </v-hover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CombatantSettingsMenu from '../_components/combatantSettingsMenu.vue'

const props = withDefaults(defineProps<{
  item: Record<string, any>
  odd?: boolean
  readonly?: boolean
}>(), { readonly: false })

const emit = defineEmits<{ remove: [item: any]; open: [item: any] }>()

const deleteMenu = ref(false)

function editUnit() {
  emit('open', props.item)
}
function removeItem() {
  deleteMenu.value = false
  emit('remove', props.item)
}
</script>
