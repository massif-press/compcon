<template>
  <v-row
    no-gutters
    justify="center"
    class="d-flex align-center justify-center"
    :style="`max-height: ${small ? '150px' : '200px'}; min-height: ${small ? '75px' : '200px'}`">
    <v-col>
      <div>
        <slot name="top" />
        <div v-if="item.Tags && item.Tags.length" cols="12" class="text-center pb-2 pt-2 my-1">
          <cc-tags :tags="item.Tags" small density="compact" variant="outlined" color="accent" />
        </div>
      </div>
    </v-col>
  </v-row>
  <v-toolbar
    density="compact"
    :color="`${highlighted ? 'secondary' : 'primary'}${hover ? ' lighten-1' : ''}`"
    class="px-3">
    <div>
      <div
        v-if="item.Source || $slots.overline"
        class="text-cc-overline"
        style="overflow: hidden; width: 100%; text-overflow: ellipsis; white-space: nowrap">
        <span v-if="item.Source">{{ item.Source }}&nbsp;</span>
        <slot name="overline" />
      </div>
      <div
        :class="small ? 'font-weight-bold text-uppercase' : 'heading h3'"
        :style="`overflow: hidden; width: ${
          small ? '73vw' : '25vw'
        }; text-overflow: ellipsis; white-space: nowrap;`">
        {{ item.Name }}
      </div>
    </div>
  </v-toolbar>
</template>

<script lang="ts">
export default {
  name: 'card-content-base',
  props: {
    item: { type: Object, required: true },
    small: { type: Boolean },
    hover: { type: Boolean },
    highlighted: { type: Boolean },
  },
};
</script>

<style scoped>
.card-effect {
  height: 75px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;

  -webkit-line-clamp: 3;
  line-clamp: 3;
}
</style>
