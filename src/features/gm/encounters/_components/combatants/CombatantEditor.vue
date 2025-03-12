<template>
  <div class="text-overline mt-1">COMBATANTS</div>

  <v-card flat tile>
    <v-card-text class="py-2 px-4">
      <div v-if="encounter.Combatants.filter((x) => x.side === 'enemy').length > 0">
        <v-row dense align="center">
          <v-col cols="auto" style="width: 30px"><v-divider /></v-col>
          <v-col cols="auto" class="text-caption text-disabled">ENEMY FORCES</v-col>
          <v-col><v-divider /></v-col>
        </v-row>
      </div>
      <combatant-list-item
        v-for="(c, i) in encounter.Combatants.filter((x) => x.side === 'enemy')"
        :item="c"
        :odd="i % 2 === 0"
        :readonly="readonly"
        @open="editUnit"
        @remove="encounter.RemoveCombatant(i)" />
      <div v-if="encounter.Combatants.filter((x) => x.side === 'ally').length > 0" class="mt-3">
        <v-row dense align="center">
          <v-col cols="auto" style="width: 30px"><v-divider /></v-col>
          <v-col cols="auto" class="text-caption text-disabled">ALLIED FORCES</v-col>
          <v-col><v-divider /></v-col>
        </v-row>
      </div>
      <combatant-list-item
        v-for="(c, i) in encounter.Combatants.filter((x) => x.side === 'ally')"
        :item="c"
        :odd="i % 2 === 0"
        :readonly="readonly"
        @open="editUnit"
        @remove="encounter.RemoveCombatant(i)" />
      <div v-if="encounter.Combatants.filter((x) => x.side === 'neutral').length > 0" class="mt-3">
        <v-row dense align="center">
          <v-col cols="auto" style="width: 30px"><v-divider /></v-col>
          <v-col cols="auto" class="text-caption text-disabled">NEUTRAL</v-col>
          <v-col><v-divider /></v-col>
        </v-row>
      </div>
      <combatant-list-item
        v-for="(c, i) in encounter.Combatants.filter((x) => x.side === 'neutral')"
        :item="c"
        :odd="i % 2 === 0"
        :readonly="readonly"
        @open="editUnit"
        @remove="encounter.RemoveCombatant(i)" />
    </v-card-text>
    <v-toolbar density="compact" color="panel">
      <v-toolbar-title class="text-caption">
        <v-icon icon="cc:mech" class="mt-n1" color="error" />
        {{ encounter.Combatants.filter((x) => x.side === 'enemy').length }}
        <cc-slashes class="mx-2" />
        <v-icon icon="cc:mech" class="mt-n1" color="success" />
        {{ encounter.Combatants.filter((x) => x.side === 'ally').length }}
        <cc-slashes class="mx-2" />
        <v-icon icon="cc:mech" class="mt-n1" />
        {{ encounter.Combatants.filter((x) => x.side === 'neutral').length }}
      </v-toolbar-title>
      <v-spacer />
      <cc-button
        v-if="!readonly"
        color="accent"
        prepend-icon="mdi-plus"
        class="mr-2"
        @click="addDialog = true">
        Add NPC
      </cc-button>
    </v-toolbar>
  </v-card>

  <v-dialog v-if="!readonly" v-model="addDialog" fullscreen>
    <v-card>
      <v-toolbar density="compact">
        <v-toolbar-title class="heading h3">
          <span>SELECT NPC</span>
          <v-btn-toggle
            v-model="selectorView"
            class="py-2 ml-6"
            variant="tonal"
            color="accent"
            mandatory>
            <v-btn value="list" icon><v-icon icon="mdi-view-list" /></v-btn>
            <v-btn value="table" icon><v-icon icon="mdi-table" /></v-btn>
          </v-btn-toggle>
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="addDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <combatant-selector :encounter="encounter" :mode="selectorView" @select="addUnit" />
    </v-card>
  </v-dialog>

  <v-dialog v-model="editDialog" fullscreen>
    <v-card>
      <v-toolbar class="pl-4">
        <div>
          <div v-if="!readonly" class="text-caption text-disabled mb-n1">CURRENTLY EDITING</div>
          <div>
            <v-icon :icon="selected?.npc.Icon" size="x-small" class="mt-n1" start />
            <span class="heading">{{ selected?.npc.Name }}</span>
            <span class="text-caption text-disabled">
              &emsp;(Encounter Instance #{{ selected.index }})
            </span>

            <span v-if="!readonly">
              <v-tooltip location="bottom" open-delay="200" max-width="300px">
                <template #activator="{ props }">
                  <v-icon
                    v-bind="props"
                    end
                    class="fade-select"
                    size="x-small"
                    icon="mdi-help-circle" />
                </template>
                <span>
                  This is a unique instance of this NPC tied to this Encounter data. Editing this
                  NPC will not affect the original NPC data.
                </span>
              </v-tooltip>
            </span>
          </div>
        </div>
        <v-spacer />
        <combatant-settings-menu :readonly="readonly" :item="selected" />
        <v-spacer />
        <v-tooltip v-if="!readonly" location="bottom" open-delay="200" max-width="300px">
          <template #activator="{ props }">
            <v-icon
              v-bind="props"
              :color="selected.npc.IsLinked ? 'success' : ''"
              :icon="selected.npc.IsLinked ? 'mdi-link-variant' : 'mdi-link-variant-off'"
              start />
          </template>
          <span v-if="selected.npc.IsLinked">
            The source of this NPC instance is present in your NPC roster (
            <b class="text-primary">{{ selected.npc.GetLinkedItem().Name }}</b>
            ) and can receive updates from the original
          </span>
          <span v-else>This NPC instance is not linked to a valid source in your NPC roster.</span>
        </v-tooltip>

        <b v-if="!readonly" :class="selected.npc.IsLinked ? 'text-accent' : 'text-disabled'">
          <v-menu :close-on-content-click="false" width="50vw">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                size="x-small"
                variant="outlined"
                :disabled="!selected.npc.IsLinked">
                Source {{ selected.npc.IsLinked ? 'Linked' : 'Unavailable' }}
              </v-btn>
            </template>
            <v-card variant="outlined">
              <v-card-text>
                <div class="text-caption text-disabled">Instance Source</div>
                <div class="heading">{{ selected.npc.GetLinkedItem().Name }}</div>
                <v-divider class="my-2" />
                <div class="text-caption text-disabled"></div>
                <div v-if="itemDiff && Object.keys(itemDiff).length">
                  <v-row dense class="text-caption text-disabled">
                    <v-col>Change</v-col>
                    <v-col>This Instance</v-col>
                    <v-col>Source</v-col>
                    <v-col cols="auto">Update</v-col>
                  </v-row>
                  <v-row dense v-for="key in Object.keys(itemDiff)">
                    <v-col>{{ key }}</v-col>
                    <v-col
                      :class="
                        itemDiff[key].instance.length > itemDiff[key].source.length
                          ? 'text-success'
                          : 'text-error'
                      ">
                      {{ itemDiff[key].instance }}
                    </v-col>
                    <v-col>{{ itemDiff[key].source }}</v-col>
                    <v-col cols="auto">
                      <v-tooltip location="bottom" open-delay="200" max-width="300px">
                        <template #activator="{ props }">
                          <v-btn
                            icon
                            color="accent"
                            variant="text"
                            size="x-small"
                            class="mt-n1"
                            @click="diffUpdate(key)">
                            <v-icon v-bind="props" size="large" icon="mdi-update" />
                          </v-btn>
                        </template>
                        <span>Update this instance property to the source</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                  <v-divider class="my-2" />
                  <v-row dense>
                    <v-col offset="10">
                      <v-tooltip location="bottom" open-delay="200" max-width="300px">
                        <template #activator="{ props }">
                          <v-btn
                            v-bind="props"
                            size="small"
                            variant="tonal"
                            color="accent"
                            @click="diffUpdateAll(itemDiff)">
                            Update all
                          </v-btn>
                        </template>
                        <span>Update all instance properties to the source</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </div>
                <div v-else class="pl-2 font-italic">No changes</div>
              </v-card-text>
            </v-card>
          </v-menu>
        </b>

        <v-spacer v-if="!readonly" />
        <v-btn icon @click="editDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <div style="height: calc(100vh - 64px); overflow-y: auto; overflow-x: hidden; padding: 0 8px">
        <component
          v-if="selected"
          :is="editorComponent"
          :item="selected.npc"
          :readonly="readonly || !selected.npc.IsLinked"
          hide-toolbar
          hide-footer />
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Npc } from '@/classes/npc/Npc';
import CombatantSelector from './CombatantSelector.vue';
import { UserStore } from '@/stores';
import CombatantListItem from './listItemContent/CombatantListItem.vue';
import UnitEditor from '../../../npc_roster/npcs/editor.vue';
import DoodadEditor from '../../../npc_roster/doodads/editor.vue';
import EidolonEditor from '../../../npc_roster/eidolons/editor.vue';
import CombatantSettingsMenu from './_components/combatantSettingsMenu.vue';
import { GenerateItemDiff, SetDiff } from '@/classes/npc/NpcDiff';

