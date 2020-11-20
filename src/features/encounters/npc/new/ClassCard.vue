<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="auto" class="mt-4">
        <span class="heading mech" style="line-height: 0">
          {{ npcc.Name }}
        </span>
      </v-col>
      <v-col cols="auto" class="ml-auto text-center mt-n4">
        <v-icon size="60" :color="npcc.Color">{{ npcc.RoleIcon }}</v-icon>
        <div class="overline mt-n1">{{ npcc.Role }}</div>
      </v-col>
    </v-row>
    <p class="flavor-text panel pa-2 stark--text" v-html="npcc.Flavor" />
    <span class="heading h3 accent--text">Tactics</span>
    <p class="body-1" v-html="npcc.Tactics" />
    <v-divider class="mb-3" />
    <v-row dense align="center">
      <v-col>
        <v-btn-toggle v-model="tierPreview" dense active-class="accent--text" class="mb-2">
          <v-btn :value="1">
            <v-icon left>cci-rank-1</v-icon>
            Tier 1
          </v-btn>
          <v-btn :value="2">
            <v-icon left>cci-rank-2</v-icon>
            Tier 2
          </v-btn>
          <v-btn :value="3">
            <v-icon left>cci-rank-3</v-icon>
            Tier 3
          </v-btn>
        </v-btn-toggle>
        <v-row dense no-gutters>
          <editable-attribute attr="HULL" :val="npcc.Stats.Hull(tierPreview)" :color="npcc.Color" />
          <editable-attribute
            attr="AGI"
            :val="npcc.Stats.Agility(tierPreview)"
            :color="npcc.Color"
          />
          <editable-attribute
            attr="SYS"
            :val="npcc.Stats.Systems(tierPreview)"
            :color="npcc.Color"
          />
          <editable-attribute
            attr="ENG"
            :val="npcc.Stats.Engineering(tierPreview)"
            :color="npcc.Color"
          />
        </v-row>
        <v-divider class="my-2" />
        <v-row dense no-gutters>
          <editable-attribute
            attr="STRUCTURE"
            :val="npcc.Stats.Structure(tierPreview)"
            :color="npcc.Color"
          />
          <editable-attribute
            attr="ARMOR"
            :val="npcc.Stats.Armor(tierPreview)"
            :color="npcc.Color"
          />
          <editable-attribute attr="HP" :val="npcc.Stats.HP(tierPreview)" :color="npcc.Color" />
          <editable-attribute
            attr="REACTOR"
            :val="npcc.Stats.Stress(tierPreview)"
            :color="npcc.Color"
          />
          <editable-attribute
            v-if="npcc.Role.toLowerCase() !== 'biological'"
            attr="HEAT CAPACITY"
            :val="npcc.Stats.HeatCapacity(tierPreview)"
            :color="npcc.Color"
          />
        </v-row>
        <v-row dense no-gutters>
          <editable-attribute
            attr="SPEED"
            :val="npcc.Stats.Speed(tierPreview)"
            :color="npcc.Color"
          />
          <editable-attribute attr="SAVE" :val="npcc.Stats.Save(tierPreview)" :color="npcc.Color" />
          <editable-attribute
            attr="EVADE"
            :val="npcc.Stats.Evade(tierPreview)"
            :color="npcc.Color"
          />
          <editable-attribute
            attr="E-DEFENSE"
            :val="npcc.Stats.EDefense(tierPreview)"
            :color="npcc.Color"
          />
          <editable-attribute
            attr="SENSOR"
            :val="npcc.Stats.Sensor(tierPreview)"
            :color="npcc.Color"
          />
        </v-row>
        <v-divider class="my-2" />
        <v-row dense no-gutters>
          <editable-attribute attr="ACTIVATIONS" :val="1" :color="npcc.Color" />
          <editable-attribute
            attr="SIZE"
            :val="
              npcc.Stats.Sizes(tierPreview)
                .join(' or ')
                .replace('0.5', '½')
            "
            :color="npcc.Color"
          />
        </v-row>
      </v-col>
    </v-row>
    <cc-title small :color="npcc.Color" class="mt-2">
      Base Features
    </cc-title>
    <v-row dense>
      <v-col v-for="f in npcc.BaseFeatures" :key="f.ID" cols="12">
        <cc-npc-feature-card :feature="f" :tier="tierPreview" />
      </v-col>
    </v-row>
    <cc-title v-if="npcc.OptionalFeatures.length" small :color="npcc.Color" class="mt-2">
      Optional Features
    </cc-title>
    <v-row dense>
      <v-col v-for="f in npcc.OptionalFeatures" :key="f.ID" cols="12">
        <cc-npc-feature-card :feature="f" :tier="tierPreview" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import EditableAttribute from '../components/EditableAttribute.vue'

export default Vue.extend({
  name: 'npc-class-card',
  components: { EditableAttribute },
  props: {
    npcc: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    tierPreview: 1,
  }),
})
</script>
