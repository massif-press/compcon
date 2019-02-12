<template>
  <div>
    <v-layout>
      <v-flex xs12>
        <v-btn block @click="showModal()">
          {{license.source}} {{license.name}} - {{license.level}}
        </v-btn>
      </v-flex>
    </v-layout>
    <div>
      <b-modal ref="licenseModal" size="xl" centered hide-header>
        <h5 centered>{{licenseData.source}}</h5>
        <h1 centered>{{licenseData.license}}</h1>
        <b-card no-body>Rank I</b-card>
        <v-layout>
          <v-flex shrink v-for="item in licenseData.unlocks[0]" :key="item.id">
            <item-badge :item="item" :locked="false"/>
          </v-flex>
        </v-layout>
        <br>
        <b-card no-body :class="{locked: isLocked(2)}">Rank II</b-card>
        <v-layout>
          <v-flex shrink v-for="item in licenseData.unlocks[1]" :key="item.id">
            <item-badge :item="item" :locked="isLocked(2)" />
          </v-flex>
        </v-layout>
        <br>
        <b-card no-body :class="{locked: isLocked(2)}">Rank III</b-card>
        <v-layout>
          <v-flex shrink v-for="item in licenseData.unlocks[2]" :key="item.id">
            <item-badge :item="item" :locked="isLocked(3)"/>
          </v-flex>
        </v-layout>
        <div slot="modal-footer" class="w-100">
          <v-btn size="sm" class="float-right" variant="primary" @click="hideModal()">
            Close
          </v-btn>
        </div>    
      </b-modal>
    </div>
  </div>
</template>

<script>
  import ItemBadge from '../UI/ItemBadge'

  export default {
    name: 'license-item',
    components: { ItemBadge },
    props: [
      'license',
      'licenseData'
    ],
    methods: {
      showModal () {
        this.$refs.licenseModal.show()
      },
      hideModal () {
        this.$refs.licenseModal.hide()
      },
      isLocked (target) {
        return !(this.license.level >= target)
      }
    }
  }
</script>

<style scoped>
  .locked {
    background-color: lightgray;
    cursor: not-allowed;
  }
</style>
