<template>
  <div class="nav-body elevation-10">
    <div id="cap" />
    <div class="d-inline">
      <v-tooltip text="Return to Pilot Sheet"
        location="top">
        <template #activator="{ props }">
          <v-btn v-bind="props"
            size="small"
            icon
            variant="plain"
            class="unskew mt-n2"
            @click="toTacticalProfile()">
            <v-icon size="25"
              icon="cc:pilot" />
          </v-btn>
        </template>
      </v-tooltip>
    </div>

    <v-menu offset-y
      top>
      <template #activator="{ props }">
        <v-btn class="unskew mt-n1"
          icon
          variant="plain"
          size="small"
          v-bind="props">
          <v-tooltip text="Mech Options"
            location="top">
            <template #activator="{ props }">
              <v-icon v-bind="props"
                size="24"
                class="mt-n1 mx-4"
                icon="mdi-cog" />
            </template>
          </v-tooltip>
        </v-btn>
      </template>
      <div class="heading h2 bg-primary py-0 px-2">{{ $t('pm.sheet.mechOptions') }}</div>
      <v-list lines="two"
        density="compact"
        slim>
        <v-list-item prepend-icon="mdi-printer"
          title="Print"
          subtitle="Print a tabletop-ready mech sheet"
          @click="$router.push(`/print/${pilot.ID}/${mech.ID}`)" />

        <v-list-item prepend-icon="mdi-file-document-outline"
          title="Generate Statblock"
          subtitle="Get a plaintext representation of this mech configuration"
          @click="statblockDialog = true" />

        <v-divider v-if="!pilot.IsRemote" />

        <v-list-item v-if="!pilot.IsRemote"
          class="text-error"
          prepend-icon="mdi-delete"
          title="Delete Mech"
          subtitle="Remove mech from the Hangar"
          @click="$emit('delete')" />
      </v-list>
    </v-menu>

    <div v-if="!pilot.IsRemote"
      class="d-inline">
      <cc-dialog title="Share Pilot Data"
        icon="cc:pilot"
        :close-on-click="false">
        <template #activator="{ open }">
          <v-tooltip open-delay="300"
            location="top"
            :text="isAuthed ? 'Share Pilot Data' : 'Requires Cloud Account'">
            <template #activator="{ props }">
              <span v-bind="props">
                <v-btn icon
                  size="small"
                  variant="plain"
                  class="unskew mt-n2"
                  :disabled="!isAuthed"
                  @click="open">
                  <v-icon color="white">mdi-broadcast</v-icon>
                </v-btn>
              </span>
            </template>
          </v-tooltip>
        </template>
        <share-dialog :item="pilot" />
      </cc-dialog>
    </div>

    <div class="d-inline">
      <v-tooltip :text="pilot.FavoriteMech?.ID === mech.ID ? 'Unfavorite Mech' : 'Favorite Mech'"
        location="top">
        <template #activator="{ props }">
          <v-btn v-bind="props"
            size="small"
            icon
            variant="plain"
            class="unskew mt-n2"
            @click.stop="mech.Parent.FavoriteMech?.ID === mech.ID ? mech.Parent.FavoriteMech = null : mech.Parent.FavoriteMech = mech">
            <v-icon size="25"
              :icon="mech.Parent.FavoriteMech?.ID === mech.ID ? 'mdi-star' : 'mdi-star-outline'" />
          </v-btn>
        </template>
      </v-tooltip>
    </div>

    <div id="end-cap" />
  </div>
  <cc-modal v-model="statblockDialog"
    title="Generate Statblock"
    icon="mdi-code-block-tags">
    <statblock-dialog :pilot="<Pilot>pilot"
      :mech-i-d="mech.ID" />
  </cc-modal>
</template>

<script setup lang="ts">
import type { Mech } from '@/classes/mech/Mech'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { UserStore } from '@/user/store';
import StatblockDialog from '../../../components/StatblockDialog.vue';
import { Pilot } from '@/classes/pilot/Pilot'
import ShareDialog from '@/shared/ShareDialog.vue';
const router = useRouter()

const props = defineProps<{
  pilot: Pilot
  selected: number
  mech: Mech
}>()

const emit = defineEmits<{
  'delete': []
}>()

const statblockDialog = ref(false)

const isAuthed = computed(() => {
      return UserStore().IsLoggedIn
    })

function toTacticalProfile() {
      router.push({
        name: 'pilot_sheet_redirect',
        params: { pilotID: props.pilot.ID },
      });
    }
</script>

<style scoped>
.nav-body {
  position: fixed;
  bottom: 20px;
  right: -40px;
  height: 30px;
  padding: 0px 70px 0px 20px;
  transform: skew(-0.65rad);
  background-color: rgb(var(--v-theme-primary));
  z-index: 10;
}

.unskew {
  transform: skew(0.65rad);
}

#end-cap {
  background-color: rgb(var(--v-theme-primary));
  position: absolute;
  width: 5px;
  height: 30px;
  right: 260px;
  top: 0;
  z-index: 9;
  transition: filter 0.2s ease-in-out;
}

.nav-body:hover #end-cap {
  filter: brightness(2) saturate(200%) hue-rotate(20deg);
}
</style>
