<template>
  <v-window-item>
    <cc-heading size="large">modals</cc-heading>

    <div>
      <cc-modal title="Modal Title" icon="cc:campaign" color="primary" cancel-action confirm-action>
        <template #activator="{ open }">
          <cc-button @click="open" color="primary">Open Modal</cc-button>
        </template>
        <p v-html="loremIpsum" />
      </cc-modal>
    </div>

    <div class="my-4">
      <cc-dialog title="Dialog Title" color="secondary" icon="mdi-alert">
        <template #activator="{ open }">
          <cc-button @click="open" color="primary">Open dialog</cc-button>
        </template>
        <p v-html="loremIpsum" />
      </cc-dialog>
    </div>
  </v-window-item>
</template>

<script lang="ts">
export default {
  name: 'ui-test-panels',
  data: () => ({
    icons: [
      'cc:campaign',
      'mdi-alert',
      'cc:pilot',
      'mdi-cog',
      'cc:kinetic',
      'mdi-content-save',
      'cc:encounter',
      'mdi-help',
    ],
    colors: ['primary', 'secondary', 'accent', 'damage--heat', 'damage--energy', 'exotic', 'cyan'],
    variants: ['default', 'flavor', 'fluff', 'admin', 'emphasis', 'subtle'],
    loremIpsum:
      '<p>Lorem ipsum odor amet, consectetuer adipiscing elit. Nisi aliquet venenatis egestas mi dictum. Etiam enim iaculis eleifend eu facilisi mauris vitae dictum. Duis dictum ultrices montes laoreet scelerisque sapien habitant. Fermentum nisi condimentum habitant porta ex platea. Fringilla vel mollis fusce congue ac quisque hac rhoncus. Hac consequat torquent velit parturient proin maecenas mollis nascetur porta. Adipiscing posuere turpis fames aliquet facilisis, hac integer netus. Venenatis nulla aptent accumsan, sed hendrerit fusce varius. Habitant conubia egestas nulla placerat ac montes.</p><p>Nulla sociosqu cras nibh sociosqu nam ex platea platea. Felis adipiscing duis; suspendisse facilisi duis felis iaculis risus malesuada. Cubilia morbi ad dui commodo maximus. Auctor tincidunt condimentum quisque nullam blandit aliquam leo aenean. Hendrerit cras rutrum neque sit, urna volutpat. Erat parturient pellentesque, tempor ultricies aptent gravida. Proin purus magna lacus cras volutpat nascetur nulla mi. Magnis nullam malesuada ac mi imperdiet tempus magnis euismod vel.</p>',
  }),
};
</script>
