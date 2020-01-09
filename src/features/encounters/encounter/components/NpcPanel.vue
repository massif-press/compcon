<template>
  <cc-titled-panel
    :icon="npc.Class.RoleIcon"
    :title="
      `${npc.Name}  —  ${typeof npc.Tier === 'number' ? `T${npc.Tier}` : `Custom`} ${
        npc.Class.Name
      } ${npc.Templates.map(t => t.Name).join(' ')} ${npc.Tag}`
    "
    :color="npc.Class.Color"
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

    <v-row dense class="text-center">
      <v-col cols="10">
        <v-row dense no-gutters>
          <editable-attribute attr="HULL" :val="npc.Stats.Hull" :color="npc.Class.Color" />
          <editable-attribute attr="AGI" :val="npc.Stats.Agility" :color="npc.Class.Color" />
          <editable-attribute attr="SYS" :val="npc.Stats.Systems" :color="npc.Class.Color" />
          <editable-attribute attr="ENG" :val="npc.Stats.Engineering" :color="npc.Class.Color" />
        </v-row>
        <v-divider class="my-2" />
        <v-row dense no-gutters>
          <editable-attribute attr="STRUCT." :val="npc.Stats.Structure" :color="npc.Class.Color" />
          <editable-attribute attr="ARMOR" :val="npc.Stats.Armor" :color="npc.Class.Color" />
          <editable-attribute attr="HP" :val="npc.Stats.HP" :color="npc.Class.Color" />
          <editable-attribute attr="REACTOR" :val="npc.Stats.Stress" :color="npc.Class.Color" />
          <editable-attribute
            attr="HEAT CAP."
            :val="npc.Stats.HeatCapacity"
            :color="npc.Class.Color"
          />
        </v-row>
        <v-row dense no-gutters>
          <editable-attribute attr="SPEED" :val="npc.Stats.Speed" :color="npc.Class.Color" />
          <editable-attribute attr="SAVE" :val="npc.Stats.Save" :color="npc.Class.Color" />
          <editable-attribute attr="EVADE" :val="npc.Stats.Evade" :color="npc.Class.Color" />
          <editable-attribute attr="E-DEF." :val="npc.Stats.EDefense" :color="npc.Class.Color" />
          <editable-attribute attr="SENSOR" :val="npc.Stats.Sensor" :color="npc.Class.Color" />
        </v-row>
        <v-divider class="my-2" />
        <v-row dense no-gutters>
          <editable-attribute
            attr="ACTIVATIONS"
            :val="npc.Stats.Activations"
            :color="npc.Class.Color"
          />
          <editable-attribute attr="SIZE" :val="npc.Stats.Size" :color="npc.Class.Color" />
        </v-row>
      </v-col>
      <v-col>
        <div>
          <v-icon v-if="npc.Tier === 'custom'" size="60" :color="npc.Class.Color">
            mdi-star-circle-outline
          </v-icon>
          <v-icon v-else size="60" :color="npc.Class.Color">cci-rank-{{ npc.Tier }}</v-icon>
          <div v-if="npc.Tier === 'custom'" class="overline mt-n1">CUSTOM</div>
          <div v-else class="overline mt-n1">TIER {{ npc.Tier }}</div>
        </div>
        <v-divider class="my-2" />
        <div>
          <v-icon size="60" :color="npc.Class.Color">{{ npc.Class.RoleIcon }}</v-icon>
          <div class="overline mt-n1">{{ npc.Class.Role }}</div>
        </div>
        <v-divider class="my-2" />
        <div>
          <b class="caption">POWER RATING</b>
          <br />
          <span class="heading h2 primary--text">
            {{ npc.Power.toString().padStart(4, '0') }}
          </span>
        </div>
      </v-col>
    </v-row>
    <v-row dense no-gutters class="my-2">
      <v-col cols="2"><v-divider class="mt-3" /></v-col>
      <span class="heading h3 primary--text px-2">FEATURES</span>
      <v-col><v-divider class="mt-3" /></v-col>
    </v-row>
    <v-row dense class="mr-2 mt-n1 ml-2">
      <v-col v-for="(item, j) in npc.Items" :key="`${npc.ID}_${item.Name}_${j}`" cols="auto">
        <cc-dialog no-confirm small-btn :color="$_.kebabCase(item.Feature.ItemType)" large>
          <span slot="button" class="white--text" style="width: 100%">
            {{ item.Name }}
          </span>

          <span slot="title">
            <v-icon left large dark>cci-{{ $_.kebabCase(item.ItemType) }}</v-icon>
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
import EditableAttribute from '../../npc/components/EditableAttribute.vue'

export default Vue.extend({
  name: 'npc-panel',
  components: { EditableAttribute },
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
