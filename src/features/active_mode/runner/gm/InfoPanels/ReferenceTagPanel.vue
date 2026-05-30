<template>
  <v-card flat
    tile>
    <div v-if="selected"
      class="mb-6">
      <cc-title offset>{{ pc ? 'Your' : 'Relevant' }} Tags ({{ selected.Name || selected.actor.Name
        }})</cc-title>
      <cc-tags v-if="actorTags.length"
        :tags="actorTags"
        extended
        force-extended />
      <div v-else
        class="text-disabled text-cc-overline ma-1">No Tags Found</div>
    </div>

    <div v-if="!pc"
      class="mb-6">
      <cc-title offset>Relevant Tags (Encounter)</cc-title>
      <cc-tags v-if="relevantTags.length"
        :tags="relevantTags"
        extended
        force-extended />
      <div v-else
        class="text-disabled text-cc-overline ma-1">No Tags Found</div>
    </div>

    <cc-title offset>All Tags</cc-title>
    <cc-tags :tags="allTags"
      extended
      force-extended />
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import * as _ from 'lodash-es';
import { CompendiumStore } from '@/stores';

defineOptions({ name: 'ReferenceTagPage' })

const props = defineProps<{
  selected?: object
  encounterInstance: object
  pc?: boolean
}>()

const allTags = ref([])

const actorTags = computed(() => {
      if (props.pc) return getActorTags(props.selected);
      if (props.selected && props.selected.actor) return getActorTags(props.selected.actor);
      return [];
    })
const relevantTags = computed(() => {
      const tags = [];
      props.encounterInstance.Combatants.forEach((c) => {
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
    })

function getActorTags(actor) {
      if (actor.ActiveMech && actor.ActiveMech.MechLoadoutController) {
        return _.uniqBy(actor.ActiveMech.MechLoadoutController.ActiveLoadout.AllTags, 'ID');
      }
      if (actor.PilotLoadoutController) {
        return _.uniqBy(actor.PilotLoadoutController.ActiveLoadout.AllTags, 'ID');
      }

      if (actor.NpcFeatureController) {
        return _.uniqBy(actor.NpcFeatureController.AllTags, 'ID');
      }
      return [];
    }

onMounted(() => {
allTags.value = CompendiumStore().Tags
})
</script>
