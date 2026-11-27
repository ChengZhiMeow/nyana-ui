import { nyMessage } from '../message/message'

// 复制到剪贴板; 不支持 clipboard API 的环境退回到 textarea + execCommand
export async function nyCopy(text: string, tip: string | false = '已复制'): Promise<boolean> {
  let ok = false
  try {
    await navigator.clipboard.writeText(text)
    ok = true
  } catch {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    try {
      ok = document.execCommand('copy')
    } catch {
      ok = false
    }
    area.remove()
  }
  if (tip !== false) {
    if (ok) nyMessage.success(tip)
    else nyMessage.error('复制失败, 请手动选择文字复制')
  }
  return ok
}
