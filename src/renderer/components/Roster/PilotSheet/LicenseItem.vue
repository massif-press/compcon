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
      <b-modal ref="myModalRef" size="lg" :title="`${license.source} ${license.name}`" centered>
        {{ licenseData }}
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
  export default {
    name: 'license-item',
    props: [
      'license',
      'licenseData'
    ],
    methods: {
      showModal () {
        this.$refs.myModalRef.show()
      },
      hideModal () {
        this.$refs.myModalRef.hide()
      }
    }
  }
</script>