<template>
  <div>
    <b-btn @click="deleteContact" class="float-right" variant="danger" size="sm" v-b-tooltip.hover title="Remove Contact">
      <v-icon name="minus"/>
    </b-btn>
    <h5>
      <editable-label :description="'Contact Name'" :attr="`fnf[${index}].name`" :val="fnf.name" :id="pilot_id"/>
    </h5>
    <em>
      <editable-label :description="'Contact Relationship'" :attr="`fnf[${index}].relationship`" :val="fnf.relationship" :id="pilot_id"/>
    </em>
    <p class="card-text">
      <editable-label :description="'Contact Description'" :attr="`fnf[${index}].description`" :val="fnf.description" :id="pilot_id"/>
    </p>
  </div>
</template>

<script>
  import EditableLabel from '../UI/EditableLabel'

  export default {
    name: 'contact-item',
    components: { EditableLabel },
    props: [
      'index',
      'fnf',
      'pilot_id'
    ],
    methods: {
      deleteContact: function () {
        this.$store.dispatch('splicePilot', {
          id: this.pilot_id,
          attr: 'fnf',
          start_index: this.index,
          delete_count: 1
        })
      }
    }
  }
</script>

