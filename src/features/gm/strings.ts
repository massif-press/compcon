export const GM_STRINGS = {
  import: {
    importErrorTitle: 'Import Error',
    importErrorText: (error: string) => `Unable to import GM Data: ${error}`,
    v2BackupTitle: 'v2 Import Backup',
    v2BackupText: (count: number) =>
      `${count} item(s) saved to pending v2 imports in the Content Manager.`,
    encounterImportErrorText: (error: string) => `Unable to import encounter: ${error}`,
  },
  sync: {
    syncCompleteTitle: 'Sync Complete',
    syncFailedTitle: 'Sync Failed',
    syncCompleteText: (itemType: string, name: string) => `${itemType} ${name} synced.`,
    syncFailedText: (itemType: string, name: string, err: string) =>
      `Failed to sync ${itemType} ${name}. ${err}`,
  },
  clipboard: {
    copiedTitle: 'Copied',
    copiedText: 'Share code copied to clipboard',
    statblockCopiedTitle: 'Statblock Copied to Clipboard',
    statblockCopiedText: 'Copy Success',
    statblockErrorTitle: 'Error',
    statblockErrorText: 'Unable to copy statblock',
  },
  campaign: {
    publishedTitle: 'Campaign Published',
    publishedText: (version: string, name: string) =>
      `Version ${version} of ${name} has been published.`,
    importCompleteTitle: 'Import Complete',
    importCompleteText: 'Campaign added to local collection!',
    importErrorTitle: 'Import Error',
    importErrorText: (error: string) => `Unable to transfer campaign: ${error}`,
    loginRequiredTitle: 'Login Required',
    loginRequiredText:
      'You must be logged in to upload campaign data to the cloud repository.',
  },
  encounter: {
    combatantAddedTitle: (name: string) => `${name} Added`,
    combatantAddedText: (name: string, encounterName: string) =>
      `An instance of ${name} was added to ${encounterName}.`,
  },
} as const
