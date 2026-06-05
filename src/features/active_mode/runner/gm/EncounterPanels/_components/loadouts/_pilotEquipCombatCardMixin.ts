import { useDisplay } from 'vuetify'
import DestroyedOverlay from './_DestroyedOverlay.vue'
import FlavorDescription from './_FlavorDescription.vue'
import PilotEquipCardBody from './_PilotEquipCardBody.vue'
import { PilotEquipment } from '@/classes/pilot/components/Loadout/equipment/PilotEquipment'
import { Pilot } from '@/classes/pilot/Pilot'

export const pilotEquipCombatCardMixin = {
  components: {
    EquipmentDestroyedOverlay: DestroyedOverlay,
    EquipmentFlavorDescription: FlavorDescription,
    PilotEquipCardBody,
  },
  setup() {
    const { smAndDown: mobile, xs: portrait } = useDisplay()
    return { mobile, portrait }
  },
  props: {
    item: {
      type: PilotEquipment,
      required: true,
    },
    pilot: {
      type: Pilot,
      required: true,
    },
    encounter: {
      type: Object,
      required: true,
    },
    owner: {
      type: Object,
      required: true,
    },
  },
  emits: ['deploy'],
}
