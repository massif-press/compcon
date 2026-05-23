<template>
  <cc-panel :title-color="color"
    :title="trait.Name">
    <template v-if="trait.Use"
      #toolbar-items>
      <v-chip v-if="trait.Use !== 'Mission'"
        size="small"
        flat
        tile
        prepend-icon="mdi-timer-sync-outline">
        {{ trait.Use }}
      </v-chip>
    </template>
    <p v-html-safe="trait.Description" />
    <div v-if="!combat">
      <cc-action v-for="(a, index) in trait.Actions"
        :key="`action-${index}`"
        :action="a"
        :panel="!mobile"
        class="my-2" />
      <cc-deployable-info v-for="(d, index) in trait.Deployables"
        :key="`deployable-${index}`"
        :deployable="d"
        :panel="!mobile"
        :owner="mech"
        class="my-2" />
      <cc-integrated-info v-for="(x, index) in trait.Integrated"
        :key="`integrated-${index}`"
        :item="x"
        :panel="!mobile"
        class="my-2" />
    </div>
    <slot name="combat" />
  </cc-panel>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { smAndDown: mobile } = useDisplay()

const props = withDefaults(defineProps<{
  trait: object
  color?: string
  combat?: boolean
  mech?: object | null
}>(), {
  color: 'primary',
  mech: null,
})
</script>
