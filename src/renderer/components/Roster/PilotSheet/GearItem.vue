<template>
  <b-card no-body>
    <b-row v-if="newitem">
      <b-col cols=2><b-btn block>ADD ITEM</b-btn></b-col>
      <b-col>
        <span>/////</span>
      </b-col>
    </b-row>
    <b-row v-else>
      <b-col cols=2><b-btn block v-b-toggle="item.id + 'collapse'">ITEM_TYPE</b-btn></b-col>
      <b-col>
        <span>item name ({{item.id}}) & quick data</span>
        <b-collapse :id="item.id + 'collapse'" class="mt-2">
          <b-card>
            <p class="card-text">Collapse contents Here</p>
          </b-card>
        </b-collapse>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
export default {
  name: 'gear-item',
  props: [
    'newitem',
    'item'
  ]
}
</script>
