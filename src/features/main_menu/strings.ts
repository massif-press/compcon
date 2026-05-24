export const MAIN_MENU_STRINGS = {
  account: {
    imageDeletedTitle: 'Image Deleted',
    imageDeletedText: (itemType: string, name: string) => `Removed ${itemType} ${name}.`,
    deletionFailedTitle: 'Deletion Failed',
    deletionFailedText: (err: string) => `Unable to communicate with server. ${err}`,
    lcpUpdatedTitle: 'LCP Updated',
    lcpUpdatedText: (title: string) =>
      `The latest version of ${title} has been downloaded and installed.`,
    lcpUpdateErrorTitle: 'Error Updating LCP',
    lcpUpdateErrorText: (title: string) =>
      `An error occurred while attempting to download ${title}.`,
    allLcpsUpdatedTitle: 'LCPs Updated',
    allLcpsUpdatedText: 'All LCPs have been updated.',
    allLcpsUpdateErrorTitle: 'Error Updating LCPs',
    allLcpsUpdateErrorText: 'An error occurred while attempting to update your LCPs.',
    syncPartialTitle: (synced: number, total: number) => `${synced}/${total} Items Synced`,
    syncPartialText: (failures: number) =>
      `Failed to fully sync ${failures} items. This may be due to missing local data.`,
    syncCompleteTitle: (total: number) => `${total}/${total} Items Synced`,
    syncCompleteText: 'All items were successfully synced.',
    deletionCompleteTitle: (count: number) =>
      `${count} Item${count !== 1 ? 's' : ''} Permanently Deleted`,
    deletionFailedBulkText: 'An error occurred while deleting flagged items.',
    collectionErrorTitle: 'Error Updating Collection',
    collectionErrorText: 'There was an error updating the collection. Please try again later.',
    collectionUpdatedTitle: 'Collection Updated',
    collectionUpdatedText: 'Collection items have been updated successfully.',
    itemAddedTitle: 'Item Added',
    itemAddedText: (name: string) => `Item ${name} added to collection`,
    jwtCopiedTitle: 'JWT Copied',
    jwtCopiedText: 'ID token copied to clipboard',
    jwtCopyFailedTitle: 'JWT Copy Failed',
  },
  auth: {
    accountCreated: 'User Account created successfully. Redirecting to Sign-In.',
    verificationSent: (email: string) => `New verification e-mail sent to ${email}`,
    passwordChangedTitle: 'Success',
    passwordChangedText: 'Password changed successfully.',
    passwordResetErrorText: (msg: string) => `Unable to send reset e-mail: ${msg}`,
    passwordChangeErrorText: (msg: string) => `Unable to change password: ${msg}`,
  },
} as const
