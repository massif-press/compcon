<template>
  <div v-show="AiSystems.length">
    <cc-synergy-display location="cascade" :mech="mech" />
    <v-card tile elevation="0" outlined>
      <v-toolbar
        density="compact"
        elevation="0"
        color="error"
        class="text-center text-white heading h3"
      >
        {{ $t('ui.cascade.alert') }}
        <v-spacer />
        <cc-tooltip
          :title="$t('ui.titles.cascade')"
          content="<p>Except for some limited systems &ndash; like comp/cons &ndash; any time a mech with the AI tag makes a structure damage or overheating check, roll 1d20. On a 1, the NHP&rsquo;s casket has suffered a traumatic impact or code incursion and the NHP enters cascade.&nbsp;</p>
<p>When an NHP begins to cascade, they immediately take over the mech and become an NPC under the control of the GM. They plan their own agenda, and adopt one of several behavioral patterns &ndash; ignoring their pilot, overruling their pilot, trying to get their pilot out of the way, or simply acting outside the constraints of human logic and desire. In cascade, NHPs&rsquo; actions do not always conform to human logic &ndash; though they are not yet unshackled, their actions may seem odd, contrapositive, or threatening to humans.&nbsp;</p>
<p>NHPs in cascade can be stabilized by a pilot choosing to <strong>SHUT DOWN</strong> their mech, returning them to their base state. This is the only action a pilot in a cascading mech can take. </p>"
        >
          <v-icon icon="mdi-information-outline" />
        </cc-tooltip>
      </v-toolbar>
      <v-row v-for="(a, i) in AiSystems" :key="`ai-${i}`" class="heading h3 py-2" align="center">
        <v-col>
          {{ a.Name }}
        </v-col>
        <v-col>
          {{ $t('common.status') }}:
          <span v-if="!checked.includes(i)" style="opacity: 0.4">{{ $t('ui.cascade.pending') }}</span>
          <span v-else :class="a.IsCascading ? 'text-red' : 'text-success'">
            {{ a.IsCascading ? $t('ui.cascade.inCascade') : $t('active.common.nominal') }}
          </span>
        </v-col>
        <v-col cols="auto" class="mr-3">
          <cc-dice-menu preset="1d20" @commit="checkCascade($event.total, i)" />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import type { Mech } from '@/classes/mech/Mech'
import { computed, ref } from 'vue'

defineOptions({ name: 'cascade-check' })

const props = defineProps<{
  mech: Mech
}>()

const checked = ref([])

const AiSystems = computed(() => {
      return props.mech.MechLoadoutController.ActiveLoadout.Equipment.filter(
        (x) => x.IsAI && !x.NoCascade && !x.Destroyed
      );
    })

function checkCascade(roll, index) {
      checked.value.push(index);
      if (roll === 1) AiSystems.value[index].IsCascading = true;
      else AiSystems.value[index].IsCascading = false;
    }
</script>
