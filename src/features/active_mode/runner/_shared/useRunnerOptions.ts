import { ref } from 'vue'

function useRunnerOptions() {
  const fileValue = ref<File | null>(null)
  const importObj = ref<any>(null)
  const importOk = ref(false)
  const importError = ref('')
  const saveUpdate = ref(Date.now())

  function reset() {
    fileValue.value = null
    importObj.value = null
    importOk.value = false
    importError.value = ''
  }

  function exportStateFile(data: any, filename: string): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
    URL.revokeObjectURL(link.href)
  }

  function stageImportFile(itemType: string, errorMessage: string): void {
    if (!fileValue.value) {
      importOk.value = false
      return
    }
    const reader = new FileReader()
    reader.onload = (e: any) => {
      try {
        const result = e.target.result
        importObj.value = JSON.parse(result)
        if (!importObj.value) {
          importOk.value = false
          return
        }
        if (!importObj.value.itemType || importObj.value.itemType !== itemType) {
          importError.value = errorMessage
          importOk.value = false
          return
        }
        importOk.value = true
      } catch (error) {
        console.error('Failed to parse import file:', error)
        importError.value = 'Invalid JSON file.'
        importOk.value = false
      }
    }
    reader.readAsText(fileValue.value)
  }

  return { fileValue, importObj, importOk, importError, saveUpdate, reset, exportStateFile, stageImportFile }
}

export { useRunnerOptions }
