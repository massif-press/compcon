<template>
  <v-hover>
    <template #default="{ isHovering, props }">
      <v-row
        v-bind="props"
        dense
        :style="`cursor: pointer; border-radius: 2px; border: ${
          isHovering ? '1px solid rgb(var(--v-theme-primary))' : ''
        }; background-color: ${odd ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05'}`"
        @click="$emit('open', item)"
      >
        <v-col cols="auto">
          <v-card variant="tonal" class="rounded-0">
            <cc-img :aspect-ratio="1" :src="item.PortraitController.Image" width="75" />
          </v-card>
        </v-col>
        <v-col>
          <v-row dense class="pl-1 pr-3">
            <v-col :class="`heading h3 ${isHovering ? 'text-accent' : ''}`">
              <div>{{ item.Name }}</div>
              <div class="pl-1" style="font-size: 17px">
                <i>{{ item.Title }}</i>
              </div>
            </v-col>
            <v-col cols="auto" class="heading text-disabled">{{ item.Pronouns }}</v-col>
          </v-row>
        </v-col>
      </v-row>
    </template>
  </v-hover>
</template>

<script lang="ts">
export default {
  name: 'gm-doodad-list-item',
  props: {
    item: { type: Object, required: true },
    big: { type: Boolean },
    odd: { type: Boolean },
  },
  emits: ['open'],
};
</script>
