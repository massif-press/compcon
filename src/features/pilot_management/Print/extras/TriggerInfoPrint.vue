<template>
  <div class="pa-2 mt-3">
    <div class="text-overline text-primary" style="line-height: 15px">SKILL TRIGGER DETAIL</div>
    <v-row dense>
      <v-col v-for="t in triggers" style="min-width: 16vw">
        <v-card variant="outlined" class="pa-1" color="grey" style="height: 100%">
          <div class="caption heading text-black">
            <v-icon icon="cc:skill" class="mt-n1" />{{ t.Name }}
          </div>
          <div class="caption text-black">
            {{ t.Description }}
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';

export default {
  name: 'tag-info-print',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  computed: {
    triggers() {
      return CompendiumStore().Skills.filter((s) =>
        this.pilot.SkillsController.Skills.some((x) => x.Skill.ID === s.ID)
      );
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
