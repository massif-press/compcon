<template>
  <div id="sidebar" 
    @mouseover="toggleSidebar(true)" 
    @mouseleave="toggleSidebar(false)" 
    :class="{expanded: expand, collapsed : !expand}">
    <div id='sidebar-wrapper'>
      <div id='sidebar-header'>
        <div v-if="expand">users:</div>
        <div v-else>
          <span class="center"> 
            <v-icon name="angle-double-right" scale='2'/> 
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
          <b-button block v-if="expand">add new user</b-button>
          <b-button block v-else right> + </b-button>
        </div>
      </div> <!--/footer-->
    </div>
  </div>
</template>

<script>
import SidebarItem from './Sidebar/SidebarItem'

export default {
  name: 'sidebar',
  components: { SidebarItem },
  data: () => ({
    expand: false,
    activeIndex: -1,
    activeID: ''
  }),
  methods: {
    toggleSidebar: function (bool) {
      this.expand = bool
    },
    toggleConfigSheet: function (bool) {
      this.$parent.toggleConfigSheet(bool)
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
  z-index: 999;
  position: absolute;
  height: 93vh;
  overflow: hidden;
  background-color: lightgrey;
  transition: all .45s cubic-bezier(.23,.73,.61,1.2);
}

#sidebar.expanded {
  width: 300px;
}

#sidebar.collapsed {
  width: 75px;
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

.collapsed {
  overflow: hidden;
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