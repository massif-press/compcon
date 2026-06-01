<template>
  <stepper-content :complete="canContinue"
    :mandatory="context === 'new'"
    :exit="context === 'new' ? '../pilot_management' : `/pilot/${pilot.ID}`"
    back
    @back="$emit('back')"
    @complete="$emit('next')">
    <cc-title offset>{{ context === 'new' ? 'Pilot Talents' : 'Unlock License' }}&emsp;</cc-title>

    <div v-if="context === 'new'"
      class="heading h2">
      UAD IDENT Service <cc-slashes /> &nbsp;RM-4c (S-1) Licensing Authorization Supplemental
    </div>
    <div v-else
      class="heading h2">
      MV-2 License Acquisition Request <cc-slashes /> &nbsp;MV-2//d Licensor/Licensee Transmit Record
    </div>

    <p v-if="context === 'new'"
      class="flavor-text"
      style="font-size: 14px">
      The RM-4α Supplemental I (Licensing Authorization) registers an individual pilot's Frame Print
      and Operation (FP/O) Licenses under the Union Licensing Authority.
    </p>
    <p v-else
      class="flavor-text"
      style="font-size: 14px">
      The MV-2 Licensor/Licensee Transmit Record registers the transmission and receipt of a
      UN-recognized FRAME License consisting of, but not limited to, Equipment Print Templates not
      exceeding 1.5EB, FRAME Print Templates not exceeding 3.75EB, and access protocols to
      FRAME-compliant system software.
    </p>

    <v-alert color="accent"
      variant="outlined"
      density="compact"
      class="mt-2"
      tile>
      <div class="heading">
        {{ context === 'new' ? `Select ${word} (${count}) License Rank(s).` : 'Unlock a License.' }}
      </div>
      <p class="text-cc-overline">
        Union and its representatives are not liable for problems arising from the printing,
        installation, and/or use of unrecognized or prohibited License materials.
      </p>
    </v-alert>

    <license-selector flat
      :level-up="context === 'level'"
      :pilot="<Pilot>pilot" />
  </stepper-content>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StepperContent from '../../_components/StepperContent.vue'
import LicenseSelector from '../../_components/selectors/LicenseSelector.vue'
import { Pilot } from '@/classes/pilot/Pilot'

defineOptions({ name: 'license-page' })

const props = defineProps<{
  pilot: Pilot
  context: 'new' | 'level'
}>()

const emit = defineEmits<{ back: []; next: [] }>()

const canContinue = computed(() =>
  props.context === 'new'
    ? (props.pilot as any).LicenseController.HasLicenses
    : !(props.pilot as any).LicenseController.IsMissingLicenses
)
const count = computed(() => (props.pilot as any).LicenseController.MaxLicensePoints)
const word = computed(() => {
  const words = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen']
  return words[count.value] ?? count.value
})
</script>
