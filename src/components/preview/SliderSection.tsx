'use client'

import { ComponentSection } from './ComponentSection'
import {
  SliderOverviewTab,
  SliderApiTab,
  SliderUsageTab,
  SliderCodeTab,
  SliderStatesTab,
} from './docs/SliderDocs'

export function SliderSection() {
  return (
    <ComponentSection
      title="Slider"
      tabs={[
        { key: 'overview', label: 'Overview', content: <SliderOverviewTab /> },
        { key: 'api',      label: 'API',      content: <SliderApiTab /> },
        { key: 'usage',    label: 'Usage',    content: <SliderUsageTab /> },
        { key: 'code',     label: 'Code',     content: <SliderCodeTab /> },
        { key: 'states',   label: 'States',   content: <SliderStatesTab /> },
      ]}
    />
  )
}
