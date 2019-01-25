<template>
  <div class="sidebar-item">
      <!-- Sidebar expanded-->
      <transition name="fade">
      <div v-if="parentExpanded" style="width: 100%" :class="{highlighted: active}">
        <div class="expanded-wrapper" @click="select" >
          <!-- Sidebar expanded, item selected -->
          <div v-if="active">
            <b-container>
              <b-row>
                <b-col>
                  <div @click="hideConfigSheet()">
                    <b-img left src="https://via.placeholder.com/115" />
                  </div>
                </b-col>
                <b-col>
                    {{ pilot.name }}, {{ pilot.background }} // LL: {{ pilot.level }}
                  <br>
                    {{ pilot.status }} {{ pilot.id}}
                  <br>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  configs:
                  <div v-for="(config, index) in pilot.configs" :key="index">
                    <b-btn block v-bind:id="config.id + 'btn'" style="margin: 5px;" @click="showConfigSheet(config.id)">{{ config.name }}</b-btn>
                      <b-popover boundary="viewport" v-bind:target="config.id + 'btn'" triggers="hover" placement="right" style="z-index:90!important">
                        <template slot="title">{{config.frame_id}}</template>
                        <span class="text-danger">{{config.status}}</span>
                      </b-popover>
                  </div>
                </b-col>
              </b-row>
              <hr>
              <b-row>
                <b-btn block>add new config</b-btn>
              </b-row>
            </b-container>
          </div>
          <!-- End expanded and selected -->

          <!-- Sidebar expanded, item unselected -->
          <div v-else>
          <b-img center src="https://via.placeholder.com/90" />

            <br>
              {{ pilot.name }}, {{ pilot.background }} // LL: {{ pilot.level }}
            <br>
              {{ pilot.status }}
          </div>
          <!-- End expanded and unselected -->
        </div>
      </div>
      </transition>
      <!-- End Sidebar expanded -->
      <!-- Sidebar not expanded -->
      <transition name="fade">
        <div v-if="!parentExpanded">
          <b-img right src="https://via.placeholder.com/60" :class="{imgselected: active}" />
        </div>
      </transition>
      <!-- End sidebar not expanded -->
  </div>
</template>

<script>
  export default {
    name: 'sidebar-item',
    props: [
      'parentExpanded',
      'index',
      'pilot_id'
    ],
    methods: {
      select () {
        this.$parent.activeIndex = this.index
        this.$store.dispatch('loadPilot', this.pilot.id)
      },
      hideConfigSheet () {
        this.$parent.toggleConfigSheet(false)
      },
      showConfigSheet (configId) {
        this.$parent.$parent.activeConfigId = configId
        this.$parent.toggleConfigSheet(true)
        this.$parent.toggleSidebar(false, true)
      }
    },
    computed: {
      active () {
        return this.$parent.activeIndex === this.index
      },
      pilot: function () {
        return this.$store.getters.getPilotById(this.pilot_id)
      }
    }
  }
</script>

<style scoped>
  .sidebar-item {
    display: block;
    padding-top: 5px;
    padding-bottom: 5px;
  }

  .highlighted {
    border-right: 3px solid rgb(11, 59, 131);
    background-color: gray;
  }

  .imgselected {
    border: 2px solid blue;
  }

  .expanded-wrapper{
    padding: 10px;
    cursor: pointer;
  }

 .expanded-wrapper:hover{
   background-color: gray;
 }

  .fade-enter-active {
    transition: all .45s
  }

  .fade-enter,
  .fade-leave-active {
    position: absolute;
    left: 300px;
    opacity: 0
  }

</style>