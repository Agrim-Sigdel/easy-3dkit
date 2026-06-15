import { useParams, Navigate } from 'react-router-dom'
import { guideBySlug } from './guides/registry'

/** GuidePage — renders the guide component matching /docs/guides/:slug. */
export function GuidePage() {
  const { slug } = useParams<{ slug: string }>()
  const guide = slug ? guideBySlug(slug) : undefined
  if (!guide) return <Navigate to="/docs" replace />
  const { Component } = guide
  return <Component />
}
