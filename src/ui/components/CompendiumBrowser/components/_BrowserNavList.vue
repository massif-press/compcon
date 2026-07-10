<template>
  <div v-if="group === 'lcp'">
    <v-list-group v-for="lcp in facets.filteredLcps.value"
      :key="`lcp-${lcp}`"
      :value="lcp"
      color="accent"
      class="pt-0">
      <template #activator="{ props: act }">
        <v-list-item v-bind="act"
          tile>
          <template #title>
            <span class="text-button">
              <b>{{ lcp }}</b>
            </span>
          </template>
        </v-list-item>
      </template>

      <template v-if="open.includes(lcp)">
        <browser-item-list v-if="bprops.options.noSource"
          :items="facets.filteredItemsByLcp.value[lcp]" />

        <template v-else-if="bprops.itemType === 'NpcClass'">
          <b-list-group v-for="role in facets.groupsByLcp.value[lcp]"
            :key="`role-${lcp}-${role}`"
            :parent="lcp"
            :collection="role"
            :role="role">
            <browser-item-list :items="facets.itemsByLcpGrouped.value[lcp]?.[role] ?? []" />
          </b-list-group>
        </template>

        <template v-else-if="bprops.itemType === 'NpcFeature'">
          <b-list-group v-for="origin in facets.groupsByLcp.value[lcp]"
            :key="`origin-${lcp}-${origin}`"
            :parent="lcp"
            :collection="origin">
            <browser-item-list :items="facets.itemsByLcpGrouped.value[lcp]?.[origin] ?? []" />
          </b-list-group>
        </template>

        <template v-else>
          <b-list-group v-for="manufacturer in facets.groupsByLcp.value[lcp]"
            :key="`mf-${lcp}-${manufacturer}`"
            :parent="lcp"
            :collection="manufacturer"
            :manufacturer="(mf(manufacturer) as any)">
            <browser-item-list :items="facets.itemsByLcpGrouped.value[lcp]?.[manufacturer] ?? []" />
          </b-list-group>
        </template>
      </template>
    </v-list-group>
  </div>

  <div v-else-if="group === 'source'">
    <v-list-group v-for="manufacturer in facets.manufacturerSources.value"
      :key="`mf-${manufacturer}`"
      :value="manufacturer"
      color="accent"
      class="pt-0">
      <template #activator="{ props: act }">
        <v-list-item tile
          v-bind="act"
          slim>
          <template #prepend>
            <cc-logo :source="mf(manufacturer)" />
            &nbsp;
          </template>
          <template #title>
            <span class="text-button">
              <b>{{ manufacturer ? manufacturer : $t('ui.widget.other') }}</b>
            </span>
          </template>
        </v-list-item>
      </template>

      <browser-item-list :items="facets.itemsBySourceGroup.value[manufacturer]" />
    </v-list-group>
  </div>

  <div v-else-if="group === 'role'">
    <b-list-group v-for="role in facets.roles.value"
      :key="`role-${role}`"
      no-indent
      :collection="role"
      :role="role">
      <browser-item-list :items="facets.itemsByRoleGroup.value[role]" />
    </b-list-group>
  </div>

  <div v-else-if="group === 'featureType'">
    <b-list-group v-for="featureType in facets.featureTypes.value"
      :key="`feat-${featureType}`"
      :collection="featureType"
      :feature="featureType">
      <browser-item-list :items="facets.itemsByFeatureTypeGroup.value[featureType]" />
    </b-list-group>
  </div>

  <div v-else-if="group === 'origin'">
    <b-list-group v-for="origin in facets.origins.value"
      :key="`origin-${origin}`"
      :collection="origin">
      <browser-item-list :items="facets.itemsByOriginGroup.value[origin]" />
    </b-list-group>
  </div>

  <div v-else-if="group === 'license'">
    <v-list-group v-for="license in facets.licenses.value"
      :key="`lic-${license}`"
      :value="license"
      color="accent"
      class="pt-0">
      <template #activator="{ props: act }">
        <v-list-item tile
          v-bind="act">
          <template #title>
            <span class="text-button">
              <b>{{ license ? license : $t('ui.widget.other') }}</b>
            </span>
          </template>
        </v-list-item>
      </template>
      <browser-item-list :items="facets.itemsByLicenseGroup.value[license]" />
    </v-list-group>
  </div>

  <div v-else-if="group === 'type'">
    <v-list-group v-for="subtype in facets.subtypes.value"
      :key="`subtype-${subtype}`"
      :value="subtype"
      color="accent"
      class="pt-0">
      <template #activator="{ props: act }">
        <v-list-item tile
          v-bind="act">
          <template #title>
            <span class="text-button">
              <b>{{ subtype }}</b>
            </span>
          </template>
        </v-list-item>
      </template>
      <browser-item-list :items="facets.itemsByType.value[subtype]" />
    </v-list-group>
  </div>

  <div v-else>
    <browser-item-list :items="facets.shownItems.value" />
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import bListGroup from './_b-list-group.vue'
import BrowserItemList from './_BrowserItemList.vue'
import { CompendiumBrowserKey } from '../browserContext'

defineOptions({ name: 'BrowserNavList' })

const ctx = inject(CompendiumBrowserKey)!
const { facets, group, open, mf } = ctx
const bprops = ctx.props
</script>
