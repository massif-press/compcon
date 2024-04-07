<template>
  <square-map-editor
    v-if="gridType === 'Square'"
    ref="mapCanvas"
    :size-x="Number(sizeX)"
    :size-y="Number(sizeY)"
    :cell-type="spaceType"
    :cell-subtype="subtype"
    :map="encounter.Map"
    @save-as-image="saveAsImage($event)" />
  <hex-map-horizontal-editor
    v-else-if="gridType === 'HexH'"
    ref="mapCanvas"
    :size-x="Number(sizeX)"
    :size-y="Number(sizeY)"
    :cell-type="spaceType"
    :cell-subtype="subtype"
    :map="encounter.Map"
    @save-as-image="saveAsImage($event)" />
  <hex-map-vertical-editor
    v-else
    ref="mapCanvas"
    :size-x="Number(sizeX)"
    :size-y="Number(sizeY)"
    :cell-type="spaceType"
    :cell-subtype="subtype"
    :map="encounter.Map"
    @save-as-image="saveAsImage($event)" />
  <v-row class="px-3 mt-n6" justify="space-between">
    <v-col cols="auto" class="text-center text-caption">
      <v-row>
        <!-- <v-col cols="auto">
          <v-icon size="small" icon="mdi-mouse-left-click-outline" class="mr-1" />Paint
        </v-col> -->
        <v-col cols="auto"> <v-icon icon="mdi-mouse-left-click-outline" class="mr-1" />Pan </v-col>
        <v-col cols="auto"> <v-icon icon="mdi-mouse-scroll-wheel" class="mr-1" />Zoom </v-col>
      </v-row>
    </v-col>
    <v-col cols="auto">
      <v-btn @click="$refs.mapCanvas.resetView()" color="accent" size="x-small" variant="outlined"
        >Reset View</v-btn
      >
    </v-col>
    <v-spacer />
    <v-col cols="auto">
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" color="accent" size="x-small" variant="outlined">
            <v-icon size="small" icon="mdi-upload" start />Import
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <v-file-input
              accept="text/json"
              variant="outlined"
              label="Select Data File"
              prepend-icon="mdi-paperclip"
              density="compact"
              @change="stageImport"
              clearable />
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn color="accent" text @click="showImportDialog = false">Cancel</v-btn>
            <v-spacer />
            <v-btn color="success" text :disabled="!stagedMap?.MapType" @click="importStagedMap()"
              >Import</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-col>
    <v-col cols="auto">
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" color="accent" size="x-small" variant="outlined">
            <v-icon size="small" icon="mdi-download" start /> Export
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="saveAsImage" title="Save as Image" />
          <v-list-item @click="exportMap" title="Export Data" />
        </v-list>
      </v-menu>
    </v-col>
  </v-row>

  <div class="pa-3">
    <v-row align="center">
      <v-col>
        <v-select placeholder="Select Map" density="compact" hide-details />
      </v-col>
      <v-col>
        <v-btn variant="tonal" color="accent">Load</v-btn>
      </v-col>
      <v-col v-if="!showEditor" cols="auto">
        <v-dialog v-model="showEditorDialog" persistent max-width="800">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" color="primary" text>Open Editor</v-btn>
          </template>
          <v-card>
            <v-toolbar density="compact" color="warning">
              <v-toolbar-title>Warning</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-alert icon="mdi-alert" prominent variant="outlined"
                >Clicking "Continue" will enable the experimental map editor. The map editor is
                still under development and is presented in an unfinished state. You may encounter
                bugs and other rough edges.
              </v-alert>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-btn color="accent" text @click="showEditorDialog = false">Cancel</v-btn>
              <v-spacer />
              <v-btn color="success" text @click="allowEditor()">Continue</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </div>

  <div v-if="showEditor" class="pa-3">
    <v-row>
      <v-col>
        <v-btn-toggle v-model="gridType" density="compact" divided color="primary" mandatory>
          <v-btn value="Square"><v-icon start icon="mdi-square-outline" />Square</v-btn>
          <v-btn value="HexV"><v-icon start icon="mdi-hexagon-outline" />Hex (V)</v-btn>
          <v-btn value="HexH"
            ><v-icon start icon="mdi-hexagon-outline" class="mdi-rotate-90" />Hex (H)</v-btn
          >
        </v-btn-toggle>
      </v-col>

      <v-col cols="2">
        <v-text-field
          v-model="sizeX"
          density="compact"
          hide-details
          label="Size X"
          dense
          type="number" />
      </v-col>
      <v-col cols="2">
        <v-text-field
          v-model="sizeY"
          density="compact"
          hide-details
          label="Size Y"
          dense
          type="number" />
      </v-col>

      <v-col cols="auto" align-self="end">
        <v-btn @click="clear" color="error" size="x-small" variant="tonal" fade-select
          >Clear Map</v-btn
        >
      </v-col>
    </v-row>
    <v-divider class="my-2" />
    <v-row>
      <v-col>
        <div class="text-caption">PALETTE</div>
        <v-btn-toggle
          v-model="spaceType"
          density="compact"
          variant="outlined"
          color="accent"
          mandatory>
          <v-btn value="deployment"><v-icon icon="mdi-square" color="red" start />Deployment</v-btn>
          <v-btn value="ingress"><v-icon icon="mdi-square" color="blue" start />Ingress</v-btn>
          <v-btn value="egress"><v-icon icon="mdi-square" color="green" start />Egress</v-btn>
          <v-btn value="objective"><v-icon icon="mdi-square" color="amber" start />Objective</v-btn>
          <v-divider vertical />
          <v-btn value="obstruction"
            ><v-icon icon="mdi-square" color="grey" start />Obstruction</v-btn
          >
        </v-btn-toggle>
      </v-col>
      <v-col>
        <div class="text-caption">TYPE</div>
        <v-btn-toggle
          v-model="subtype"
          density="compact"
          variant="outlined"
          color="accent"
          :disabled="disableSubtype"
          multiple>
          <v-btn value="player"><v-icon start icon="cc:pilot" />Player</v-btn>
          <v-btn value="enemy"><v-icon start icon="cc:encounter" />Enemy</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
  </div>

  <v-footer border app>
    <v-spacer />
    <v-btn @click="saveAndExit" variant="tonal" color="accent" prepend-icon="mdi-content-save"
      >Save and Exit</v-btn
    >
  </v-footer>
