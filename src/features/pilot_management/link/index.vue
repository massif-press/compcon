<template>
  <v-container>
    <v-progress-linear v-if="loading"
      indeterminate />
    <cc-alert v-else-if="rateLimitError"
      icon="mdi-speedometer"
      :title="$t('pm.titles.serverErrorTooManyRequests')"
      color="error"
      variant="outlined">
      <p v-if="rateLimitError.isDaily"
        class="text-center">
        {{ $t('pm.link.theDailyRequestLimitHasBeen') }}
      </p>
      <p v-else-if="rateLimitError.retryAfter"
        class="text-center">
        {{ $t('pm.link.tooManyRequestsPleaseTryAgain') }}
        <span class="text-accent">{{ rateLimitRetryLabel }}</span>.
      </p>
      <p v-else
        class="text-center">
        {{ $t('pm.link.tooManyRequestsPleaseTryAgain2') }}
      </p>
    </cc-alert>
    <div v-else-if="!pilot">
      <v-row class="mt-4">
        <v-col>
          <div class="heading h2">{{ $t('pm.link.pilotNotFound') }}</div>
          <p class="text-center">
            {{ $t('pm.link.aPilotWithTheShareCode') }}
            <span class="text-accent">{{ sharecode }}</span>
            {{ $t('pm.link.couldNotBeFound') }}
          </p>
        </v-col>
      </v-row>
    </div>
    <div v-else-if="incompatible">
      <v-row class="mt-4">
        <v-col>
          <div class="heading h2">{{ $t('pm.link.pilotRequiresReSync') }}</div>
          <p class="text-center">
            {{ $t('pm.new.pilot') }}
            <b class="text-accent">
              {{ itemData.callsign }}
            </b>

            {{ `(${itemData.name})` }}
            {{ $t('pm.link.withShareCode') }}
            <span class="text-accent">{{ sharecode }}</span>
            {{ $t('pm.link.mustBeReSyncedToThe') }}
          </p>
        </v-col>
      </v-row>
    </div>
    <div v-else-if="pilot">
      <full-link-sheet v-if="style === 'full'"
        :pilot="pilot"
        :mech="mech" />
      <build-link-sheet v-else
        :pilot="pilot"
        :mech="mech" />
    </div>
    <div style="height: 80px" />
  </v-container>
  <v-tabs v-if="style === 'full' && pilot"
    style="position: fixed; bottom: 26px; left: 0; right: 0; z-index: 2"
    color="primary"
    fixed
    height="22"
    align-tabs="center"
    bg-color="primary">
    <v-tab v-for="l in links"
      :key="l.target"
      color="accent"
      style="margin-top: -2px"
      @click="scrollTo(l.target)">
      {{ l.title }}
    </v-tab>
  </v-tabs>
  <v-footer app
    density="compact"
    color="primary"
    height="30"
    border="t">
    <cc-button prepend-icon="mdi-arrow-left"
      size="small"
      class="mr-2"
      @click="$router.go(-1)">
      {{ $t('common.back') }}
    </cc-button>
    <cc-button prepend-icon="mdi-home"
      size="small"
      to="/">{{ $t('common.mainMenu') }}</cc-button>

    <v-spacer />
    <v-tooltip location="top"
      open-delay="300">
      <template #activator="{ props }">
        <v-icon v-bind="props"
          size="small"
          icon="mdi-share-variant"
          @click="copyToClipboard" />
      </template>
      <span>{{ $t('common.copyLink') }}</span>
    </v-tooltip>
  </v-footer>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Pilot } from '@/classes/pilot/Pilot'
import { unCamelCase } from '@/classes/utility/accent_fold';
import { downloadFromS3, GetFromCode, RateLimitError } from '@/io/apis/account';
import { CompendiumStore } from '@/stores';
import logger from '@/user/logger';
import FullLinkSheet from './_views/FullLinkSheet.vue';
import BuildLinkSheet from './_views/BuildLinkSheet.vue';
const router = useRouter()

defineOptions({ name: 'PilotLink' })

const props = withDefaults(defineProps<{
  sharecode: string
  style?: string
  mechId?: string
}>(), {
  style: 'full'
})

const loading = ref(true)
const itemData = ref(null as any)
const pilot = ref(null as Pilot | null)
const rateLimitError = ref(null as { retryAfter: number | null; isDaily: boolean } | null)

const compendiumLoaded = computed(() => {
      return CompendiumStore().loaded;
    })
const incompatible = computed(() => {
      if (itemData.value) {
        return !itemData.value.originId;
      } return false;
    })
const mech = computed(() => {
      if (props.mechId) {
        return pilot.value?.Mechs.find((m) => m.ID === props.mechId) || undefined;
      }
      return undefined;
    })
const rateLimitRetryLabel = computed(() => {
      const secs = rateLimitError.value?.retryAfter;
      if (!secs) return '';
      return secs >= 60 ? `${Math.ceil(secs / 60)} minute${Math.ceil(secs / 60) !== 1 ? 's' : ''}` : `${secs} second${secs !== 1 ? 's' : ''}`;
    })
const links = computed(() => {
      if (!pilot.value) return [];
      const links = [{ title: 'Biography', target: 'biography' }];
      if (pilot.value.BondController.Bond) links.push({ title: 'Bond', target: 'bond' });
      if (pilot.value.SkillsController.Skills.length > 0)
        links.push({ title: 'Skills', target: 'skills' });
      if (pilot.value.ReservesController.Reserves.length > 0)
        links.push({ title: 'Reserves', target: 'reserves' });
      links.push({ title: 'Loadout', target: 'loadout' });
      if (pilot.value.LicenseController.Licenses.length > 0)
        links.push({ title: 'Licenses', target: 'licenses' });
      if (pilot.value.CoreBonusController.CoreBonuses.length > 0)
        links.push({ title: 'Core Bonuses', target: 'core-bonuses' });
      if (pilot.value.TalentsController.Talents.length > 0)
        links.push({ title: 'Talents', target: 'talents' });

      if (mech.value) {
        links.push({ title: 'Mech', target: 'mech' });
      }

      return links;
    })

function copyToClipboard() {
      navigator.clipboard.writeText(window.location.href);
    }
function scrollTo(id) {
      const el = document.getElementById(id);
      const offset = 50;
      if (!el) {
        logger.error(`Element with ID ${id} not found for scrolling`, this);
        return;
      }
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
async function getFromCode() {
      loading.value = true;
      rateLimitError.value = null;
      let row;
      try {
        row = await GetFromCode(props.sharecode);
      } catch (err) {
        if (err instanceof RateLimitError) {
          rateLimitError.value = { retryAfter: err.retryAfter, isDaily: err.isDaily };
          loading.value = false;
          return;
        }
        logger.error(`Unable to find pilot at share code ${props.sharecode}`, this, err);
      }

      try {
        const data = await downloadFromS3(row.uri);
        itemData.value = data;
        pilot.value = new Pilot(data);
      } catch (err) {
        logger.error(`Error downloading pilot data: ${err}`, this, err);
      }

      loading.value = false;
    }

onMounted(async () => {
  await getFromCode();
  if (pilot.value) document.title = `${pilot.value.Callsign} // ${pilot.value.Name}`;
  else document.title = 'Pilot Link';
})
</script>
