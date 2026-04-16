/**
 * shadcn/ui registry format types.
 * Spec: https://ui.shadcn.com/docs/registry/registry-item-json
 */

export type RegistryItemType =
  | "registry:theme"
  | "registry:style"
  | "registry:lib"
  | "registry:block"
  | "registry:component"
  | "registry:ui"
  | "registry:hook"
  | "registry:page"

export interface CssVarsTokens {
  [cssVariable: string]: string
}

export interface CssVarsMap {
  light?: CssVarsTokens
  dark?: CssVarsTokens
  theme?: CssVarsTokens
}

export interface RegistryFile {
  path: string
  content?: string
  type: RegistryItemType
  target?: string
}

export interface RegistryEntry {
  $schema?: string
  name: string
  type: RegistryItemType
  title?: string
  description?: string
  author?: string
  license?: string
  tags?: string[]
  cssVars?: CssVarsMap
  files?: RegistryFile[]
  dependencies?: string[]
  devDependencies?: string[]
  registryDependencies?: string[]
  meta?: Record<string, unknown>
}
