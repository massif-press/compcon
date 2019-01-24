<template>
  <div>
    <!-- Image and text -->
    <b-navbar type="light" variant="fade">
      <b-navbar-brand href="#">
        BootstrapVue {{ versionNumber }}
      </b-navbar-brand>
      <div class="ml-group">
        <b-button href=#>Long Link</b-button>
        <b-button>about</b-button>
        <b-button>options</b-button>
        <b-button>help</b-button>
        <router-link to="/" tag="b-button">back</router-link>

      </div>
    </b-navbar>
  </div>
</template>

<script>
  export default {
    name: 'topbar',
    computed: {
      version: function () {
        return this.versionNumber
      }
    }
  }
</script>

<style>
</style>
