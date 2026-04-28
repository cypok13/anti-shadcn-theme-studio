'use client'

import { ComponentSection } from './ComponentSection'
import {
  SelectOverviewTab,
  SelectApiTab,
  SelectUsageTab,
  SelectCodeTab,
  SelectStatesTab,
} from './docs/SelectDocs'

export function SelectSection() {
  return (
    <ComponentSection
      title="Select"
      tabs={[
        { key: 'overview', label: 'Overview', content: <SelectOverviewTab /> },
        { key: 'api',      label: 'API',      content: <SelectApiTab /> },
        { key: 'usage',    label: 'Usage',    content: <SelectUsageTab /> },
        { key: 'code',     label: 'Code',     content: <SelectCodeTab /> },
        { key: 'states',   label: 'States',   content: <SelectStatesTab /> },
      ]}
    />
  )
}
