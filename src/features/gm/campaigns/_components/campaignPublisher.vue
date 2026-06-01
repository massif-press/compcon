<template>
  <v-dialog max-width="85vw">
    <template #activator="{ props }">
      <v-btn v-bind="props"
        block
        size="small"
        variant="tonal"
        class="my-2 pa-2">
        Publish Campaign
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-card-title>Publish Campaign</v-card-title>
        <v-divider />
        <v-card-text>
          <div class="mx-auto"
            style="width: 80%">
            <current-version-export v-if="campaign.Latest"
              :campaign="campaign" />
            <v-alert v-else
              color="accent"
              variant="tonal"
              border
              icon="mdi-information">
              <div class="text-caption">
                This campaign has not been published. Publish a first version of this campaign to
                export a campaign package via file or share code.
              </div>
            </v-alert>
          </div>
          <div class="my-2 text-center">
            <div class="text-caption">Release for</div>
            <div class="mb-1 text-accent">
              {{ new Date().toLocaleDateString(undefined, dOptions as any) }}
            </div>
            <div class="text-caption">Version</div>
            <v-row style="width: 400px"
              class="mx-auto">
              <v-col>
                <div class="text-caption text-disabled">Major</div>
                <v-text-field v-model="major"
                  type="number"
                  variant="outlined"
                  density="compact"
                  hide-details />
              </v-col>
              <v-col>
                <div class="text-caption text-disabled">Minor</div>
                <v-text-field v-model="minor"
                  type="number"
                  variant="outlined"
                  density="compact"
                  hide-details />
              </v-col>
              <v-col>
                <div class="text-caption text-disabled">Patch</div>
                <v-text-field v-model="patch"
                  type="number"
                  variant="outlined"
                  density="compact"
                  hide-details />
              </v-col>
            </v-row>
            <v-expand-transition>
              <div v-if="!verifyVersion"
                class="text-caption text-error ma-1">
                <b>Version {{ version }} already exists!</b>
              </div>
            </v-expand-transition>
          </div>

          <div class="text-left mx-auto text-caption"
            style="width: 80%">
            Release notes and changelog:
            <v-textarea v-model="changes"
              outlined
              dense
              rows="3"
              auto-grow />
          </div>
          <div class="text-center">
            <v-btn size="large"
              variant="tonal"
              color="accent"
              prepend-icon="mdi-upload"
              class="my-2"
              :disabled="!verifyVersion"
              @click="publishCampaign()">
              Publish New Version
            </v-btn>
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn variant="text"
            @click="isActive.value = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { notify } from '@/util/notify'
import { Campaign } from '@/classes/campaign/Campaign';
import CurrentVersionExport from './currentVersionExport.vue';
import JSZip from 'jszip';

defineOptions({ name: 'campaign-publisher' })

const props = defineProps<{
  campaign: Campaign
}>()

const emit = defineEmits<{
  'published': []
}>()

const major = ref(0)
const minor = ref(0)
const patch = ref(0)
const changes = ref('')
const dOptions = ref({ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

if (!versionHistory.value.length) {
      major.value = 1;
      minor.value = 0;
      patch.value = 0;
    } else {
      const latest = versionHistory.value[versionHistory.value.length - 1].ver
        .split('.')
        .map((n) => parseInt(n));
      major.value = latest[0];
      minor.value = latest[1] + 1;
      patch.value = latest[2];
    }

if (!versionHistory.value.length) {
      major.value = 1;
      minor.value = 0;
      patch.value = 0;
    } else {
      const latest = versionHistory.value[versionHistory.value.length - 1].ver
        .split('.')
        .map((n) => parseInt(n));
      major.value = latest[0];
      minor.value = latest[1] + 1;
      patch.value = latest[2];
    }

const versionHistory = computed(() => {
      return props.campaign.VersionHistory || [];
    })
const version = computed(() => {
      return `${major.value}.${minor.value}.${patch.value}`;
    })
const latest = computed(() => {
      return versionHistory.value.length
        ? versionHistory.value[versionHistory.value.length - 1]
        : null;
    })
const verifyVersion = computed(() => {
      if (Number(major.value) + Number(minor.value) + Number(patch.value) < 1) return false;
      let res = true;
      versionHistory.value.forEach((hist) => {
        if (hist.ver === version.value) res = false;
      });
      return res;
    })

async function publishCampaign() {
      (props.campaign as Campaign).Publish(version.value, changes.value);
      if (props.campaign.CloudController.ShareCode) {
        await props.campaign.CloudController.UpdateCloud('campaign');
      }
      emit('published');
      notify({
        title: 'Campaign Published',
        text: `Version ${version.value} of ${props.campaign.Name} has been published.`,
        data: { color: 'success' },
      });
    }
async function exportLcd() {
      const filename = `${props.campaign.Name} - ${version.value}.lcd`;
      const zip = new JSZip();

      zip.file('campaign_data.json', JSON.stringify(Campaign.Serialize(props.campaign as Campaign)));

      const content = await zip.generateAsync({ type: 'blob' });

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(content);
      link.download = filename;

      // Add the link to the DOM and trigger the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
function savePublished() {
      (props.campaign as Campaign).Publish(version.value, changes.value);
    }
</script>