</template>

<script>
import SquareMapEditor from './SquareMap.vue';
import HexMapHorizontalEditor from './HexMapHorizontal.vue';
import HexMapVerticalEditor from './HexMapVertical.vue';
import { EncounterMap } from '@/classes/encounter/EncounterMap';
import { UserStore } from '@/stores';
import { ImportData } from '@/io/Data';

export default {
  name: 'map-editor',
  components: { SquareMapEditor, HexMapHorizontalEditor, HexMapVerticalEditor },
  props: {
    encounter: { type: Object },
  },
  data: () => ({
    sizeX: 30,
    sizeY: 12,
    gridType: 'Square',
    spaceType: 'deployment',
    subtype: [],
    showEditorDialog: false,
    showEditor: false,
    stagedMap: null,
  }),
  emits: ['exit'],
  watch: {
    showEditor(val) {
      if (!val) return;
      UserStore().User.SetView('ShowMapEditor', val);
    },
    sizeX(val) {
      if (val && this.mapData) this.mapData.SizeX = val;
    },
    sizeY(val) {
      if (val && this.mapData) this.mapData.SizeY = val;
    },
    gridType(val) {
      if (val && this.mapData) this.mapData.MapType = val;
    },
  },
  mounted() {
    const user = UserStore().User;
    if (!user || !user.View) return;
    this.showEditor = user.View('ShowMapEditor', false);

    if (this.encounter.Map) {
      this.sizeX = this.encounter.Map.SizeX;
      this.sizeY = this.encounter.Map.SizeY;
      this.gridType = this.encounter.Map.MapType;
    }
  },
  computed: {
    mapData() {
      return this.$refs.mapCanvas.mapData;
    },
    disableSubtype() {
      const disabled = ['obstruction', 'difficult', 'dangerous'].includes(this.spaceType);
      if (disabled) {
        this.subtype = [];
      }
      return disabled;
    },
  },
  methods: {
    clear() {
      this.mapData.Clear();
      this.$refs.mapCanvas.DrawGrid();
    },
    allowEditor() {
      this.showEditorDialog = false;
      this.showEditor = true;
    },
    saveAsImage() {
      const canvas = document.getElementById('canvas');
      const imageName = `${this.encounter.Name}_map`;

      const link = document.createElement('a');
      link.style.display = 'none';
      document.body.appendChild(link);
      link.setAttribute('download', imageName + '.png');
      link.setAttribute('href', canvas.toDataURL().replace('image/png', 'image/octet-stream'));
      link.click();
    },

    exportMap() {
      const mapData = this.$refs.mapCanvas.mapData;
      const map = EncounterMap.Serialize(mapData);

      const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(map))}`;
      const link = document.createElement('a');
      link.style.display = 'none';
      document.body.appendChild(link);
      link.setAttribute('download', `${this.encounter.Name}_map.json`);
      link.setAttribute('href', dataStr);
      link.click();
    },

    async stageImport(file) {
      if (!file) return;
      let data = await ImportData(file.target.files[0]);

      try {
        const map = EncounterMap.Deserialize(data);
        this.stagedMap = map;
      } catch (e) {
        console.error(e);
        return;
      }
    },

    importStagedMap() {
      this.spaceType = this.stagedMap.MapType;
      this.sizeX = this.stagedMap.SizeX;
      this.sizeY = this.stagedMap.SizeY;
      this.$refs.mapCanvas.mapData = this.stagedMap;
      this.$refs.mapCanvas.DrawGrid();
      this.showImportDialog = false;
    },

    saveAndExit() {
      this.encounter.Map = this.$refs.mapCanvas.mapData;
      this.encounter.save();
      this.$emit('exit');
    },
  },
};
</script>
