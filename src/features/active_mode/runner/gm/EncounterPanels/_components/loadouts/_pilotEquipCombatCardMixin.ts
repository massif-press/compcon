import { useMobile } from '@/composables/useMobile'
import DestroyedOverlay from './_DestroyedOverlay.vue'
import FlavorDescription from './_FlavorDescription.vue'
import PilotEquipCardBody from './_PilotEquipCardBody.vue'

export const pilotEquipCombatCardMixin = {
  components: {
    EquipmentDestroyedOverlay: DestroyedOverlay,
    EquipmentFlavorDescription: FlavorDescription,
    PilotEquipCardBody,
  },
  setup() {
    return useMobile()
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    pilot: {
      type: Object,
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
