<template>
  <div>
    <b-row>
      <b-col cols=12>
        <b-btn block @click="showModal()">
          {{license.source}} {{license.name}} - {{license.level}}
        </b-btn>
      </b-col>
    </b-row>
    <div>
      <b-modal ref="licenseModal" size="xl" centered hide-header>
        <h5 centered>{{licenseData.source}}</h5>
        <h1 centered>{{licenseData.license}}</h1>
        <b-card no-body>Rank I</b-card>
        <b-row>
          <b-col cols=auto v-for="item in licenseData.unlocks[0]" :key="item.id">
            <item-badge :item="item" :locked="false"/>
          </b-col>
        </b-row>
        <br>
        <b-card no-body :class="{locked: isLocked(2)}">Rank II</b-card>
        <b-row>
          <b-col cols=auto v-for="item in licenseData.unlocks[1]" :key="item.id">
            <item-badge :item="item" :locked="isLocked(2)" />
          </b-col>
        </b-row>
        <br>
        <b-card no-body :class="{locked: isLocked(2)}">Rank III</b-card>
        <b-row>
          <b-col cols=auto v-for="item in licenseData.unlocks[2]" :key="item.id">
            <item-badge :item="item" :locked="isLocked(3)"/>
          </b-col>
        </b-row>
        <div slot="modal-footer" class="w-100">
          <b-btn size="sm" class="float-right" variant="primary" @click="hideModal()">
            Close
          </b-btn>
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
