<template>
  <v-container fluid>
    <v-row v-if="!npc" align="center" justify="center" style="width: 100%; height: 100%;">
      <v-col cols="auto">
        <span class="heading h1 light-panel--text">no npc selected</span>
      </v-col>
    </v-row>
    <div v-else>
      <v-row dense class="mt-n6">
        <v-col cols="10">
          <div class="heading mech">
            <cc-short-string-editor large :placeholder="npc.Name" @set="npc.Name = $event">
              <span class="heading-block">
                {{ npc.Name }}
              </span>
            </cc-short-string-editor>
          </div>
          <div class="flavor-text mt-n6 ml-2">
            <cc-short-string-editor large :placeholder="npc.Subtitle" @set="npc.Subtitle = $event">
              <b v-if="npc.Subtitle" class="heading-block stark--text" v-html="npc.Subtitle" />
              <i v-else class="heading-block subtle--text" v-html="'Add GM Summary'" />
            </cc-short-string-editor>
          </div>
        </v-col>
        <v-col cols="auto" class="ml-auto text-center mt-1">
          <v-icon v-if="npc.Tier === 'custom'" size="60" :color="npc.Class.Color">
            mdi-star-circle-outline
          </v-icon>
          <v-icon v-else size="60" :color="npc.Class.Color">cci-rank-{{ npc.Tier }}</v-icon>
          <div v-if="npc.Tier === 'custom'" class="overline mt-n1">CUSTOM</div>
          <div v-else class="overline mt-n1">TIER {{ npc.Tier }}</div>
        </v-col>
        <v-col cols="auto" class="text-center mt-n4">
          <v-icon size="60" :color="npc.Class.Color">cci-role-{{ npc.Role }}</v-icon>
          <div class="overline mt-n1">{{ npc.Role }}</div>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <v-divider />
        </v-col>
        <v-col cols="auto" class="mt-n1">
          <span :class="`heading ${npc.Class.Color}--text`" style="font-size: 35px; line-height: 0">
            {{ npc.Class.Name }}
            <span v-if="npc.Templates">{{ npc.Templates.map(t => t.Name).join(' ') }}</span>
          </span>
        </v-col>
        <v-col>
          <v-divider />
        </v-col>
      </v-row>
      <v-row dense align="center">
        <v-col>
          <v-combobox
            v-model="npc.Labels"
            active-class="accent"
            outlined
            dense
            multiple
            background-color="stark-panel"
            label="User Labels"
            :items="labels"
          />
        </v-col>
        <v-col>
          <v-combobox
            v-model="npc.Tag"
            active-class="accent"
            background-color="stark-panel"
            outlined
            dense
            label="NPC Tag"
            :items="tags"
          />
        </v-col>
        <v-col>
          <v-combobox
            v-model="npc.Campaign"
            active-class="accent"
            background-color="stark-panel"
            outlined
            dense
            label="Campaign"
            :items="campaigns"
          />
        </v-col>
        <v-col cols="auto" class="ml-auto mt-n6">
          <v-btn x-small block outlined style="margin-bottom: 2px" @click="flavor_dialog = true">
            {{ npc.Class.Name }} Flavor
          </v-btn>
          <v-btn x-small block outlined @click="tactics_dialog = true">
            {{ npc.Class.Name }} Tactics
          </v-btn>
        </v-col>
      </v-row>
      <v-row dense align="center" class="mt-n2">
        <v-col cols="7">
          <v-btn-toggle v-model="npc.Tier" dense active-class="accent--text" class="mb-2">
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
              :val="npc.Stats.Hull"
              :color="npc.Class.Color"
              :editable="npc.IsCustomTier"
              @set="npc.Stats.Hull = $event"
            />
            <editable-attribute
              attr="AGI"
              :val="npc.Stats.Agility"
              :color="npc.Class.Color"
              :editable="npc.IsCustomTier"
              @set="npc.Stats.Agility = $event"
            />
            <editable-attribute
              attr="SYS"
              :val="npc.Stats.Systems"
              :color="npc.Class.Color"
              :editable="npc.IsCustomTier"
              @set="npc.Stats.Systems = $event"
            />
            <editable-attribute
              attr="ENG"
              :val="npc.Stats.Engineering"
              :color="npc.Class.Color"
              :editable="npc.IsCustomTier"
              @set="npc.Stats.Engineering = $event"
            />
          </v-row>
          <v-divider class="my-2" />
          <v-row dense no-gutters>
            <editable-attribute
              attr="STRUCT."
              :val="npc.Stats.Structure"
              :color="npc.Class.Color"
              :editable="npc.IsCustomTier"
              @set="npc.Stats.Structure = $event"
            />
            <editable-attribute
              attr="ARMOR"
              :val="npc.Stats.Armor"
              :color="npc.Class.Color"
              :editable="npc.IsCustomTier"
              @set="npc.Stats.Armor = $event"
            />
            <editable-attribute
              attr="HP"
              :val="npc.Stats.HP"
              :color="npc.Class.Color"
              :editable="npc.IsCustomTier"
              @set="npc.Stats.HP = $event"
            />
            <editable-attribute
              attr="REACTOR"
              :val="npc.Stats.Stress"
              :color="npc.Class.Color"
              :editable="npc.IsCustomTier"
              @set="npc.Stats.Stress = $event"
            />
            <editable-attribute
              v-if="!npc.IsBiological"
              attr="HEAT CAP."
              :val="npc.Stats.HeatCapacity"
              :color="npc.Class.Color"
              :editable="npc.IsCustomTier"
              @set="npc.Stats.HeatCapacity = $event"
            />
          </v-row>
          <v-row dense no-gutters>
            <editable-attribute
              attr="SPEED"
              :val="npc.Stats.Speed"
              :color="npc.Class.Color"
              :editable="npc.IsCustomTier"
              @set="npc.Stats.Speed = $event"
            />
            <editable-attribute
              attr="SAVE"
              :val="npc.Stats.Save"
              :color="npc.Class.Color"
              :editable="npc.IsCustomTier"
              @set="npc.Stats.Save = $event"
            />
            <editable-attribute
              attr="EVADE"
              :val="npc.Stats.Evade"
              :color="npc.Class.Color"
              :editable="npc.IsCustomTier"
              @set="npc.Stats.Evade = $event"
            />
            <editable-attribute
              attr="E-DEF."
              :val="npc.Stats.EDefense"
              :color="npc.Class.Color"
              :editable="npc.IsCustomTier"
              @set="npc.Stats.EDefense = $event"
            />
            <editable-attribute
              attr="SENSOR"
              :val="npc.Stats.Sensor"
              :color="npc.Class.Color"
              :editable="npc.IsCustomTier"
              @set="npc.Stats.Sensor = $event"
            />
          </v-row>
          <v-divider class="my-2" />
          <v-row dense no-gutters>
            <editable-attribute
              attr="ACTIVATIONS"
              :val="npc.Stats.Activations"
              :color="npc.Class.Color"
              :editable="npc.IsCustomTier"
              @set="npc.Stats.Activations = $event"
            />
            <size-attribute
              :stats="npc.Stats"
              :color="npc.Class.Color"
              :editable="npc.IsCustomTier"
              selectable
            />
          </v-row>
          <v-row dense align="start" class="mt-n2">
            <v-col cols="auto" class="ml-auto">
              <cc-tooltip
                title="Power Rating"
                content="The Power Rating is an attempt to calculate the relative strength of an NPC (or encounters’ worth of NPCs) based on tier and applied templates, compared to mission’s Pilot and their current level. It should, generally, produce results more or less in line with the Balancing Combat section on pp. 283 of the LANCER Core Book.<br> That said, this is an experimental feature that is still very heavily in development, and does not (yet) always produce reliable results. Moreover, this tool doesn’t consider NPC or player team composition, synergies, strengths, and weaknesses. Nor does this tool consider map layout, mission objectives, or reinforcement schedules.<br>While we will continue to work on this tool to produce more accurate, actionable results, please use it only as a general indicator of relative NPC strength."
              >
                <i class="flavor-text">
                  Calculated Power Rating: {{ npc.Power.toString().padStart(4, '0') }}
                </i>
              </cc-tooltip>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="5">
          <v-card flat outlined>
            <v-card-text class="pa-1">
              <v-img v-if="npc.Image" :key="npc.Image" :src="npc.Image" aspect-ratio="1" />
              <v-btn outlined small block color="secondary" @click="$refs.imageSelector.open()">
                <span v-if="!npc.Image">
                  <v-icon left>mdi-plus</v-icon>
                  Add NPC Image
                </span>
                <span v-else>
                  <v-icon left>mdi-circle-edit-outline</v-icon>
                  Edit NPC Image
                </span>
              </v-btn>
              <cc-image-selector-web
                v-if="$platform === 'web'"
                ref="imageSelector"
                :item="npc"
                type="npc"
              />
              <cc-image-selector v-else ref="imageSelector" :item="npc" type="npc" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <cc-title small :color="npc.Class.Color">
        Template{{ npc.Templates.length > 1 ? 's' : '' }}
      </cc-title>
      <v-row dense align="center" class="mb-2">
        <v-col v-for="t in npc.Templates" :key="t.Name" cols="auto">
          <v-dialog width="50%">
            <template v-slot:activator="{ on }">
              <v-btn block outlined class="d-inline" v-on="on">
                {{ t.Name }}
              </v-btn>
            </template>
            <cc-titled-panel :title="t.Name">
              <p class="text--text" v-html="t.Description" />
              <v-divider class="my-2" />
              <v-btn block outlined color="error" class="mb-2" @click="npc.RemoveTemplate(t)">
                REMOVE TEMPLATE
              </v-btn>
            </cc-titled-panel>
          </v-dialog>
        </v-col>
        <v-col cols="auto">
          <v-btn small color="accent" tile outlined @click="$refs.templateDialog.show()">
            <v-icon left>mdi-plus</v-icon>
            Add Template
          </v-btn>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="auto">
          <cc-title small :color="npc.Class.Color">
            Features
          </cc-title>
        </v-col>
        <v-col cols="auto" class="ml-auto">
          <v-btn-toggle v-model="profile.NpcView" mandatory>
            <v-btn small icon value="list">
              <v-icon color="accent">mdi-view-list</v-icon>
            </v-btn>
            <v-btn small icon value="chips">
              <v-icon color="accent">mdi-view-comfy</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
      <v-row v-if="profile.NpcView === 'list'" dense>
        <v-col v-for="(i, idx) in npc.Items" :key="i.Feature.ID + idx" md="12" lg="12" xl="6">
          <cc-npc-item-card
            :item="i"
            @remove-feature="npc.RemoveFeature(i.Feature)"
            @recalc="npc.RecalcBonuses()"
          />
        </v-col>
      </v-row>
      <v-row v-else-if="profile.NpcView === 'chips'" dense>
        <v-chip-group column>
          <cc-npc-item-chip
            v-for="(i, idx) in npc.Items"
            :key="i.Feature.ID + idx"
            :item="i"
            @remove-feature="npc.RemoveFeature(i.Feature)"
            @recalc="npc.RecalcBonuses()"
          />
        </v-chip-group>
      </v-row>
      <v-row dense>
        <v-col cols="auto">
          <v-btn color="accent" tile outlined @click="$refs.featureDialog.show()">
            <v-icon left>mdi-plus</v-icon>
            Add Feature
            <span v-if="npc.AvailableFeatures.length">
              ({{ npc.AvailableFeatures.length }} Available)
            </span>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider class="my-2" />
      <cc-title small :color="npc.Class.Color">
        NPC Notes
        <cc-text-editor label="Edit NPC Notes" :original="npc.Note" @save="npc.Note = $event" />
      </cc-title>
      <p v-html="npc.Note" />
      <v-dialog v-model="flavor_dialog" width="60vw">
        <v-card tile>
          <v-card-title :class="`heading h1 white--text ${npc.Class.Color}`">
            {{ npc.Class.Name }}//Flavor
          </v-card-title>
          <v-card-text>
            <p class="ma-0 pt-2 flavor-text text--text" v-html="npc.Class.Flavor" />
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="tactics_dialog" width="60vw">
        <v-card tile>
          <v-card-title :class="`heading h1 white--text ${npc.Class.Color}`">
            {{ npc.Class.Name }}//Tactics
          </v-card-title>
          <v-card-text>
            <p class="ma-0 pt-2 flavor-text text--text" v-html="npc.Class.Tactics" />
          </v-card-text>
        </v-card>
      </v-dialog>
      <cc-solo-dialog ref="featureDialog" no-confirm title="SELECT FEATURES" fullscreen no-pad>
        <feature-selector :npc="npc" @equip="equip($event)" />
      </cc-solo-dialog>
      <cc-solo-dialog ref="templateDialog" no-confirm title="SELECT TEMPLATE" fullscreen no-pad>
        <template-selector :npc="npc" @select="assign($event)" />
      </cc-solo-dialog>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import EditableAttribute from './components/EditableAttribute.vue'
