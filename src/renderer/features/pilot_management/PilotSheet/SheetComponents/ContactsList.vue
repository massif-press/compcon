<template>
  <v-card class="mb-5">
    <v-card v-for="(contact, index) in contacts" :key="index + contact.name">
      <div class="ml-3 mr-4">
        <v-layout class="pt-2">
          <v-flex shrink>
            <editable-label :attr="`contacts[${index}].name`" description="Contact Name" :placeholder="contact.name" @on-save="update">
              <span slot="label" class="title pb-0 mb-0">{{contact.name}} &nbsp;</span>
            </editable-label>
          </v-flex>
          <v-flex>
            <editable-label :attr="`contacts[${index}].relationship`" description="Contact Relationship" :placeholder="contact.relationship" @on-save="update">
              <em slot="label" >{{contact.relationship}} &nbsp;</em>
            </editable-label>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex>
            <editable-textfield description="Contact Notes" :attr="`contacts[${index}].description`" :initial="contact.description" />
          </v-flex>
        </v-layout>
      </div>
    <v-card-actions class="pt-0 mt-0">
      <v-btn @click="deleteContact(index)" flat color="error">Delete Contact</v-btn>
    </v-card-actions>
    </v-card>
      <v-btn absolute bottom right fab @click="addNew"><v-icon>add</v-icon></v-btn>
  </v-card>
</template>

<script lang="ts">
  import {EditableLabel, EditableTextfield} from '../../components/UI'

  import Vue from 'vue'
  export default Vue.extend({
    name: 'contacts-list',
    components: { EditableLabel, EditableTextfield },
    computed: {
      contacts (): PilotContact[] {
        return this.$store.getters['getPilot'].contacts
      }
    },
    methods: {
      deleteContact: function (index: number) {
        this.$store.dispatch('splicePilot', {
          attr: 'contacts',
          start_index: index,
          delete_count: 1
        })
      },
      addNew: function () {
        this.$store.dispatch('editPilot', {
          attr: `contacts[${this.contacts.length}]`,
          val: {name: 'New Contact', relationship: 'Edit Relationship', description: ''}
        })
        this.$emit('add-contact')
      },
      update: function () {
        this.$forceUpdate()
      }
    }  
  })
</script>

