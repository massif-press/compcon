<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="auto" class="mt-4">
        <span class="heading mech" style="line-height: 0">
          <cc-short-string-editor @set="npc.Name = $event">
            {{ npc.Name }}
          </cc-short-string-editor>
        </span>
      </v-col>
      <v-col cols="auto" class="ml-auto text-center mt-n4">
        <v-icon v-if="npc.Tier === 'custom'" size="60" :color="`role--${npc.Role}`">
          mdi-star-circle-outline
        </v-icon>
        <v-icon v-else size="60" :color="`role--${npc.Role}`">cci-rank-{{ npc.Tier }}</v-icon>
        <div v-if="npc.Tier === 'custom'" class="overline mt-n1">CUSTOM</div>
        <div v-else class="overline mt-n1">TIER {{ npc.Tier }}</div>
      </v-col>
      <v-col cols="auto" class="text-center mt-n4">
        <v-icon size="60" :color="`role--${npc.Role}`">cci-role-{{ npc.Role }}</v-icon>
        <div class="overline mt-n1">{{ npc.Role }}</div>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <v-divider />
      </v-col>
      <v-col cols="auto" class="mt-n1">
        <span :class="`heading role--${npc.Role}--text`" style="font-size: 35px; line-height: 0">
          {{ npc.Class }}
          <span v-if="npc.Templates">{{ npc.Templates.join(' ') }}</span>
        </span>
      </v-col>
      <v-col>
        <v-divider />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="7">
        <v-btn-toggle v-model="npc.Tier" dense active-class="primary">
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
          <v-btn value="custom">
            <v-icon left>mdi-star-circle-outline</v-icon>
            Custom
          </v-btn>
        </v-btn-toggle>
        <v-row dense no-gutters>
          <editable-attribute
            attr="HULL"
            :val="6"
            :color="`role--${npc.Role}`"
            :editable="npc.Tier === 'custom'"
          />
          <editable-attribute
            attr="AGILITY"
            :val="6"
            :color="`role--${npc.Role}`"
            :editable="npc.Tier === 'custom'"
          />
          <editable-attribute
            attr="SYSTEMS"
            :val="6"
            :color="`role--${npc.Role}`"
            :editable="npc.Tier === 'custom'"
          />
          <editable-attribute
            attr="ENGINEERING"
            :val="6"
            :color="`role--${npc.Role}`"
            :editable="npc.Tier === 'custom'"
          />
        </v-row>
        <v-divider class="my-2" />
        <v-row dense no-gutters>
          <editable-attribute
            attr="STRUCT."
            :val="1"
            :color="`role--${npc.Role}`"
            :editable="npc.Tier === 'custom'"
          />
          <editable-attribute
            attr="ARMOR"
            :val="1"
            :color="`role--${npc.Role}`"
            :editable="npc.Tier === 'custom'"
          />
          <editable-attribute
            attr="HP"
            :val="1"
            :color="`role--${npc.Role}`"
            :editable="npc.Tier === 'custom'"
          />
          <editable-attribute
            attr="REACTOR"
            :val="1"
            :color="`role--${npc.Role}`"
            :editable="npc.Tier === 'custom'"
          />
          <editable-attribute
            attr="HEAT CAP"
            :val="1"
            :color="`role--${npc.Role}`"
            :editable="npc.Tier === 'custom'"
          />
        </v-row>
        <v-row dense no-gutters>
          <editable-attribute
            attr="SPEED"
            :val="1"
            :color="`role--${npc.Role}`"
            :editable="npc.Tier === 'custom'"
          />
          <editable-attribute
            attr="SAVE"
            :val="1"
            :color="`role--${npc.Role}`"
            :editable="npc.Tier === 'custom'"
          />
          <editable-attribute
            attr="EVADE"
            :val="1"
            :color="`role--${npc.Role}`"
            :editable="npc.Tier === 'custom'"
          />
          <editable-attribute
            attr="E-DEF."
            :val="1"
            :color="`role--${npc.Role}`"
            :editable="npc.Tier === 'custom'"
          />
          <editable-attribute
            attr="SENSOR"
            :val="1"
            :color="`role--${npc.Role}`"
            :editable="npc.Tier === 'custom'"
          />
        </v-row>
        <v-divider class="my-2" />
        <v-row dense no-gutters>
          <editable-attribute
            attr="ACTIVATIONS"
            :val="1"
            :color="`role--${npc.Role}`"
            :editable="npc.Tier === 'custom'"
          />
          <editable-attribute
            attr="SIZE"
            :val="1"
            :color="`role--${npc.Role}`"
            :editable="npc.Tier === 'custom'"
          />
        </v-row>
        <v-row dense align="start" class="mt-n2">
          <v-col cols="auto" class="ml-auto">
            <i class="flavor-text">Calculated Power Rating: 0000</i>
          </v-col>
        </v-row>

        template
        <br />
        template features
      </v-col>
      <v-col>
        <v-card flat outlined>
          <v-card-text class="pa-1">
            <v-img src="https://via.placeholder.com/250x300" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row dense>
      base systems / template features
    </v-row>
    <v-row dense>
      optional systems
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import EditableAttribute from './components/EditableAttribute.vue'

export default Vue.extend({
  name: 'npc-card',
  components: { EditableAttribute },
  props: {
    npc: {
      type: Object,
      required: true,
    },
  },
})
</script>
