<template>
  <div id="config-sheet" :class="{expanded: open, collapsed : !open}">
   <span class="float-right"><div @click="close()"><v-icon name='window-close' scale='2'/></div></span>
   <div v-if="config.name">
    <b-container fluid>
      <b-row>
        <b-col><editable-label :description="'Configuration Name'" :attr="`${configPath}.name`" :val="config.name" :id="config.pilot_id"/></b-col>
        <b-col>{{ item('Frames', config.frame_id).name }}</b-col>
        <b-btn v-b-modal.frameInfoModal>frame info</b-btn>
          <b-modal id="frameInfoModal" size="lg" :title="item('Frames', config.frame_id).name">
            <p v-html="item('Frames', config.frame_id).description" />
          </b-modal>
      </b-row>
      <b-row>
        <b-col cols=6>
          <b-row>
            <b-btn v-b-modal.manuInfoModal>{{ item('Manufacturers', item('Frames', config.frame_id).source).name }}</b-btn>
              <b-modal id="manuInfoModal" size="xl" :title="item('Manufacturers', item('Frames', config.frame_id).source).name">
              <p v-html="item('Manufacturers', item('Frames', config.frame_id).source).description" />
              </b-modal>
            <b-col>{{ item('Frames', config.frame_id).mechtype }} Mech</b-col>
          </b-row>
          <b-row><span class="header">licenses-header</span></b-row>
          <b-row>
            <b-col>licenses required</b-col>
          </b-row>
          <b-row><span class="header">notes-header</span></b-row>
            <b-row>
            <b-col><editable-textfield :description="'Configuration Notes'" :attr="`${configPath}.notes`" :val="config.notes" :id="config.pilot_id"/></b-col>
          </b-row>
        </b-col>
        <b-col cols=6><b-img src="https://via.placeholder.com/800x500" fluid-grow /></b-col>
        </b-row>

        <b-row><span class="header">stats-header</span></b-row>
        <b-row>
          <b-col cols=1>
            <b-row>h</b-row>
            <b-row>a</b-row>
            <b-row>s</b-row>
            <b-row>e</b-row>
          </b-col>
          <b-col>
            <b-row>
              <b-col>structure</b-col>
            </b-row>
            <b-row>
              <b-col>heat</b-col>
              <b-col>core power</b-col>
            </b-row>
            <b-row><span class="header">stats-sub-header</span></b-row>
            <b-row>
              <b-col>spd</b-col>
              <b-col>eva</b-col>
              <b-col>edef</b-col>
              <b-col>repcap</b-col>
            </b-row>
            <b-row>
              <b-col>tgt</b-col>
              <b-col>sp</b-col>
              <b-col>sensor</b-col>
              <b-col></b-col>
              <b-col>grapple</b-col>
              <b-col>ram</b-col>
            </b-row>
          </b-col>
        </b-row>

        <b-row><span class="header">loadout-header</span></b-row>
      <b-row>
        <b-col>loadout frame</b-col>
      </b-row>

      <b-row><span class="header">charts-header</span></b-row>
      <b-row>
        <b-col>vue-chartjs</b-col>
      </b-row>

        <div class="spacer" />
    </b-container>

        <div class="spacer" />
        <b-container>
          <b-row>
            <b-col><b-button block>print</b-button></b-col>
            <b-col><b-button block>export</b-button></b-col>
            <b-col><b-button block>clone</b-button></b-col>
            <b-col><b-button block>delete</b-button></b-col>
          </b-row>
        <div class="spacer" />
        </b-container>
   </div>
   <div v-else>
     No configuration loaded
   </div>
  </div>
</template>

<script>
  import EditableLabel from '../UI/EditableLabel'
  import EditableTextfield from '../UI/EditableTextfield'

  export default {
    name: 'config-sheet',
    components: { EditableLabel, EditableTextfield },
    methods: {
      close: function () {
        this.$parent.toggleConfigSheet(false)
      },
      item: function (itemType, id) {
        return this.$store.getters.getItemById(itemType, id)
      }
    },
    computed: {
      open: function () {
        return this.$parent.configOpen
      },
      config: function () {
        return this.$store.getters.getConfigById(this.$parent.activeConfigId)
      },

      configPath: function () {
        var idx = this.$store.getters.getConfigIndex(this.$parent.activeConfigId)
        return `configs[${idx}]`
      }
    }
  }
</script>

<style scoped>
#config-sheet {
  height: 93vh;
  width: 94vw;
  background-color: lightgray;
  position: absolute;
  top:7.25vh;
  z-index: 2;
  transition: all .6s cubic-bezier(.13,.31,0,1.02);
  overflow-y: scroll;
}

#config-sheet.expanded {
  right: 0;
}

#config-sheet.collapsed {
  right: -95vw;
}

.header {
  background-color: slategrey;
  font-weight: bold;
  letter-spacing: 3px;
  width: 100%;
  padding-left: 5px;
  margin-top:10px;
  margin-bottom: 3px;
}

.spacer {
  padding-bottom: 5vh;
}

</style>
