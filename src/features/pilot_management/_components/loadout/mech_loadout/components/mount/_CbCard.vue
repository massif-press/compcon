<template>
  <cc-panel class="mt-1 mb-2"
    :title="bonus.Name"
    icon="cc:corebonus"
    title-color="secondary">
    <div class="text-disabled"
      :class="mobile ? 'text-cc-overline' : 'flavor-text'">
      {{ bonus.MountedEffect }}
    </div>
  </cc-panel>
</template>

<script setup lang="ts">
import { CoreBonus } from '@/classes/pilot/components';
import { useDisplay } from 'vuetify'

const props = defineProps({
  bonus: {
    type: CoreBonus,
    required: true,
  },
})

const { smAndDown: mobile, xs: portrait } = useDisplay()
</script>
