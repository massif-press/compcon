<template>
  <v-col :cols="cols">
    <v-card tile variant="outlined" class="text-center">
      <v-card-title
        :class="`${color} text-white caption pa-1`"
        style="font-weight: bold; max-height: 28px; font-size: 18px !important"
      >
        <v-menu
          v-model="menu"
          :value="editable || (selectable && statController.Sizes.length > 1)"
          right
          offset-y
        >
          <template #activator="{ props }">
            <v-btn icon dark x-small class="fade-select" absolute v-bind="props">
              <v-icon icon="mdi-circle-edit-outline" />
            </v-btn>
          </template>
          <v-card>
            <v-card-text class="pa-2">
              <v-btn
                v-for="i in editable ? allSizes : statController.Sizes"
                style="width: 80px; height: 80px"
                class="ma-3"
                icon
                color="accent"
                @click="statController.Size = i"
              >
                <v-icon v-if="i === 0.5" size="80">cc:size-half</v-icon>
                <v-icon v-else size="80">cc:size-{{ i }}</v-icon>
              </v-btn>
            </v-card-text>
          </v-card>
        </v-menu>
        <v-spacer />
        SIZE
        <v-spacer />
      </v-card-title>
      <v-card-text class="pa-1 text-text">
        <span class="heading h2">
          {{ parseFloat(statController.Size) === 0.5 ? '½' : statController.Size }}
        </span>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts">
export default {
  name: 'size-attribute',
  props: {
    statController: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'accent',
    },
    cols: {
      type: [String, Number],
      required: false,
      default: '',
    },
    editable: {
      type: Boolean,
    },
    selectable: {
      type: Boolean,
    },
  },
  data: () => ({
    allSizes: [0.5, 1, 2, 3, 4],
    model: 0,
    menu: false,
  }),
};
</script>
