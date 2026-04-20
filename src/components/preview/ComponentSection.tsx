'use client'

import { SectionHeader } from './SectionHeader'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import { cn } from '@/lib/utils'

type TabKey = 'variants' | 'sizes' | 'states'

interface Tab {
  key: TabKey
  label: string
  content: React.ReactNode
}

interface ComponentSectionProps {
  title: string
  docsHref?: string
  tabs?: Tab[]
  children?: React.ReactNode
  className?: string
}

export function ComponentSection({
  title,
  docsHref,
  tabs,
  children,
  className,
}: ComponentSectionProps) {
  return (
    <section className={cn('', className)}>
      <SectionHeader title={title} docsHref={docsHref} />
      {tabs ? (
        <Tabs defaultValue={tabs[0].key}>
          <TabsList variant="line" className="mb-6">
            {tabs.map((t) => (
              <TabsTrigger key={t.key} value={t.key}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((t) => (
            <TabsContent key={t.key} value={t.key}>
              {t.content}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        children
      )}
    </section>
  )
}
