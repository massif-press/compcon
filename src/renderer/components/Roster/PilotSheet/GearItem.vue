<template>
  <b-card no-body>
    <b-row>
      <b-col cols=2><b-btn block>ITEM_TYPE</b-btn></b-col>
      <b-col>
        <b-btn block v-b-toggle="item.id + 'collapse'">item name ({{item.id}}) & quick data</b-btn>
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
    'item'
  ]
}
</script>
