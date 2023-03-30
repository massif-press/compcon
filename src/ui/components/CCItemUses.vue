<template>
  <div class="mt-n2">
    <v-btn
      v-for="n in max"
      class="d-inline my-0 mx-n1 pa-0"
      icon
      :small="small"
      :large="large"
      :color="color"
      @click.stop="set(n)"
    >
      <v-icon v-html="n <= current ? fullIcon : emptyIcon" />
    </v-btn>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CCItemUses',
  props: {
    small: {
      type: Boolean,
      required: false,
      default: false,
    },
    large: {
      type: Boolean,
      required: false,
      default: false,
    },
    emptyIcon: {
      type: String,
      required: false,
      default: 'mdi-hexagon-outline',
    },
    fullIcon: {
      type: String,
      required: false,
      default: 'mdi-hexagon-slice-6',
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    item: {
      type: Object,
      required: true,
    },
    bonus: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  computed: {
    max(): number {
      return this.item.getTotalUses(this.bonus);
    },
    current(): number {
      return this.item.Uses;
    },
  },
  methods: {
    set(val): void {
      if (val > this.current) this.item.Uses = this.item.Uses + 1;
      else this.item.Uses = this.item.Uses - 1;
    },
  },
};
</script>
