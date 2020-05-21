<template>
  <cc-titled-panel
    :icon="npc.Class.RoleIcon"
    :title="
      `${npc.Name}  —  ${typeof npc.Tier === 'number' ? `T${npc.Tier}` : `Custom`} ${
        npc.Class.Name
      } ${npc.Templates.map(t => t.Name).join(' ')} ${npc.Tag}`
    "
    :color="npc.Class.Color"
    dense
  >
    <v-row dense class="mt-n1">
      <v-col v-if="npc.Campaign" cols="auto">
        <div class="overline">CAMPAIGN</div>
        {{ npc.Campaign }}
      </v-col>
      <v-col v-if="npc.Labels.length">
        <div class="overline">LABELS</div>
        <v-chip v-for="l in npc.Labels" :key="l" small class="mx-1">{{ l }}</v-chip>
      </v-col>
      <v-col>
        <v-select
          v-if="sideSelect"
          v-model="npc.Side"
          label="Side"
          outlined
          dense
          hide-details
          :items="['Enemy', 'Ally', 'Neutral']"
        />
      </v-col>
    </v-row>
    <v-textarea
      v-if="sideSelect"
      v-model="npc.Note"
      outlined
      label="GM Notes"
      auto-grow
      rows="2"
      class="mt-3"
    />
    <p v-else-if="npc.Note" class="flavor-text mb-0" v-html="npc.Note" />

    <v-row dense class="text-center" align="center">
      <v-col cols="7">
        <v-row dense no-gutters>
          <simple-attribute attr="HULL" :val="npc.Stats.Hull" />
          <simple-attribute attr="AGI" :val="npc.Stats.Agility" />
          <simple-attribute attr="SYS" :val="npc.Stats.Systems" />
          <simple-attribute attr="ENG" :val="npc.Stats.Engineering" />
        </v-row>
        <v-divider class="my-2" />
        <v-row dense no-gutters>
          <simple-attribute attr="STRUCT" :val="npc.Stats.Structure" />
          <simple-attribute attr="ARMOR" :val="npc.Stats.Armor" />
          <simple-attribute attr="HP" :val="npc.Stats.HP" />
          <simple-attribute attr="REACTOR" :val="npc.Stats.Stress" />
          <simple-attribute
            attr="HEAT CAP."
            :val="npc.Stats.HeatCapacity"
            :color="npc.Class.Color"
          />
        </v-row>
        <v-divider class="my-2" />
        <v-row dense no-gutters>
          <simple-attribute attr="SPEED" :val="npc.Stats.Speed" />
          <simple-attribute attr="SAVE" :val="npc.Stats.Save" />
          <simple-attribute attr="EVADE" :val="npc.Stats.Evade" />
          <simple-attribute attr="E-DEF" :val="npc.Stats.EDefense" />
          <simple-attribute attr="SENSOR" :val="npc.Stats.Sensor" />
        </v-row>
        <v-divider class="my-2" />
        <v-row dense no-gutters>
          <simple-attribute
            attr="ACTIVATIONS"
            :val="npc.Stats.Activations"
            :color="npc.Class.Color"
          />
          <simple-attribute attr="SIZE" :val="npc.Stats.Size" />
        </v-row>
      </v-col>
      <v-divider vertical />
      <v-col>
        <div>
          <v-icon v-if="npc.Tier === 'custom'" size="40" :color="npc.Class.Color">
            mdi-star-circle-outline
          </v-icon>
          <v-icon v-else size="40" :color="npc.Class.Color">cci-rank-{{ npc.Tier }}</v-icon>
          <div v-if="npc.Tier === 'custom'" class="overline mt-n1">CUSTOM</div>
          <div v-else class="overline mt-n1">TIER {{ npc.Tier }}</div>
        </div>
        <v-divider class="my-1" />
        <div>
          <v-icon size="40" :color="npc.Class.Color">{{ npc.Class.RoleIcon }}</v-icon>
          <div class="overline mt-n1">{{ npc.Class.Role }}</div>
        </div>
        <v-divider class="my-1" />
        <cc-tooltip
          title="Power Rating"
          content="The Power Rating is an attempt to calculate the relative strength of an NPC (or encounters’ worth of NPCs) based on tier and applied templates, compared to mission’s Pilot and their current level. It should, generally, produce results more or less in line with the Balancing Combat section on pp. 283 of the LANCER Core Book.<br> That said, this is an experimental feature that is still very heavily in development, and does not (yet) always produce reliable results. Moreover, this tool doesn’t consider NPC or player team composition, synergies, strengths, and weaknesses. Nor does this tool consider map layout, mission objectives, or reinforcement schedules.<br>While we will continue to work on this tool to produce more accurate, actionable results, please use it only as a general indicator of relative NPC strength."
        >
          <div>
            <b class="caption">POWER RATING</b>
            <br />
            <span class="heading h2 accent--text">
              {{ npc.Power.toString().padStart(4, '0') }}
            </span>
          </div>
        </cc-tooltip>
      </v-col>
      <v-divider vertical />
      <v-col cols="3">
        <v-img v-if="npc.Image" :key="npc.Image" :src="npc.Image" aspect-ratio="1" />
      </v-col>
    </v-row>
    <v-row dense no-gutters class="my-2">
      <v-col cols="2"><v-divider class="mt-3" /></v-col>
      <span class="heading h3 accent--text px-2">FEATURES</span>
      <v-col><v-divider class="mt-3" /></v-col>
    </v-row>
    <v-row dense class="mr-2 mt-n1 ml-2">
      <v-col v-for="(item, j) in npc.Items" :key="`${npc.ID}_${item.Name}_${j}`" cols="auto">
        <cc-dialog no-confirm small-btn :color="item.Feature.Color" large>
          <span slot="button" class="white--text" style="width: 100%">
            <v-icon left dark>{{ item.Feature.Icon }}</v-icon>
            {{ item.Name }}
          </span>

          <span slot="title">
            <v-icon left large dark>{{ item.Feature.Icon }}</v-icon>
            {{ item.Name }}
          </span>
          <v-chip slot="title-items" color="white" class="stat-text mt-4 mr-6" outlined label>
            {{ item.Feature.FeatureType }}
          </v-chip>

          <cc-item-card :item="item.Feature">
            <p slot="statblock" v-html="item.Description" />
          </cc-item-card>
        </cc-dialog>
      </v-col>
    </v-row>
    <slot />
  </cc-titled-panel>
</template>

<script lang="ts">
import Vue from 'vue'
import SimpleAttribute from './SimpleAttribute.vue'

export default Vue.extend({
  name: 'npc-panel',
  components: { SimpleAttribute },
  props: {
    npc: {
      type: Object,
      required: true,
    },
    sideSelect: {
      type: Boolean,
    },
  },
})
</script>
