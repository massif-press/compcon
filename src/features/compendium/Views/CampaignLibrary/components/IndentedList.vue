<template>
  <div>
    <template v-for="(item, index) in <any[]>items" :key="`item-${index}`">
      <div v-if="item" class="my-1" :style="{ marginLeft: `${level * 6}px` }">
        <v-btn
          @click="$emit('clicked', item)"
          variant="tonal"
          :color="selected === item ? 'secondary' : ''"
          :size="level === 0 ? 'small' : 'x-small'"
          stacked
          :height="calcHeight(item)"
          width="100%">
          <span>
            <span v-if="item.Parent && item.SectionType.toLowerCase() !== 'section'">
              {{ item.ItemNumber }}.
            </span>
            {{ item.Title }}
          </span>
        </v-btn>
        <template v-if="item.Children.length">
          <IndentedList
            :items="item.Children"
            :level="level + 1"
            :selected="selected"
            @clicked="$emit('clicked', $event)" />
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'indented-list' })

const props = withDefaults(defineProps<{
  items: any[]
  level: number
  selected?: object
}>(), {
  level: 0
})

const emit = defineEmits<{
  'clicked': []
}>()

function calcHeight(item: any) {
      const len = item.Title.length;
      const linelength = len + props.level * 3;
      return Math.floor(linelength / 30) * 14 + 24;
    }
</script>
