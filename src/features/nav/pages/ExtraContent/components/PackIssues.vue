<template>
  <div class="text-caption">
    <div
      v-if="errorCount"
      class="font-weight-bold"
    >
      {{ $t('nav.packIssues.skippedCount', { count: errorCount }, errorCount) }}
    </div>
    <div
      v-if="warningCount"
      class="font-weight-bold"
    >
      {{ $t('nav.packIssues.warningCount', { count: warningCount }, warningCount) }}
    </div>
    <div
      class="my-1"
      style="max-height: 200px; overflow-y: auto"
    >
      <div
        v-for="(issue, i) in issues"
        :key="i"
      >
        <v-icon
          size="x-small"
          :color="issue.severity === 'error' ? 'error' : 'warning'"
          :icon="issue.severity === 'error' ? 'mdi-close-circle' : 'mdi-alert'"
        />
        <b v-text="[issue.collection, issue.item].filter(Boolean).join(' / ')" />
        <span
          class="ml-1"
          v-text="issueText(issue)"
        />
      </div>
    </div>
    <i>{{ $t('nav.packIssues.authorHint') }}</i>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import type { PackIssue } from '@/classes/ContentPack'

  const props = defineProps<{ issues: PackIssue[] }>()
  const { t } = useI18n()

  const errorCount = computed(() => props.issues.filter(x => x.severity === 'error').length)
  const warningCount = computed(() => props.issues.length - errorCount.value)

  function issueText(issue: PackIssue): string {
    switch (issue.code) {
      case 'loadError':
        return t('nav.packIssues.loadError', { detail: issue.detail })
      case 'invalidField':
        return t('nav.packIssues.invalidField', { field: issue.field })
      case 'unknownValue':
        return t('nav.packIssues.unknownValue', { field: issue.field, value: issue.detail })
      case 'notArray':
        return t('nav.packIssues.notArray')
    }
  }
</script>