import SizeAttribute from './components/SizeAttribute.vue'
import FeatureSelector from './components/FeatureSelector.vue'
import TemplateSelector from './components/TemplateSelector.vue'
import { NpcFeature, NpcTemplate } from '@/class'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore, NpcStore } from '@/store'
import { UserProfile } from '@/io/User'

export default Vue.extend({
  name: 'npc-card',
  components: {
    EditableAttribute,
    FeatureSelector,
    TemplateSelector,
    SizeAttribute,
  },
  props: {
    npc: {
      type: Object,
      required: false,
      default: null,
    },
  },
  // TODO: put these in data
  data: () => ({
    flavor_dialog: false,
    tactics_dialog: false,
    tags: ['Mech', 'Vehicle', 'Ship', 'Biological', 'Squad'],
  }),
  computed: {
    labels() {
      const store = getModule(NpcStore, this.$store)
      return store.Npcs.flatMap(x => x.Labels).filter(x => x)
    },
    campaigns() {
      const store = getModule(NpcStore, this.$store)
      return store.Npcs.map(x => x.Campaign).filter(x => x)
    },
    profile(): UserProfile {
      const store = getModule(CompendiumStore, this.$store)
      return store.UserProfile
    },
  },
  methods: {
    equip(feat: NpcFeature) {
      this.npc.AddFeature(feat)
      this.$refs.featureDialog.hide()
    },
    assign(temp: NpcTemplate) {
      this.npc.AddTemplate(temp)
      this.$refs.templateDialog.hide()
    },
  },
})
</script>

<style>
.heading-block {
  display: inline-block;
  max-width: 90%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
