<template>
  <div class="sidebar-item">
      <!-- Sidebar expanded-->
      <div v-if="parentExpanded" style="width: 100%">
        <div class="expanded-wrapper" @click="select" >
          <!-- Sidebar expanded, item selected -->
          <div v-if="active">
            <b-container>
              <b-row>
                <b-col>
                  <b-img left src="https://via.placeholder.com/115" />
                </b-col>
                <b-col>
                    {{ pilot.name }}, {{ pilot.background }} // LL: {{ pilot.level }}
                  <br>
                    {{ pilot.status }} {{ pilot.id}}
                  <br>
                  <b-button>p link</b-button>          
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  configs:
                  <div v-for="(config, index) in pilot.configs" :key="index">
                    <b-btn block>{{ config }}</b-btn>
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-btn>new config</b-btn>
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
      <!-- End Sidebar expanded -->
      <!-- Sidebar not expanded -->
      <div v-else :class="{highlighted: active}">
        <b-img center src="https://via.placeholder.com/50" />
      </div>
      <!-- End sidebar not expanded -->
  </div>
</template>

<script>
  export default {
    name: 'sidebar-item',
    props: {
      parentExpanded: {
        type: Boolean,
        required: false
      },
      index: {
        type: Number,
        required: true
      },
      pilot_id: {
        type: String,
        required: true
      }
    },
    methods: {
      select () {
        this.$parent.activeIndex = this.index
        this.$store.dispatch('loadPilot', this.pilot.id)
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

  .expanded-wrapper{
    padding: 10px;
    cursor: pointer;
  }

 .expanded-wrapper:hover{
   border-right: 5px solid rgb(11, 59, 131);
   background-color: gray;
 }
</style>