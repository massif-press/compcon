<template>
  <cc-stepper-content
    :complete="selected !== null"
    exit="pilot_management"
    @back="$emit('back')"
    @complete="setTemplate()"
  >
    <cc-title large>New Pilot Registration&emsp;</cc-title>
    <h2 class="heading">
      UAD IDENT Service
      <cc-slashes />
      &nbsp;PRM-ALT QUICK ACCESS SELECTION
    </h2>
    <v-row dense justify="start" align="center">
      <v-col>
        <span class="flavor-text" style="font-size: 14px">
          Per the 5017 PRM-ALT Act, the Union Administrative Department's IDENT registration service
          provides a Quick Access Selection module, created and curated by UAD Armored Cavalary
          Support. The UAD-ACS NHP staff have generated a selection of Combat Doctrine Templates
          based on the results of your OHM Health Examination//CR-2 Brain Activity Scan. Each of
          these templates will populate the remainder of your IDENT Combat Registration with a
          tailored set of combat-role-optimal responses.
        </span>
        <br />
        <v-alert dense outlined color="accent" class="mt-1">
          <div class="text-center stark--text">
            Selecting a template will complete the New Pilot interface and start your Pilot with a
            curated set of skills and talents and an outfitted GMS EVEREST mech, tailored to the
            combat role selected below. All of these selections may be edited at any time through
            the Pilot and Mech Sheet loadout sections, as well as section headings with the
            <v-icon>mdi-circle-edit-outline</v-icon>
            icon
          </div>
        </v-alert>
      </v-col>
      <v-col cols="4">
        <b class="caption accent--text mt-n2">
          MECH ART COURTESY OF
        </b>
        <v-img
          v-extlink="'https://www.retrogrademinis.com/'"
          :src="retrogradeLogo"
          class="img-select"
          max-height="131px"
          max-width="478px"
          contain
        />
      </v-col>
    </v-row>
    <v-row class="mx-6">
      <template-item
        v-for="t in templates"
        :key="t.name"
        :template="t"
        :is-selected="t === selected"
        @select="selected = t"
      />
    </v-row>
  </cc-stepper-content>
</template>

<script lang="ts">
import Vue from 'vue'
import { getImagePath, ImageTag } from '@/io/ImageManagement'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import TemplateItem from './components/TemplateItem.vue'
import Templates from '../pregens.json'
import { MechSkills, Mech } from '@/class'
import { mechname } from '@/io/Generators'

export default Vue.extend({
  name: 'templates-page',
  components: { TemplateItem },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    selected: null,
  }),
  computed: {
    templates() {
      return Templates
    },
    retrogradeLogo() {
      return getImagePath(ImageTag.Misc, 'retrograde_logo.png')
    },
  },
  methods: {
    item(type: string, id: string) {
      const compendium = getModule(CompendiumStore, this.$store)
      return compendium.referenceByID(type, id)
    },
    setTemplate() {
      const t = this.selected.build
      this.pilot.MechSkills = MechSkills.Deserialize(t.mechSkills)
      this.pilot.ClearSkills()
      t.skills.forEach(s => {
        this.pilot.AddSkill(this.item('Skills', s))
      })
      this.pilot.ClearTalents()
      t.talents.forEach(t => {
        this.pilot.AddTalent(this.item('Talents', t))
      })
      this.pilot.Loadout.Armor = [this.item('PilotGear', t.gear.armor)]
      this.pilot.Loadout.Weapons = t.gear.weapons.map(x => this.item('PilotGear', x))
      this.pilot.Loadout.Gear = t.gear.gear.map(x => this.item('PilotGear', x))

      const m = t.mech
      const mech = new Mech(this.item('Frames', 'mf_standard_pattern_i_everest'), this.pilot)

      mech.Name = mechname()
      mech.ActiveLoadout.Systems = m.systems.map(x => this.item('MechSystems', x))

      mech.ActiveLoadout.AllMounts()
        .find(m => m.Type === 'Main')
        .Slots[0].EquipWeapon(this.item('MechWeapons', m.mounts[0].slots[0]))
      mech.ActiveLoadout.AllMounts()
        .find(m => m.Type === 'Flex')
        .Slots[0].EquipWeapon(this.item('MechWeapons', m.mounts[1].slots[0]))
      mech.ActiveLoadout.AllMounts()
        .find(m => m.Type === 'Flex')
        .Slots[1].EquipWeapon(this.item('MechWeapons', m.mounts[1].slots[1]))
      mech.ActiveLoadout.AllMounts()
        .find(m => m.Type === 'Heavy')
        .Slots[0].EquipWeapon(this.item('MechWeapons', m.mounts[2].slots[0]))

      mech.SetLocalImage(this.selected.image)

      this.pilot.Mechs.forEach(m => {
        this.pilot.RemoveMech(m)
      })
      this.pilot.AddMech(mech)
      this.pilot.ActiveMech = mech

      this.$emit('next')
    },
  },
})
</script>

<style scoped>
.img-select {
  filter: saturate(0.6) brightness(80%);
  -webkit-filter: saturate(0.6) brightness(80%);
  transition: all cubic-bezier(0.165, 0.84, 0.44, 1) 0.2s;
}

.img-select:hover {
  cursor: pointer;
  filter: saturate(1) brightness(110%);
  -webkit-filter: saturate(1) brightness(110%);
}
</style>