export default {
  name: 'combatant-editor',
  components: {
    CombatantSelector,
    CombatantListItem,
    UnitEditor,
    DoodadEditor,
    EidolonEditor,
    CombatantSettingsMenu,
  },
  props: {
    encounter: { type: Object, required: true },
    readonly: { type: Boolean, default: false },
  },
  data: () => ({
    selected: null as any,
    addDialog: false,
    editDialog: false,
    selectorView: 'list',
    hasChanges: false,
  }),
  watch: {
    selectorView(val) {
      if (!val) return;
      UserStore().User.SetView('combatantSelectorView', val);
    },
  },
  created() {
    const user = UserStore().User;
    if (!user || !user.View) return;
    this.selectorView = user.View('combatantSelectorView', 'list');
  },
  computed: {
    editorComponent() {
      if (!this.selected) return null;
      switch ((this.selected as any).npc.ItemType.toLowerCase()) {
        case 'eidolon':
          return EidolonEditor;
        case 'doodad':
          return DoodadEditor;
        case 'unit':
          return UnitEditor;
        default:
          return null;
      }
    },
    itemDiff() {
      if (this.selected && this.selected.npc.IsLinked)
        return GenerateItemDiff(this.selected.npc, this.selected.npc.GetLinkedItem());
    },
  },
  methods: {
    addUnit(item: Npc) {
      this.encounter.AddCombatant(item);

      this.$notify({
        title: `${item.Name} Added`,
        text: `An instance of ${item.Name} was added to ${this.encounter.Name}.`,
        data: { icon: 'cc:encounter' },
      });
    },
    editUnit(item: any) {
      this.selected = item;
      this.editDialog = true;
    },
    diffUpdate(key) {
      SetDiff(this.selected.npc, key);
    },
    diffUpdateAll(allDiffs) {
      Object.keys(allDiffs).forEach((key) => {
        SetDiff(this.selected.npc, key);
      });
    },
  },
};
</script>
