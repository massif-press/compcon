<template>
  <v-layout>
    <v-main class="py-2">
      <div :class="modal ? 'pa-2 mb-10' : 'mb-10'">
        <div class="mx-auto" :class="!mobile && 'px-12'" style="max-width: 1400px">
          <slot name="right-column" />
        </div>
      </div>
    </v-main>
  </v-layout>

  <div
    :style="`position: fixed; bottom: ${mobile ? 28 : 32}px; left: ${mobile ? 4 : 20}px; right: ${floatSize}; z-index: 901; transition: right 0.2s ease'`"
    style="min-width: 120px">
    <v-card
      flat
      tile
      class="px-2 py-1"
      style="border: 3px solid"
      :style="{
        borderColor: success ? 'rgb(var(--v-theme-success))' : 'rgb(var(--v-theme-error))',
      }">
      <v-row :no-gutters="!expanded" align="center" justify="space-between">
        <v-col v-if="!expanded" cols="auto">
          <v-icon v-if="success" color="success" icon="mdi-check" />
          <v-chip v-else flat tile color="error">
            <span class="heading h4 text-cc-flavor">{{ selected }}/{{ total }}</span>
          </v-chip>
        </v-col>
        <v-col v-if="expanded" cols="12" md="" class="text-center">
          <slot name="float" />
        </v-col>
        <v-col v-if="expanded" cols="12" md="" class="text-center">
          <slot name="jump" />
        </v-col>

        <v-col :cols="expanded ? 12 : 'auto'" md="auto" class="text-right">
          <v-btn
            size="x-small"
            @click="expanded = !expanded"
            :icon="!mobile || (mobile && !expanded)"
            :block="mobile && expanded"
            flat
            tile>
            <v-icon size="x-large">
              {{ expanded ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right' }}
            </v-icon>
            <span v-if="mobile && expanded">collapse</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
export default {
  name: 'selector',
  props: {
    title: {
      type: String,
      required: true,
    },
    success: {
      type: Boolean,
      required: false,
    },
    modal: {
      type: Boolean,
      required: false,
    },
    selected: {
      type: Number,
      required: false,
    },
    total: {
      type: Number,
      required: false,
    },
  },
  data: () => ({
    floating: false,
    expanded: false,
    showNav: null,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    floatSize() {
      const unit = this.modal ? '%' : 'vw';

      if (this.mobile) return this.expanded ? '4px' : `calc(100${unit} - 120px)`;
      return this.expanded ? '22px' : `calc(100${unit} - 135px)`;
    },
  },
};
</script>

<style scoped>
.fixed-float {
  position: fixed;
  top: 60px;
  max-width: 20vw;
}
</style>
