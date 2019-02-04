<template>
  <div>
    <b-btn @click="deleteContact" class="float-right" variant="danger" size="sm" v-b-tooltip.hover title="Remove Contact">
      <v-icon name="minus"/>
    </b-btn>
    <h5>
      <editable-label :description="'Contact Name'" :attr="`contact[${index}].name`" :val="contact.name" :id="pilot_id"/>
    </h5>
    <em>
      <editable-label :description="'Contact Relationship'" :attr="`contact[${index}].relationship`" :val="contact.relationship" :id="pilot_id"/>
    </em>
    <p class="card-text">
      <editable-label :description="'Contact Description'" :attr="`contact[${index}].description`" :val="contact.description" :id="pilot_id"/>
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
      'contact',
      'pilot_id'
    ],
    methods: {
      deleteContact: function () {
        this.$store.dispatch('splicePilot', {
          id: this.pilot_id,
          attr: 'contact',
          start_index: this.index,
          delete_count: 1
        })
      }
    }
  }
</script>

