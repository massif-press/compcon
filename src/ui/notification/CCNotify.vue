<template>
  <notifications
    position="bottom right"
    :width="mobile ? '100vw' : '30vw'"
    min-width="400px"
    pause-on-hover
    :duration="3000">
    <template #body="props">
      <cc-alert
        :color="props.item.data.color || 'info'"
        :icon="props.item.data.icon || 'mdi-bell'"
        class="ma-2 pb-2 border-s-lg"
        style="position: relative"
        tile
        :title="props.item.title"
        @click.stop="closePopup(props.close)">
        <div v-html="props.item.text" />
        <div
          class="text-center text-cc-overline"
          style="
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            font-size: 7pt !important;
            opacity: 0.6;
          ">
          {{ mobile ? 'TAP' : 'CLICK' }} TO CLOSE
        </div>
      </cc-alert>
    </template>
  </notifications>
</template>

<script lang="ts">
export default {
  name: 'cc-notify',
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
  methods: {
    closePopup(close: () => void) {
      close();
    },
  },
};
</script>
