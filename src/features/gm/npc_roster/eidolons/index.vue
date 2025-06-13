<template>
  <gm-split-view
    ref="view"
    title="Eidolons"
    item-type="Eidolon"
    :items="eidolons"
    :selected="<any>selected"
    :groupings="groupings"
    :sortings="sortings"
    @add-new="addNew()"
    @open="openItem($event)">
    <editor v-if="selected" :item="selected" hide-toolbar @exit="exit()">
      <builder slot="upper" :item="selected" />
    </editor>
    <v-row v-else-if="!eidolonAccess" style="height: 85vh">
      <v-col cols="auto" class="mx-auto text-center my-auto text-disabled" style="max-width: 800px">
        <div>
          <v-icon size="100" class="">mdi-book-off-outline</v-icon>
          <div class="heading h4">Missing GM Content</div>
          <div class="heading h2 mb-2 text-center pb-4">No Eidolon editor data found!</div>

          Eidolon data are included with the paid version of No Room for a Wallflower: Act 1, and
          can be found in the downloadable content section on the
          <a href="https://massif-press.itch.io/no-room-for-a-wallflower-act-1" target="_blank">
            No Room for a Wallflower: Act 1 itch.io page.
          </a>
          <br />
          <br />
          If you have already downloaded the Wallflower GM LCP, you can import it into COMP/CON via
          the Content Manager available on the Main Menu or in the Options menu on the right side of
          the nav bar.
        </div>
      </v-col>
    </v-row>
    <no-gm-item v-else />
  </gm-split-view>
</template>

<script lang="ts">
import GmSplitView from '../../_views/GMSplitView.vue';
import Editor from './editor.vue';
import Builder from './builder.vue';
import { Eidolon } from '@/classes/npc/eidolon/Eidolon';
import { CompendiumStore, NpcStore } from '@/stores';
import NoGmItem from '../../_views/_components/NoGmItem.vue';

export default {
  name: 'eidolon-roster',
  components: { GmSplitView, Editor, Builder, NoGmItem },
  props: {
    id: {
      type: String,
      required: false,
    },
    view: {
      type: String,
      required: false,
      default: 'collection',
    },
  },
  data: () => ({
    selected: null as Eidolon | null,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    eidolonAccess() {
      return CompendiumStore().hasEidolonAccess;
    },
    groupings() {
      const allLabelTitles = new Set(
        NpcStore()
          .getAllLabels.filter((x: any) => x.title.length > 0)
          .map((x: any) => x.title)
      );

      const baseGroupings = ['None', 'Class'];

      return [...baseGroupings, ...allLabelTitles];
    },
    sortings() {
      const allLabelTitles = new Set(
        NpcStore()
          .getAllLabels.filter((x: any) => x.title.length > 0)
          .map((x: any) => x.title)
      );

      const baseSortings = ['Name', 'Class', 'Created', 'Updated'];

      return [...baseSortings, ...allLabelTitles];
    },

    eidolons() {
      return NpcStore().getEidolons.filter((x) => !x.SaveController.IsDeleted);
    },
  },
  mounted() {
    if (this.id) {
      const item = NpcStore().getNpcByID(this.id);
      if (item && item instanceof Eidolon) {
        this.selected = item;
        (this.$refs as any).view.dialog = true;
      }
    }
  },
  methods: {
    exit() {
      this.selected = null;
    },
    openItem(item) {
      this.selected = item;
      if (this.mobile) (this.$refs as any).view.minimize();
    },
    async addNew() {
      const e = new Eidolon();
      await NpcStore().AddNpc(e);
      this.selected = e;
      if (this.mobile) (this.$refs as any).view.minimize();
    },
  },
};
</script>
