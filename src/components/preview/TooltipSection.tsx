'use client'

import { ComponentSection } from './ComponentSection'
import {
  TooltipOverviewTab,
  TooltipApiTab,
  TooltipUsageTab,
  TooltipCodeTab,
  TooltipStatesTab,
} from './docs/TooltipDocs'

export function TooltipSection() {
  return (
    <ComponentSection
      title="Tooltip"
      tabs={[
        { key: 'overview', label: 'Overview', content: <TooltipOverviewTab /> },
        { key: 'api',      label: 'API',      content: <TooltipApiTab /> },
        { key: 'usage',    label: 'Usage',    content: <TooltipUsageTab /> },
        { key: 'code',     label: 'Code',     content: <TooltipCodeTab /> },
        { key: 'states',   label: 'States',   content: <TooltipStatesTab /> },
      ]}
    />
  )
}
