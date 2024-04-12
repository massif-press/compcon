<template>
  <notifications position="bottom right" width="40%" pause-on-hover :duration="3000">
    <template #body="props">
      <v-card :color="props.item.data.type || 'info'" class="pa-3 ma-1">
        <v-row>
          <v-col>
            <div class="heading h3">
              {{ props.item.title }}
            </div>
          </v-col>
          <v-col cols="auto">
            <v-icon
              size="large"
              icon="mdi-close"
              variant="plain"
              @click.stop="closePopup(props.close)" />
          </v-col>
        </v-row>
        <v-row dense align="center">
          <v-col cols="auto">
            <v-icon
              v-if="props.item.data.icon"
              :color="props.item.data.iconColor"
              :size="props.item.data.iconSize"
              :class="props.item.data.iconClass">
              {{ props.item.data.icon }}
            </v-icon>
          </v-col>
          <v-col>
            <div v-html="props.item.text" />
          </v-col>
        </v-row>
      </v-card>
    </template>
  </notifications>
</template>

<script lang="ts">
export default {
  name: 'cc-notify',
  methods: {
    closePopup(close: () => void) {
      close();
    },
  },
};
</script>
