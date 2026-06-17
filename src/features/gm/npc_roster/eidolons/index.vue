<template>
  <gm-split-view ref="view"
    :title="$t('gm.titles.eidolons')"
    item-type="Eidolon"
    :items="eidolons"
    :selected="<any>selected"
    :groupings="groupings"
    :sortings="sortings"
    @add-new="addNew()"
    @open="openItem($event)">
    <editor v-if="selected"
      :item="selected"
      hide-toolbar
      @exit="exit()">
      <builder slot="upper"
        :item="selected" />
    </editor>
    <v-row v-else-if="!eidolonAccess"
      style="height: 85vh">
      <v-col cols="auto"
        class="mx-auto text-center my-auto text-disabled"
        style="max-width: 800px">
        <div>
          <v-icon size="100"
            class="">mdi-book-off-outline</v-icon>
          <div class="heading h4">{{ $t('gm.noItem.missingContent') }}</div>
          <div class="heading h2 mb-2 text-center pb-4">{{ $t('gm.eidolonData.noData') }}</div>

          <i18n-t keypath="gm.eidolonData.help1" tag="span" scope="global">
            <template #link><a href="https://massif-press.itch.io/no-room-for-a-wallflower-act-1"
              target="_blank">{{ $t('gm.eidolonData.linkText') }}</a></template>
          </i18n-t>
          <br />
          <br />
          {{ $t('gm.eidolonData.help2') }}
        </div>
      </v-col>
    </v-row>
    <no-gm-item v-else />
  </gm-split-view>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import GmSplitView from '../../_views/GMSplitView.vue';
import Editor from './editor.vue';
import Builder from './builder.vue';
import { Eidolon } from '@/classes/npc/eidolon/Eidolon';
import { CompendiumStore, NpcStore } from '@/stores';
import NoGmItem from '../../_views/_components/NoGmItem.vue';
import { useDisplay } from 'vuetify';
import { ref, onUnmounted } from 'vue';

defineOptions({ name: 'eidolon-roster' })

const npcStore = NpcStore();
    const eidolons = ref(npcStore.getEidolons.filter((x) => !x.SaveController.IsDeleted));
    const unsub = npcStore.$subscribe(() => {
      eidolons.value = npcStore.getEidolons.filter((x) => !x.SaveController.IsDeleted);
    });
    onUnmounted(unsub);
const { smAndDown: mobile, xs: portrait } = useDisplay()

const props = withDefaults(defineProps<{
  id?: string
  view?: string
}>(), {
  view: 'collection'
})

const view = ref<any>(null)

const selected = ref(null as Eidolon | null)

const eidolonAccess = computed(() => {
      return CompendiumStore().hasEidolonAccess;
    })
const groupings = computed(() => {
      const allLabelTitles = new Set(
        npcStore.getAllLabels.filter((x: any) => x.title && x.title.length > 0)
          .map((x: any) => x.title)
      );

      const baseGroupings = ['None', 'Class'];

      return [...baseGroupings, ...allLabelTitles];
    })
const sortings = computed(() => {
      const allLabelTitles = new Set(
        npcStore.getAllLabels.filter((x: any) => x.title && x.title.length > 0)
          .map((x: any) => x.title)
      );

      const baseSortings = ['Name', 'Class', 'Created', 'Updated'];

      return [...baseSortings, ...allLabelTitles];
    })

function exit() {
      selected.value = null;
    }
function openItem(item) {
      selected.value = item;
      if (mobile.value) view.value.minimize();
    }
async function addNew() {
      const e = new Eidolon();
      await NpcStore().AddNpc(e);
      selected.value = e;
      if (mobile.value) view.value.minimize();
    }

onMounted(() => {
if (props.id) {
      const item = NpcStore().getNpcByID(props.id);
      if (item && item instanceof Eidolon) {
        selected.value = item;
        view.value.dialog = true;
      }
    }
})
</script>
