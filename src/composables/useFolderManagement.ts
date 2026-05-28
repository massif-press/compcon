type WithFolder = { FolderController: { Folder: string } }

export function useFolderManagement<T extends WithFolder>(items: T[], folders: string[]) {
  return {
    AddFolder(payload: string): void {
      folders.push(payload)
    },
    EditFolder(payload: { old: string; newName: string }): void {
      items.filter(x => x.FolderController.Folder === payload.old).forEach(
        x => (x.FolderController.Folder = payload.newName)
      )
      const idx = folders.findIndex(x => x === payload.old)
      if (idx >= -1) folders[idx] = payload.newName
    },
    RemoveFolder(payload: string): void {
      items.filter(x => x.FolderController.Folder === payload).forEach(
        x => (x.FolderController.Folder = '')
      )
      const idx = folders.findIndex(x => x === payload)
      if (idx >= -1) folders.splice(idx, 1)
    },
  }
}
