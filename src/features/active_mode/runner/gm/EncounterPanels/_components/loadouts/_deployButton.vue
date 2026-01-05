<template>
  <v-row dense align="center">
    <v-col cols="auto">
      <v-tooltip location="top" text="Equipment Deployable (Instance)">
        <template #activator="{ props }">
          <v-icon v-bind="props" icon="cc:drone" />
        </template>
      </v-tooltip>

      <v-tooltip location="top" :text="deployable.DeployAction.Activation">
        <template #activator="{ props }">
          <span v-bind="props" class="ml-1 mr-n1">
            <v-icon
              v-bind="props"
              :icon="deployable.DeployAction.Icon"
              :color="canActivate ? 'success' : 'error'" />
            <v-tooltip v-if="!canActivate" location="top">
              <template #activator="{ props }">
                <v-icon v-bind="props" icon="mdi-exclamation-thick" color="error" />
              </template>
              <div class="text-center text-cc-overline">Cannot activate</div>
              <v-divider class="my-1" />
              <div v-if="customDisabledText" class="text-center">
                {{ customDisabledText }}
              </div>
              <div v-else>
                Insufficient
                <v-chip
                  :color="deployable.DeployAction.Color"
                  size="small"
                  variant="elevated"
                  :prepend-icon="deployable.DeployAction.Icon || ''">
                  {{ deployable.DeployAction.Activation }}
                </v-chip>
                actions remaining this turn.
              </div>
            </v-tooltip>
          </span>
        </template>
      </v-tooltip>
    </v-col>
    <v-col>
      <v-row no-gutters align="center">
        <v-col cols="auto" style="margin-right: 2px">
          <cc-deployable-info :deployable="deployable" />
        </v-col>
        <v-col>
          <v-menu v-model="menu" :close-on-content-click="false" offset-y>
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                flat
                tile
                block
                size="small"
                :color="deployable.DeployAction.Color"
                height="26px"
                class="ml-n1"
                :prepend-icon="deployable.DeployAction.Icon">
                Deploy Instance
              </v-btn>
            </template>
            <v-card border>
              <v-toolbar
                class="heading h3 px-3"
                dense
                height="40px"
                flat
                :color="deployable.DeployAction.Color">
                <v-icon :icon="deployable.DeployAction.Icon" start />
                Deploy {{ deployable.Name }}
              </v-toolbar>
              <v-divider />
              <v-card-text class="pa-3">
                <div class="mb-2">
                  This will generate and deploy a new instance of
                  <strong>{{ deployable.Name }}</strong>
                  for
                  <strong>{{ actor.CombatController.CombatName }}</strong>
                  as a
                  <v-chip
                    :color="deployable.DeployAction.Color"
                    :prepend-icon="deployable.DeployAction.Icon"
                    size="small"
                    variant="elevated"
                    flat>
                    {{ deployable.DeployAction.Activation }} Action
                  </v-chip>
                </div>
                <v-row class="mt-2">
                  <v-btn size="small" text @click="menu = false">Cancel</v-btn>
                  <v-spacer />
                  <v-btn size="small" flat tile variant="elevated" color="primary" @click="deploy">
                    deploy
                  </v-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'deploy-button',
  props: {
    deployable: {
      type: Object,
      required: true,
    },
    actor: {
      type: Object,
      required: true,
    },
  },
  emits: ['deploy'],
  data: () => ({
    menu: false,
  }),
  methods: {
    deploy() {
      this.$emit('deploy', this.deployable);
      this.menu = false;
    },
    canActivate() {
      return (
        !this.disabled &&
        this.actor.CombatController.CanActivate(this.deployable.DeployAction.Activation)
      );
    },
  },
};
</script>
