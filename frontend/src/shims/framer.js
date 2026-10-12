/**
 * Minimal Framer Studio API shim so marketplace components can run in Vite.
 * Property controls are no-ops outside the Framer canvas.
 */

export const ControlType = {
  Boolean: 'boolean',
  Number: 'number',
  String: 'string',
  Color: 'color',
  Enum: 'enum',
  Array: 'array',
  Object: 'object',
  Font: 'font',
  Image: 'image',
  File: 'file',
  Link: 'link',
  ResponsiveImage: 'responsiveimage',
  ComponentInstance: 'componentinstance',
  Transition: 'transition',
  BoxShadow: 'boxshadow',
  BorderRadius: 'borderradius',
  Padding: 'padding',
  Border: 'border',
}

export const RenderTarget = {
  canvas: 'canvas',
  export: 'export',
  preview: 'preview',
  current: () => 'preview',
}

export function addPropertyControls() { }

export function useIsStaticRenderer() {
  return false
}

export function useLocaleInfo() {
  return { activeLocale: null, setLocale: () => { }, locales: [] }
}

export function useComponentViewport() {
  return null
}

export function withCSS(Component) {
  return Component
}

export function addFonts() { }

export function getFonts() {
  return []
}

export function cx(...parts) {
  return parts.filter(Boolean).join(' ')
}

export const Link = 'a'
export const RichText = 'div'
export const motion = undefined
