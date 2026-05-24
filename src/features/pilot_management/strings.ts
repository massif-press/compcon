export const PM_STRINGS = {
  loadout: {
    armorEquippedTitle: 'Pilot Armor Equipped',
    gearEquippedTitle: 'Pilot Gear Equipped',
    weaponEquippedTitle: 'Pilot Weapon Equipped',
    systemInstalledTitle: 'Mech System Installed',
    equippedText: (itemName: string, pilotName: string) => `${itemName} equipped to ${pilotName}.`,
    systemInstalledText: (name: string) => `${name} added.`,
  },
  import: {
    v2BackupTitle: 'v2 Import Backup',
    importSuccessTitle: 'Import Successful',
    importErrorTitle: 'Import Error',
    importSuccessText: (name: string, callsign: string) =>
      `${name} // ${callsign} successfully added to roster.`,
    importErrorText: (error: string) => `Unable to read file: ${error}`,
    v2BackupText: (callsign: string) =>
      `${callsign} saved to pending v2 imports in the Content Manager.`,
  },
  export: {
    exportSuccessTitle: 'Export Success',
    exportErrorTitle: 'Export Error',
    exportErrorText: 'COMP/CON was unable to export pilot data',
    exportSuccessText: (callsign: string) => `Pilot data saved as "${callsign}.json"`,
  },
  sync: {
    syncCompleteTitle: 'Sync Complete',
    syncFailedTitle: 'Sync Failed',
    syncCompleteText: (callsign: string, name: string) => `Pilot ${callsign} // ${name} synced.`,
    syncFailedText: (callsign: string, name: string, err: string) =>
      `Failed to sync Pilot ${callsign} // ${name}. ${err}`,
  },
  statblock: {
    copiedTitle: 'Statblock Copied to Clipboard',
    copiedText: 'Copy Success',
    errorTitle: 'Error',
    errorText: 'Unable to copy statblock',
  },
} as const
