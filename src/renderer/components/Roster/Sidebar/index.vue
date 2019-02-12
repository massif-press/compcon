<template>
  <div id="sidebar" 
    @mouseover="toggleSidebar(true)" 
    @mouseleave="toggleSidebar(false)" 
    :class="{expanded: expand, collapsed : !expand}"
    :hidden="hidden">
    <div id='sidebar-wrapper'>
      <div id='sidebar-header'>
        <div v-if="expand">users:</div>
        <div v-else>
          <span class="float-right"> 
            <b-icon name="angle-double-right" scale='2'/> 
          </span>
        </div>
      </div> <!--/wrapper-->
      <div id='sidebar-content' :class="{collapsed : !expand}">
        <div style="height: 8px"></div> <!-- spacer -->
        <sidebar-item
          v-for="(pilot, index) in pilots"
          :key="index"
          :index="index"
          :pilot_id="pilot.id"
          :parentExpanded="expand"
        />
      </div> <!--/content-->
      <div id='sidebar-footer'>
        <div> 
          <v-btn :to="'/new'" block  v-if="expand"><span style="padding-bottom:3px;"><b-icon name="plus-circle" style="padding-bottom:3px;" /> add new user</span></v-btn>
          <v-btn :to="'/new'" block v-else>back<span class="float-right" style="padding-right:18px; padding-bottom:3px;"><b-icon name="plus-circle" /></span></v-btn>
        </div>
      </div> <!--/footer-->
    </div>
  </div>
</template>

<script>
import SidebarItem from './SidebarItem'

export default {
  name: 'sidebar',
  components: { SidebarItem },
  data: () => ({
    expand: false,
    lockExpand: false,
    activeIndex: -1,
    activeID: '',
    hidden: false
  }),
  methods: {
    toggleSidebar: function (bool, lock) {
      if (!this.lockExpand) {
        this.expand = bool
        if (lock) {
          this.lockExpand = true
          setTimeout(() => {
            this.lockExpand = false
          }, 450)
        }
      }
    },
    hideSidebar: function (bool) {
      this.hidden = bool
    }
  },
  computed: {
    pilots: function () {
      return this.$store.getters.getAllPilots
    }
  }
}
</script>

<style scoped>
#sidebar {
  z-index: 50;
  position: absolute;
  height: 93vh;
  overflow: hidden;
  background-color: lightgrey;
  transition: all .45s cubic-bezier(.23,.73,.61,1);
  width: 300px;
}

#sidebar.expanded {
  left: 0;
}

#sidebar.collapsed {
  left: -225px;
  overflow: hidden;

}

#sidebar-wrapper {
  height: 100%;
  position: relative;
}

#sidebar-header {
  position: absolute;
  top: 0;
  width: 100%;
  background-color: antiquewhite;
}

#sidebar-content {
  padding-top: 30px;
  height: 88.25vh;
  overflow-y: scroll;
}

#sidebar-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}

.center {
  width: 100%;
  text-align: center;
}

</style>