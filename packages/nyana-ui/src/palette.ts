export interface NyPaletteColor {
  name: string
  label: string
  value: string
  light: string
  bg: string
  deep: string
  text: string
  on: string
}

export const nyPalette: NyPaletteColor[] = [
  { name: 'red', label: '珊瑚红', value: '#f29292', light: '#f7caca', bg: 'rgba(242, 146, 146, 0.16)', deep: '#9c2525', text: '#cd2323', on: '#ffffff' },
  { name: 'orange', label: '落日橘', value: '#f2b592', light: '#f7daca', bg: 'rgba(242, 181, 146, 0.16)', deep: '#9c5125', text: '#cd6123', on: '#68381d' },
  { name: 'amber', label: '琥珀黄', value: '#f2da92', light: '#f7ebca', bg: 'rgba(242, 218, 146, 0.16)', deep: '#9c7f25', text: '#cda223', on: '#68551d' },
  { name: 'lemon', label: '柠檬黄', value: '#e5f292', light: '#f1f7ca', bg: 'rgba(229, 242, 146, 0.16)', deep: '#8c9c25', text: '#b6cd23', on: '#5e681d' },
  { name: 'lime', label: '青柠绿', value: '#bff292', light: '#dff7ca', bg: 'rgba(191, 242, 146, 0.16)', deep: '#5d9c25', text: '#73cd23', on: '#40681d' },
  { name: 'grass', label: '草甸绿', value: '#95f292', light: '#ccf7ca', bg: 'rgba(149, 242, 146, 0.16)', deep: '#299c25', text: '#28cd23', on: '#1f681d' },
  { name: 'bamboo', label: '竹林青', value: '#92f2b5', light: '#caf7da', bg: 'rgba(146, 242, 181, 0.16)', deep: '#259c51', text: '#23cd61', on: '#1d6838' },
  { name: 'mint', label: '薄荷绿', value: '#92f2d6', light: '#caf7ea', bg: 'rgba(146, 242, 214, 0.16)', deep: '#259c7a', text: '#23cd9b', on: '#1d6852' },
  { name: 'teal', label: '青碧色', value: '#92eef2', light: '#caf5f7', bg: 'rgba(146, 238, 242, 0.16)', deep: '#25979c', text: '#23c6cd', on: '#1d6568' },
  { name: 'sky', label: '天空蓝', value: '#5bcffa', light: '#c6edfb', bg: 'rgba(91, 207, 250, 0.16)', deep: '#1a82a8', text: '#12a6dd', on: '#ffffff' },
  { name: 'azure', label: '湖蓝', value: '#92b8f2', light: '#cadcf7', bg: 'rgba(146, 184, 242, 0.16)', deep: '#25559c', text: '#2366cd', on: '#1d3a68' },
  { name: 'indigo', label: '靛蓝', value: '#929af2', light: '#cacef7', bg: 'rgba(146, 154, 242, 0.16)', deep: '#252f9c', text: '#2331cd', on: '#ffffff' },
  { name: 'violet', label: '紫罗兰', value: '#7c6bf5', light: '#cec8f9', bg: 'rgba(124, 107, 245, 0.16)', deep: '#2f1fa3', text: '#311ad6', on: '#ffffff' },
  { name: 'purple', label: '紫藤色', value: '#c592f2', light: '#e2caf7', bg: 'rgba(197, 146, 242, 0.16)', deep: '#65259c', text: '#7d23cd', on: '#ffffff' },
  { name: 'magenta', label: '品红', value: '#f292f2', light: '#f7caf7', bg: 'rgba(242, 146, 242, 0.16)', deep: '#9c259c', text: '#cd23cd', on: '#ffffff' },
  { name: 'pink', label: '樱粉', value: '#f5a9b8', light: '#f7cad3', bg: 'rgba(245, 169, 184, 0.16)', deep: '#9d253d', text: '#cd2244', on: '#681d2b' },
]

export function nyPaletteColor(name: string): string | undefined {
  return nyPalette.find((color) => color.name === name)?.value
}

export function nyPaletteText(name: string): string | undefined {
  return nyPalette.find((color) => color.name === name)?.text
}

export default nyPalette
