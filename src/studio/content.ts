/**
 * Novaforge Interactive — site copy and data.
 *
 * Pure content module: no React, no three.js. Copy rules: concrete over
 * evocative, numbers over adjectives, sentence case everywhere. The palette
 * is fixed site-wide (ember on graphite, steel as the cool counterpoint) —
 * games are differentiated by their shader art, not by per-game colors.
 */

export interface Game {
  id: string
  title: string
  tagline: string
  description: string
  genre: string
  platforms: string
  status: string
  /** Which surface material the card's live key art uses (resolved in the page). */
  art: 'heatHaze' | 'voronoiCells' | 'bioluminescent'
  /** Per-game params for that material, tuned to the site palette. */
  artParams: Record<string, unknown>
}

export const GAMES: Game[] = [
  {
    id: 'axiom-drift',
    title: 'Axiom Drift',
    tagline: 'Momentum is the whole game.',
    description:
      'A 12-player anti-gravity racer where the racing line is yours to draw: magnetic drift rails can be laid, stolen and broken mid-corner. Ninety-second laps, one global ladder, full cross-play.',
    genre: 'Arcade racer',
    platforms: 'PC / PS5 / Xbox',
    status: 'Out now',
    art: 'heatHaze',
    artParams: { colorTop: '#0c0e12', colorBottom: '#ff6b3d', strength: 0.07, speed: 1.6, scale: 6 },
  },
  {
    id: 'neon-requiem',
    title: 'Neon Requiem',
    tagline: 'A city that rebuilds itself around your choices.',
    description:
      'An action RPG set in Veiled Harbor, a vertical city where districts physically change as factions gain or lose ground. Real-time combat, a 40-hour campaign, and no morality meter — just consequences you can walk through.',
    genre: 'Action RPG',
    platforms: 'PC / PS5',
    status: 'Coming 2027',
    art: 'voronoiCells',
    artParams: { scale: 7, speed: 0.35, lightRadius: 0.6, cellColor: '#e8a849', edgeColor: '#0c0e12' },
  },
  {
    id: 'voidborn',
    title: 'Voidborn',
    tagline: 'Four-player horror where light is the resource.',
    description:
      'Co-op survival horror aboard the seed ship Demeter. Power is scarce, sound carries, and the creature hunting you remembers the tactics that worked against it last run.',
    genre: 'Co-op horror',
    platforms: 'PC',
    status: 'In development',
    art: 'bioluminescent',
    artParams: { glow: '#7fa8a4', base: '#04060a', scale: 5, breath: 0.5, intensity: 1.2 },
  },
]

export interface LoreBlock {
  kicker: string
  title: string
  body: string
}

export const LORE: LoreBlock[] = [
  {
    kicker: 'The setting',
    title: 'Three games, one timeline.',
    body: 'Everything we ship takes place in the same fictional system, in the decades after a gate network called the Lattice was switched on. Axiom Drift is the boom years; Neon Requiem is the cities the boom built; Voidborn is what came back through the gates.',
  },
  {
    kicker: 'Persistence',
    title: 'What happens in one game is canon in the next.',
    body: 'Season results in Axiom Drift decide which wrecks end up orbiting the gates. Those same wrecks are boardable salvage sites in Voidborn. The link is a shared world database, not a marketing line.',
  },
  {
    kicker: 'The mystery',
    title: 'One long question, answered together.',
    body: 'A single storyline advances across all three games, moved forward by community discoveries rather than patch notes. Two of its five chapters have been solved since 2023.',
  },
  {
    kicker: 'Right now',
    title: 'Chapter three is open.',
    body: 'The current chapter, Signal Verses, started in March 2026. The first clue was a corrupted lap ghost in Axiom Drift; where it leads is still unsolved.',
  },
]

export interface TechPillar {
  name: string
  title: string
  body: string
}

export const TECH_PILLARS: TechPillar[] = [
  {
    name: 'Photon',
    title: 'Dynamic global illumination',
    body: 'Fully dynamic GI with no baked lighting, built for scenes that restructure themselves at runtime. When a district in Neon Requiem changes hands, the light follows in the same frame.',
  },
  {
    name: 'Lattice',
    title: 'Deterministic rollback netcode',
    body: 'One simulation core runs every title at a fixed 128 Hz tick — the same code paths for a 12-car grid at 300 km/h and a four-player crew spread across three continents.',
  },
  {
    name: 'Strata',
    title: 'Procedural streaming worlds',
    body: 'Tracks, cities and ships generate from small seeds and stream in place. No loading screens anywhere, and a full level fits inside a save file.',
  },
]

export interface Role {
  title: string
  team: string
  type: string
}

export const ROLES: Role[] = [
  { title: 'Senior Graphics Engineer', team: 'Forge Engine', type: 'Remote' },
  { title: 'Gameplay Engineer, Netcode', team: 'Lattice', type: 'Remote' },
  { title: 'Technical Artist', team: 'Neon Requiem', type: 'Remote / Hybrid' },
  { title: 'Narrative Designer', team: 'Universe', type: 'Remote' },
]
