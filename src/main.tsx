import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import LandingPage from './landing/LandingPage'
import StudioPage from './studio/StudioPage'
import ShowcasePage from './showcase/ShowcasePage'
import { DocsLayout } from './docs/DocsLayout'
import { DocsHome } from './docs/DocsHome'
import { ComponentDocPage } from './docs/ComponentDocPage'
import { GuidePage } from './docs/GuidePage'
import './index.css'

// BASE_URL is '/' in dev and dogfood, and the project path (e.g. '/easy-3dkit/')
// when built for GitHub Pages. Strip the trailing slash for the router basename.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/gallery" element={<App />} />
        <Route path="/studio" element={<StudioPage />} />
        <Route path="/showcase" element={<ShowcasePage />} />
        <Route path="/docs" element={<DocsLayout />}>
          <Route index element={<DocsHome />} />
          <Route path="guides/:slug" element={<GuidePage />} />
          <Route path=":id" element={<ComponentDocPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
