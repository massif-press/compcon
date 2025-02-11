<template>
  <cc-panel density="compact" color="surface">
    <template #toolbar>
      <cc-toolbar :title="bond.Name" :hideTitle="hideTitle" hide-close />
    </template>
    <slot name="button" />
    <div class="px-4">
      <v-row class="text-text">
        <v-col>
          <div class="text-cc-overline font-weight-bold">MAJOR IDEALS</div>
          <ul class="ml-6">
            <li v-for="s in bond.MajorIdeals" v-text="s" />
          </ul>
        </v-col>
        <v-col>
          <div class="text-cc-overline font-weight-bold">MINOR IDEALS</div>
          <ul class="ml-6">
            <li v-for="s in bond.MinorIdeals" v-text="s" />
          </ul>
        </v-col>
      </v-row>
      <v-row class="text-text">
        <v-col v-for="q in bond.Questions">
          <div class="text-cc-overline font-weight-bold" v-text="q.question" />
          <ul class="ml-6">
            <li v-for="o in q.options" v-text="o" />
          </ul>
        </v-col>
      </v-row>
      <cc-heading line><span class="heading h3">Bond Powers</span></cc-heading>
      <masonry-wall
        :items="bond.Powers"
        :column-width="400"
        :gap="16"
        :min-columns="1"
        :max-columns="2">
        <template #default="{ item }">
          <cc-bond-power-card :power="item" />
        </template>
      </masonry-wall>
    </div>
  </cc-panel>
</template>

<script lang="ts">
export default {
  name: 'cc-bond-info',
  props: { bond: { type: Object, required: true }, hideTitle: { type: Boolean } },
};
</script>
