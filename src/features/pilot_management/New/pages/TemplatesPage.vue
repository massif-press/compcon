<template>
  <stepper-content :complete="selectionComplete"
    exit="../pilot_management"
    back
    mandatory
    @back="$emit('back')"
    @complete="setTemplate()">
    <cc-title offset>{{ $t('pm.new.newPilotRegistration') }}</cc-title>
    <div class="heading h2">
      {{ $t('pm.new.uadIDENTService') }}
      <cc-slashes />
      &nbsp;{{ $t('pm.new.prmALTQUICKACCESSSELECTION') }}
    </div>
    <v-row density="compact"
      justify="start">
      <v-col>
        <p class="flavor-text"
          style="font-size: 14px">
          {{ $t('pm.new.perThe5017PRMALTAct') }}
        </p>
        <v-alert color="accent"
          variant="outlined"
          density="compact"
          class="mt-2"
          tile>
          <div class="text-center text-stark">
            {{ $t('pm.new.selectingATemplateWillCompleteThe') }}
            <v-icon color="accent">mdi-circle-edit-outline</v-icon>
            {{ $t('pm.new.icon') }}
          </div>
        </v-alert>
      </v-col>
      <v-col cols="12"
        md="4">
        <b class="heading h3 text-accent">{{ $t('pm.new.mechARTCOURTESYOF') }}</b>
        <v-img target="_blank"
          href="https://www.retrogrademinis.com/"
          src="/public/retrograde_logo.webp"
          class="img-select"
          max-height="131px"
          max-width="478px"
          contain />
      </v-col>
    </v-row>
    <div class="my-4">
      <template-item v-for="t in templates"
        :key="t.name"
        :template="t"
        :isSelected="selected && t.name === selected.name"
        @select="selected = t" />
    </div>
  </stepper-content>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import StepperContent from '../../_components/StepperContent.vue';
import TemplateItem from '../components/TemplateItem.vue';
import { getImagePath, ImageTag } from '@/io/ImageManagement';
import { CompendiumStore } from '@/stores';
import Templates from '../pregens.json';
import { CompendiumItem } from '@/classes/CompendiumItem'
import MechSkills from '@/classes/components/mechskills/MechSkills'
import { Mech } from '@/classes/mech/Mech'
import { Pilot } from '@/classes/pilot/Pilot'
import { Frame } from '@/classes/mech/components/frame/Frame'
import { mechname } from '@/io/Generators';

defineOptions({ name: 'templates-page' })

const props = defineProps<{
  pilot: Pilot
}>()

const emit = defineEmits<{
  'back': []
  'next': []
}>()

const selected = ref(null as any)

const templates = computed(() => {
      return Templates;
    })
const retrogradeLogo = computed(() => {
      return getImagePath(ImageTag.Misc, 'retrograde_logo.webp');
    })
const selectionComplete = computed(() => {
      return selected.value !== null;
    })

function getItem(type: string, id: string) {
      const compendium = CompendiumStore();
      return CompendiumItem.Clone(compendium.referenceByID(type, id) as CompendiumItem);
    }
async function setTemplate() {
      const t = selected.value.build;
      props.pilot.MechSkillsController.MechSkills = MechSkills.Deserialize(t.mechSkills);
      props.pilot.SkillsController.ClearSkills();
      t.skills.forEach((s) => {
        props.pilot.SkillsController.AddSkill(getItem('Skills', s));
      });
      props.pilot.TalentsController.ClearTalents();
      t.talents.forEach((t) => {
        props.pilot.TalentsController.AddTalent(getItem('Talents', t));
      });

      props.pilot.Loadout.Armor = [getItem('PilotGear', t.gear.armor)];
      props.pilot.Loadout.Weapons = t.gear.weapons.map((x) => getItem('PilotGear', x));
      props.pilot.Loadout.Gear = t.gear.gear.map((x) => getItem('PilotGear', x));

      const m = t.mech;
      const mech = new Mech(
        getItem('Frames', 'mf_standard_pattern_i_everest') as Frame,
        props.pilot as Pilot
      );

      mech.Name = await mechname();
      mech.MechLoadoutController.ActiveLoadout.Systems = m.systems.map((x) =>
        getItem('MechSystems', x)
      );

      (mech.MechLoadoutController.ActiveLoadout.AllMounts() as any)
        .find((m) => m.Type === 'Main')
        .Slots[0].EquipWeapon(getItem('MechWeapons', m.mounts[0].slots[0]));
      (mech.MechLoadoutController.ActiveLoadout.AllMounts() as any)
        .find((m) => m.Type === 'Flex')
        .Slots[0].EquipWeapon(getItem('MechWeapons', m.mounts[1].slots[0]));
      (mech.MechLoadoutController.ActiveLoadout.AllMounts() as any)
        .find((m) => m.Type === 'Flex')
        .Slots[1].EquipWeapon(getItem('MechWeapons', m.mounts[1].slots[1]));
      (mech.MechLoadoutController.ActiveLoadout.AllMounts() as any)
        .find((m) => m.Type === 'Heavy')
        .Slots[0].EquipWeapon(getItem('MechWeapons', m.mounts[2].slots[0]));

      mech.PortraitController.SetCloudImage(selected.value.image);

      props.pilot.Mechs.forEach((m) => {
        props.pilot.RemoveMech(m);
      });
      props.pilot.AddMech(mech);

      props.pilot.isTemplate = true;

      emit('next');
    }
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
