<template>
  <v-card v-show="!item.Secret || item.Unlocked"
    :key="item.Unlocked"
    :color="getColor"
    flat
    tile
    class="my-2 pr-2"
    style="position: relative"
    :style="item.Secret ? `background: linear-gradient(90deg, #991E2A 0%, #673AB7 100%);` : ''">
    <v-row align="center"
      :style="item.Unlocked ? '' : 'opacity: 0.6'"
      dense>
      <v-col cols="auto">
        <v-icon :size="mobile ? 50 : 70"
          :icon="item.Secret ? 'mdi-clippy' : `cc:achievement_${item.Rarity}`" />
      </v-col>
      <v-col v-if="!item.Hidden || item.Unlocked">
        <div class="heading h3">
          {{ item.Name }}
        </div>
        <div>{{ item.Description }}</div>
        <v-progress-linear
          v-if="item.Progress && item.Progress !== 0 && item.Goal > 1 && !item.Unlocked"
          v-model="item.Progress"
          :color="getColor"
          :height="10"
          :max="item.Goal"
          class="mb-1">
          <template>
            <div class="text-cc-overline text-center">
              {{ ((item.Progress / item.Goal) * 100).toFixed(2) }}%
            </div>
          </template>
        </v-progress-linear>
      </v-col>
      <v-col v-else>
        <div class="heading h3">[ {{ strings.dataRedacted }} ]</div>
        <div>{{ strings.hiddenNote }}</div>
      </v-col>
      <v-col v-if="item.Unlocked"
        cols="12"
        md="auto"
        class="text-right py-1 mx-2">
        <div class="text-caption">
          <span v-if="item.Secret">{{ strings.secretLabel }}</span>
          {{ strings.unlockedLabel }}
        </div>
        <div :class="mobile ? 'text-cc-overline' : 'heading'">
          {{ formatDate }}
        </div>
      </v-col>
    </v-row>
    <div v-if="item.Author"
      class="text-cc-overline text-center"
      style="
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        font-size: 7pt !important;
        opacity: 0.75;
      ">
      <cc-slashes />
      {{ strings.createdBy }} {{ item.Author }}
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useNavStrings } from '@/features/nav/useNavStrings'
const { section } = useNavStrings()

const props = defineProps<{ item: Record<string, any> }>()

const { smAndDown: mobile } = useDisplay()
const strings = section('achievementItem')

const getColor = computed(() => {
  if (!props.item.Unlocked) return 'grey-darken-2'
  if (props.item.Secret) return '#FFDF00'
  switch (props.item.Rarity) {
    case 1: return '#205781'
    case 2: return '#4F1C51'
    case 3: return '#A31D1D'
    case 4: return '#d4af37'
    default: return 'primary'
  }
})

const formatDate = computed(() => {
  if (!props.item.Date) return ''
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }
  return new Date(props.item.Date).toLocaleString(undefined, options as any)
})
</script>
