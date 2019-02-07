<template>
  <div>
    <b-btn @click="deleteContact" class="float-right" variant="danger" size="sm" v-b-tooltip.hover title="Remove Contact">
      <v-icon name="minus"/>
    </b-btn>
    <h5>
      <editable-label :description="'Contact Name'" :attr="`contacts[${index}].name`" :val="contact.name" />
    </h5>
    <em>
      <editable-label :description="'Contact Relationship'" :attr="`contacts[${index}].relationship`" :val="contact.relationship" />
    </em>
    <p class="card-text">
      <editable-label :description="'Contact Description'" :attr="`contacts[${index}].description`" :val="contact.description" />
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
      'contact'
    ],
    methods: {
      deleteContact: function () {
        this.$store.dispatch('splicePilot', {
          attr: 'contacts',
          start_index: this.index,
          delete_count: 1
        })
      }
    }
  }
</script>

