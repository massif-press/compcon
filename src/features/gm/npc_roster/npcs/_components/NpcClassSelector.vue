<template>
  <v-dialog v-model="dialog">
    <v-card style="overflow-y: hidden">
      <v-toolbar density="compact" color="primary">
        <v-toolbar-title class="heading">SELECT CLASS</v-toolbar-title>
        <v-spacer />
        <v-btn icon color="white" @click="dialog = false"><v-icon large>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-card-text v-if="!classes.length" class="mt-n4">
        <v-container>
          <div style="min-height: 20vh; width: 700px; margin: auto" class="py-4">
            <div class="heading h2 mb-2 text-center pb-4">No NPC Class data found!</div>

            NPC data are included with the paid version of the LANCER Core Book and are therefore
            not included with COMP/CON by default. You can find NPC Class, Template, and Feature
            data as additional downloadable content on the
            <a href="https://massif-press.itch.io/corebook-pdf" target="_blank"
              >LANCER: Core Book itch.io page</a
            >.<br /><br />
            If you have already downloaded the NPC data, you can import it into COMP/CON via the
            Content Manager available on the Main Menu or in the Options menu on the right side of
            the nav bar.
            <br />
            <br />
            If you purchased a physical copy of the LANCER Core Book, but have not received
            instructions on how to redeem your copy of the digital version and its associated
            assets, including core NPC data, please contact Massif Press at
            <a href="mailto:massifpress@gmail.com">massifpress@gmail.com</a>.
          </div>
        </v-container>
      </v-card-text>
      <panel-view v-else ref="view">
        <template #title>
          <v-row density="compact" align="center" class="mt-n8 mb-n6">
            <v-col cols="4" class="my-3">
              <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                density="compact"
                hide-details
                variant="outlined"
                clearable />
            </v-col>
            <v-col>
              <v-btn large block color="secondary-darken-1" :disabled="!selected" @click="AddNpc()">
                <v-icon start>mdi-edit</v-icon>
                <span v-if="selected">Set {{ selected.Name }} Class</span>
                <span v-else>Select NPC Class</span>
              </v-btn>
            </v-col>
          </v-row>
        </template>
        <template #left>
          <v-list
            style="width: 100%; overflow-y: scroll"
            v-model:opened="opened"
            lines="two"
            density="compact"
            class="bg-transparent mt-n5">
            <v-list-group v-for="role in roles" :value="role">
              <template v-slot:activator="{ props }">
                <v-list-item
                  v-bind="props"
                  :title="role"
                  variant="tonal"
                  :prepend-icon="getRoleIcon(role)" />
              </template>

              <v-list-item
                v-for="item in classes.filter((x) => x.Role === role)"
                color="accent"
                :value="item"
                :subtitle="item.Terse"
                @click="selected = item">
                <template #title>
                  <v-scroll-x-transition leave-absolute>
                    <v-icon v-if="selected === item" start>mdi-chevron-triple-right</v-icon>
                  </v-scroll-x-transition>
                  <span class="heading"> {{ item.Name }} </span>
                </template>
              </v-list-item>
            </v-list-group>
          </v-list>
        </template>
        <template #right>
          <div v-if="selected">
            <v-row dense align="center" class="mt-n6 mb-n3">
              <v-col>
                <span class="heading mech">
                  {{ selected.Name }}
                </span>
              </v-col>
              <v-col v-if="selected.InLcp" cols="auto">
                <div class="heading h3 text-text">
                  {{ selected.LcpName }}
                </div>
              </v-col>
            </v-row>
            <cc-item-card :item="selected" />
          </div>

          <v-row v-else align="center" justify="center" style="width: 100%; height: 100%">
            <v-col cols="auto">
              <span class="heading h1 text-disabled text--lighten-2">select npc class</span>
            </v-col>
          </v-row>
        </template>
      </panel-view>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import PanelView from '../../../_components/PanelView.vue';

export default {
  name: 'npc-class-selector',
  props: {
    item: { type: Object, required: true },
  },
  components: { PanelView },
  data: () => ({
    tierPreview: 1,
    dialog: false,
    selected: null as any,
    search: '',
    grouping: null,
    opened: [] as string[],
    statArr: [
      'Hull',
      'Agility',
      'Systems',
      'Engineering',
      'Size',
      'Armor',
      'HP',
      'Heatcap',
      'Evade',
      'Edef',
      'Speed',
      'Sensor',
      'Save',
    ],
  }),
  watch: {
    selectedClass() {
      (this.$refs.view as any).resetScroll();
    },
    search() {
      this.opened = Array.from(this.roles);
    },
  },
  computed: {
    classes() {
      if (this.search) {
        return CompendiumStore().NpcClasses.filter((x) =>
          x.Name.toLowerCase().includes(this.search.toLowerCase())
        );
      }
      return CompendiumStore().NpcClasses;
    },
    roles() {
      return new Set(this.classes.map((x) => x.Role));
    },
  },
  methods: {
    getRoleIcon(role: string) {
      if (role.toLowerCase() === 'biological') return 'mdi-heart-pulse';
      return `cc:role_${role.toLowerCase()}`;
    },
    show() {
      this.dialog = true;
    },
    AddNpc() {
      this.item.NpcClassController.SetClass(this.selected, this.item.NpcClassController.Tier);
      this.dialog = false;
      // const store =NpcStore()
      // store.addNpc(new Npc(this.selectedClass, (this.$refs.card as any).tierPreview))
      // this.$store.dispatch('cloudSync', { callback: null, condition: 'selectedreate' })
      // this.$router.push('./npc-roster')
    },
  },
};
</script>
