<template>
  <div class="pa-2 mt-3">
    <div class="text-overline text-primary" style="line-height: 0">EQUIPMENT TAG DETAIL</div>
    <div v-for="t in tags" class="ma-2">
      <v-card variant="outlined" class="pa-2" color="grey">
        <v-row dense>
          <v-col cols="auto">
            <v-icon icon="mdi-tag-outline" />
          </v-col>
          <v-col>
            <div class="heading text-black">
              {{ t.Name }}
            </div>
            <div class="caption text-black">
              {{ t.Description }}
            </div>
          </v-col>
        </v-row>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';

export default {
  name: 'tag-info-print',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    mech: {
      type: Object,
      required: false,
    },
  },
  computed: {
    tags() {
      let arr = [] as any[];
      if (this.pilot) arr = this.pilot.Loadout.Items.flatMap((x) => x.Tags);
      if (this.mech)
        arr = [
          ...arr,
          ...this.mech.MechLoadoutController.ActiveLoadout.Equipment.flatMap((x) => x.Tags),
        ];

      return _.uniqBy(arr, 'ID');
    },
  },
  methods: {
    showTag(id) {
      const hiddenTags = ['tg_hidden', 'tg_unique', 'tg_set_damage_type'];
      return !hiddenTags.includes(id);
    },
  },
};
</script>

<style scoped>
.caption {
  font-size: 12px;
}

.p-stat {
  font-size: 34px;
}

fieldset {
  padding: 0 4px;
  height: 100%;
  border-radius: 3px;
  border-color: rgb(var(--v-theme-grey-lighten2));
}
</style>
