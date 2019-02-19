<template>
  <div>
    <v-card>
      <v-card v-for="(contact, index) in contacts" :key="index + contacts.length">
        <v-card-text class="pt-0 pb-0 mt-0 mb-0">
          <editable-label :attr="`contacts[${index}].name`" description="Contact Name" :placeholder="contact.name">
            <span slot="label" class="title">{{contact.name}}</span>
          </editable-label>
          <editable-label :attr="`contacts[${index}].relationship`" description="Contact Relationship" :placeholder="contact.relationship">
            <em slot="label">{{contact.relationship}}</em>
          </editable-label>
          <editable-label :attr="`contacts[${index}].description`" description="Contact Description" :placeholder="contact.description">
            <span slot="label">{{contact.description}}</span>
          </editable-label>
        </v-card-text>
      <v-card-actions>
        <v-btn @click="deleteContact" flat color="error">Delete Contact</v-btn>
      </v-card-actions>
      </v-card>
        <v-btn absolute bottom right fab @click="addNew"><v-icon>add</v-icon></v-btn>
    </v-card>
    <br><br>
  </div>
</template>

<script>
  import EditableLabel from '../UI/EditableLabel'

  export default {
    name: 'contacts-list',
    components: { EditableLabel },
    props: [
      'contacts'
    ],
    methods: {
      deleteContact: function () {
        this.$store.dispatch('splicePilot', {
          attr: 'contacts',
          start_index: this.index,
          delete_count: 1
        })
      },
      addNew: function () {
        this.$store.dispatch('editPilot', {
          attr: `contacts[${this.contacts.length}]`,
          val: {name: 'New Contact (click to edit)', relationship: 'Edit Relationship', description: 'Edit Description'}
        })
        this.$emit('add-contact')
      }
    }
  }
</script>

