import type { ComponentType } from 'react'
import { InstallGuide } from './InstallGuide'
import { FirstHeroGuide } from './FirstHeroGuide'
import { ScrollStateGuide } from './ScrollStateGuide'
import { SsrGuide } from './SsrGuide'
import { FallbackGuide } from './FallbackGuide'
import { PerformanceGuide } from './PerformanceGuide'

/**
 * Guide registry (docs layer).
 *
 * Plain TSX guides instead of MDX so the docs site stays on this app's single
 * toolchain (no extra MDX/markdown pipeline). Each guide is a component; this
 * list drives the docs sidebar and the `/docs/guides/:slug` route.
 */
export interface Guide {
  slug: string
  title: string
  /** One-line summary for the sidebar / index. */
  summary: string
  Component: ComponentType
}

export const guides: Guide[] = [
  {
    slug: 'install',
    title: 'Install',
    summary: 'Add the kit and its peer dependencies.',
    Component: InstallGuide,
  },
  {
    slug: 'first-hero',
    title: 'Your first hero',
    summary: 'A transparent 3D hero behind page content in 5 minutes.',
    Component: FirstHeroGuide,
  },
  {
    slug: 'scroll-and-state',
    title: 'Driving from scroll or state',
    summary: 'Bind effects to page scroll or your own app state.',
    Component: ScrollStateGuide,
  },
  {
    slug: 'nextjs-ssr',
    title: 'Next.js & SSR',
    summary: "App-router usage and the 'use client' boundary.",
    Component: SsrGuide,
  },
  {
    slug: 'webgl-fallback',
    title: 'WebGL fallback & accessibility',
    summary: 'Never blank the page; honor reduced motion.',
    Component: FallbackGuide,
  },
  {
    slug: 'performance-mobile',
    title: 'Performance & mobile',
    summary: 'dpr, demand frameloop, instance counts, lazy mounting.',
    Component: PerformanceGuide,
  },
]

export const guideBySlug = (slug: string) => guides.find((g) => g.slug === slug)
