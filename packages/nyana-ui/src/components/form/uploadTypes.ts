
export interface NyUploadFile {
  name: string
  size: number
  type: string
  status: 'ready' | 'success' | 'error'
  url?: string
  message?: string
}
