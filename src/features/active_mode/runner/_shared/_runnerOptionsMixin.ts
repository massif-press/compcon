import logger from '@/user/logger'

export const runnerOptionsMixin = {
  data() {
    return {
      fileValue: null as File | null,
      importObj: null as any,
      importOk: false,
      importError: '',
      saveUpdate: Date.now(),
    }
  },
  methods: {
    reset(this: any) {
      this.fileValue = null
      this.importObj = null
      this.importOk = false
      this.importError = ''
    },
    exportStateFile(this: any, data: any, filename: string): void {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = filename
      link.click()
      URL.revokeObjectURL(link.href)
    },
    stageImportFile(this: any, itemType: string, errorMessage: string): void {
      if (!this.fileValue) {
        this.importOk = false
        return
      }
      const reader = new FileReader()
      reader.onload = (e: any) => {
        try {
          const result = e.target.result
          this.importObj = JSON.parse(result)
          if (!this.importObj) {
            this.importOk = false
            return
          }
          if (!(this.importObj as any).itemType || (this.importObj as any).itemType !== itemType) {
            this.importError = errorMessage
            this.importOk = false
            return
          }
          this.importOk = true
        } catch (error) {
          logger.error('Failed to parse import file', null, error)
          this.importError = 'Invalid JSON file.'
          this.importOk = false
        }
      }
      reader.readAsText(this.fileValue)
    },
  },
}
