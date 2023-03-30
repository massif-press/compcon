<template>
  <div>
    <v-row
      no-gutters
      align="center"
      justify="center"
      :style="`max-height: ${small ? '150px' : '200px'}; min-height: ${
        small ? '75px' : '200px'
      }`"
    >
      <v-col>
        <div>
          <slot name="top" />
          <div
            v-if="item.Tags && item.Tags.length"
            cols="12"
            class="text-center pb-2 pt-2 my-1"
          >
            <cc-tags
              :tags="item.Tags"
              small
              density="compact"
              variant="outlined"
              color="accent"
            />
          </div>
        </div>
      </v-col>
    </v-row>
    <v-toolbar
      density="compact"
      :color="hover ? 'primary lighten-1' : 'primary'"
      dark
    >
      <div>
        <div class="text-overline mb-n2">
          <span v-if="item.Source">{{ item.Source }}&nbsp;</span>
          <slot name="overline" />
        </div>
        <div
          :class="small ? 'font-weight-bold' : 'heading h3'"
          :style="`overflow: hidden; width: ${
            small ? '73vw' : '25vw'
          }; text-overflow: ellipsis; white-space: nowrap;`"
        >
          {{ item.Name }}
        </div>
      </div>
    </v-toolbar>
  </div>
</template>

<script lang="ts">
export default {
  name: 'card-content-base',
  props: {
    item: { type: Object, required: true },
    small: { type: Boolean },
    hover: { type: Boolean },
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
}
</style>
