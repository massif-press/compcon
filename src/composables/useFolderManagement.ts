import * as _ from 'lodash-es'

type WithFolder = { FolderController: { Folder: string; FolderIndex: number } }

export function orderFolders<T extends WithFolder>(
  folders: string[],
  items: T[],
  sessionOrder: string[]
): string[] {
  const rank = (folder: string) => {
    const ranks = items
      .filter(x => x.FolderController.Folder === folder && x.FolderController.FolderIndex >= 0)
      .map(x => x.FolderController.FolderIndex)
    if (ranks.length) return Math.min(...ranks)
    const idx = sessionOrder.indexOf(folder)
    return idx === -1 ? Infinity : idx
  }
  return _.sortBy(folders, rank)
}

export function useFolderManagement<T extends WithFolder>(items: T[], folders: string[]) {
  return {
    AddFolder(payload: string): void {
      folders.push(payload)
    },
    EditFolder(payload: { old: string; newName: string }): void {
      items
        .filter(x => x.FolderController.Folder === payload.old)
        .forEach(x => {
          const rank = x.FolderController.FolderIndex
          x.FolderController.Folder = payload.newName
          x.FolderController.FolderIndex = rank
        })
      const idx = folders.findIndex(x => x === payload.old)
      if (idx !== -1) folders[idx] = payload.newName
    },
    RemoveFolder(payload: string): void {
      items
        .filter(x => x.FolderController.Folder === payload)
        .forEach(x => (x.FolderController.Folder = ''))
      const idx = folders.findIndex(x => x === payload)
      if (idx !== -1) folders.splice(idx, 1)
    },
    SetFolderOrder(order: string[]): void {
      items.forEach(x => {
        const idx = order.indexOf(x.FolderController.Folder)
        if (idx !== -1) x.FolderController.FolderIndex = idx
      })
    },
  }
}
