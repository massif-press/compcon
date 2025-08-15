<template>
  <v-card>
    <div v-if="selected">
      <cc-title offset>Relevant Tags ({{ selected.actor.Name }})</cc-title>
      <cc-tags v-if="actorTags.length" :tags="actorTags" extended />
      <div v-else class="text-disabled text-cc-overline ma-1">No Tags Found</div>
    </div>

    <cc-title offset>Relevant Tags (Encounter)</cc-title>
    <cc-tags v-if="relevantTags.length" :tags="relevantTags" extended />
    <div v-else class="text-disabled text-cc-overline ma-1">No Tags Found</div>

    <cc-title offset class="mt-6">Other Tags</cc-title>
    <cc-tags :tags="allTags" extended />
  </v-card>
</template>

<script>
import _ from 'lodash';
import { CompendiumStore } from '@/stores';

export default {
  name: 'ReferenceTagPage',
  props: {
    selected: {
      type: Object,
      required: false,
    },
    encounterInstance: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    randomTags: [],
    allTags: [],
  }),
  mounted() {
    this.allTags = CompendiumStore().Tags.filter(
      (t) => !this.randomTags.some((x) => x.ID === t.ID)
    );
  },
  computed: {
    actorTags() {
      if (this.selected && this.selected.actor) return this.getActorTags(this.selected.actor);
      return [];
    },
    relevantTags() {
      const tags = [];
      this.encounterInstance.Combatants.forEach((c) => {
        if (c.actor) {
          if (c.actor.PilotLoadoutController) {
            tags.push(...c.actor.PilotLoadoutController.ActiveLoadout.AllTags);
          }
          if (c.actor.MechLoadoutController) {
            tags.push(...c.actor.MechLoadoutController.ActiveLoadout.AllTags);
          }
          if (c.actor.NpcFeatureController) {
            tags.push(...c.actor.NpcFeatureController.AllTags);
          }
        }
      });
      return _.uniqBy(tags, 'ID');
    },
  },
  methods: {
    getActorTags(actor) {
      if (actor.ActiveMech) {
        return _.uniqBy(actor.ActiveMech.MechLoadoutController.ActiveLoadout.AllTags, 'ID');
      }
      if (actor.PilotLoadoutController) {
        return _.uniqBy(actor.PilotLoadoutController.ActiveLoadout.AllTags, 'ID');
      }

      if (actor.NpcFeatureController) {
        return _.uniqBy(actor.NpcFeatureController.AllTags, 'ID');
      }
      return [];
    },
  },
};
</script>
