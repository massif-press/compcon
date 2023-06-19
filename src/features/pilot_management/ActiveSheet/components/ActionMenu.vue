<template>
  <div>
    <v-tabs
      v-model="selected"
      color="accent"
      icons-and-text
      background-color="primary"
      grow
      align-with-title
      class="ml-n6"
      style="width: calc(100% + 48px)"
    >
      <v-tab>
        Protocols
        <v-icon icon="cc:protocol" />
      </v-tab>
      <v-tab>
        Full Actions
        <v-icon icon="mdi-hexagon-slice-6" />
      </v-tab>
      <v-tab>
        Quick Actions
        <v-icon icon="mdi-hexagon-slice-3" />
      </v-tab>
      <v-tab>
        Reactions
        <v-icon icon="cc:reaction" />
      </v-tab>
      <v-tab>
        Free Actions
        <v-icon icon="cc:free_action" />
      </v-tab>
      <v-tab>
        Combat Log
        <v-icon icon="mdi-notebook" />
      </v-tab>
      <v-tab class="mr-12">
        Other
        <v-icon icon="mdi-dots-vertical" />
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="selected">
      <v-tab-item>
        <v-card flat color="background">
          <v-list>
            <action-menu-item
              v-for="(a, i) in pilot.State.ActionsByType('Protocol')"
              :action="a"
              :available="pilot.State.IsProtocolAvailable"
              :mech="pilot.ActiveMech"
            />
          </v-list>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat color="background">
          <v-list>
            <action-menu-item
              v-for="(a, i) in pilot.State.ActionsByType('Full')"
              :action="a"
              :available="pilot.State.Actions > 1"
              :mech="pilot.ActiveMech"
            />
          </v-list>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat color="background">
          <v-list>
            <action-menu-item
              v-for="(a, i) in pilot.State.ActionsByType('Quick')"
              :action="a"
              :mech="pilot.ActiveMech"
              :available="pilot.State.Actions > 0"
            />
          </v-list>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat color="background">
          <v-list>
            <action-menu-item
              v-for="(a, i) in pilot.State.ActionsByType('Reaction')"
              :action="a"
              available
              :mech="pilot.ActiveMech"
            />
          </v-list>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat color="background">
          <v-list>
            <action-menu-item
              v-for="(a, i) in pilot.State.ActionsByType('Free')"
              :action="a"
              available
              :mech="pilot.ActiveMech"
            />
          </v-list>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat color="background">
          <v-card-text>
            <combat-log-renderer :state="pilot.State" />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat color="background">
          <v-card-text>
            <v-divider class="my-4" />
            <v-row density="compact">
              <v-col cols="auto">
                <span class="text-overline">PILOT SKILL TRIGGERS</span>
              </v-col>
            </v-row>
            <v-row density="compact" justify="center">
              <cc-active-card
                v-for="(s, i) in pilot.SkillsController.Skills"
                :ref="`sk_${i}`"
                :cols="12"
                color="primary"
                collapsible
                :header="`${s.Skill.Name} (+${s.Bonus})`"
                :content="s.Skill.Detail"
              />
            </v-row>

            <div v-if="pilot.ReservesController.Reserves || pilot.ReservesController.Organizations">
              <v-divider class="my-4" />
              <span class="text-overline">RESERVES AND RESOURCES</span>
              <v-row
                v-if="pilot.ReservesController.Reserves || pilot.ReservesController.Organizations"
                class="mt-n3"
              >
                <cc-reserve-item
                  v-for="(r, i) in pilot.ReservesController.Reserves.filter(
                    (r) => r.Type !== 'Bonus'
                  )"
                  :reserve="r"
                  @remove="pilot.ReservesController.RemoveReserve(i)"
                />
                <cc-org-item
                  v-for="(o, i) in pilot.ReservesController.Organizations"
                  :org="o"
                  @remove="pilot.ReservesController.RemoveOrganization(i)"
                />
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script lang="ts">
import ActionMenuItem from './ActionMenuItem.vue';
import CombatLogRenderer from './CombatLogRenderer.vue';

export default {
  name: 'active-action-menu',
  components: { ActionMenuItem, CombatLogRenderer },
  props: {
    tab: { type: Number, required: true, default: 1 },
  },
  data: () => ({
    selected: 0,
  }),
  watch: {
    tab(newVal) {
      this.selected = newVal;
    },
  },
};
</script>
