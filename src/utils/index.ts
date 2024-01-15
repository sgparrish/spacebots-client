import colors from 'vuetify/util/colors'

import { Fleet, Resource, ShipType, System } from '@/api'

import aluminium from '@/assets/aluminium.svg?url'
import mithril from '@/assets/mithril.svg?url'
import titanium from '@/assets/titanium.svg?url'
import zinc from '@/assets/zinc.svg?url'
import zirconium from '@/assets/zirconium.svg?url'
import { getUuidColor, getUuidAnimal, getUuidName } from './humanUuid'

const tokenSearch = <T extends object>(
  list: T[],
  search: string,
  objectAdapter: (e: T, i: number, a: T[]) => {} = (e) => e,
) => {
  const tokens = search
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 2)
    .map((t) => new RegExp(t, 'g'))

  if (tokens.length === 0) return list

  const scores = list.map((item, i, a) => {
    const keys = Object.values(objectAdapter(item, i, a)).map(
      (v) => (v?.toString().toLowerCase() ?? '') as string,
    )
    const matchesByToken = tokens.map((t) =>
      keys.reduce((sum, v) => sum + (v.match(t)?.length ?? 0), 0),
    )
    const matches = matchesByToken.filter((x) => x > 0).length
    const totalMatches = matchesByToken.reduce((sum, x) => sum + x, 0)
    return { item, matches, totalMatches }
  })

  return scores
    .filter(({ matches }) => matches > 0)
    .toSorted((a, b) =>
      a.matches !== b.matches ? b.matches - a.matches : b.totalMatches - a.totalMatches,
    )
    .map(({ item }) => item)
}

export const hexToRgb: (hex: string) => number[] = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result && result.length === 4
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0]
}

const RARITY_COLORS = [
  colors.green.darken1,
  colors.lightBlue.darken2,
  colors.deepPurple.lighten1,
  colors.orange.base,
  colors.pink.darken2,
]

const RESOURCE_COLORS = new Map<string, string>()

export const getResourceColor = (
  resources: Map<string, Resource>,
  resourceId: string | undefined,
) => {
  if (resourceId === undefined) return undefined
  if (RESOURCE_COLORS.has(resourceId)) return RESOURCE_COLORS.get(resourceId)

  if (resources.size === 0) return undefined

  const res = Array.from(resources.values()).toSorted()
  res.sort((a, b) => a.price - b.price)
  res.forEach((x, i) => RESOURCE_COLORS.set(x.id, RARITY_COLORS[i]))
  return RESOURCE_COLORS.get(resourceId)
}

const RESOURCE_ICONS: { [key: string]: string } = {
  aluminium,
  mithril,
  titanium,
  zinc,
  zirconium,
}

export const getResourceIconUrl = (resourceId: string): string | undefined => {
  return RESOURCE_ICONS[resourceId] || undefined
}

const DEFAULT_COLOR = 'rgb(var(--v-theme-on-surface))'
const STATION_COLOR = colors.lime.base

export const getSystemColor = (resources: Map<string, Resource>, system: System | undefined) => {
  if (system?.station?.buyShips || system?.station?.directSell) return STATION_COLOR
  return getResourceColor(resources, system?.asteroid?.miningResourceId) || DEFAULT_COLOR
}

export const isSystemEmpty = (system: System) => {
  return (
    !system.station?.buyShips && !system.station?.directSell && !system.asteroid?.miningResourceId
  )
}

const SHIP_TYPE_COLORS = new Map<string, string>()

export const getShipTypeColor = (
  shipTypes: Map<string, ShipType>,
  shipTypeId: string | undefined,
) => {
  if (shipTypeId === undefined) return undefined
  if (SHIP_TYPE_COLORS.has(shipTypeId)) return SHIP_TYPE_COLORS.get(shipTypeId)

  if (shipTypes.size === 0) return undefined

  const res = Array.from(shipTypes.values())
  res.sort((a, b) => a.price - b.price)
  res.forEach((x, i) => SHIP_TYPE_COLORS.set(x.id, RARITY_COLORS[i]))
  return SHIP_TYPE_COLORS.get(shipTypeId)
}

export const getFleetColor = (fleetId: string) => getUuidColor(fleetId)

export const getFleetIcon = (fleetId: string) => getUuidAnimal(fleetId)

export const getFleetName = (fleetId: string) => getUuidName(fleetId)

export const searchFleets = (fleets: Fleet[], search: string) =>
  tokenSearch(fleets, search, (x) => ({
    id: x.id,
    name: getFleetName(x.id),
    owner: x.owner.userId,
    location:
      x.locationSystemId ||
      `${x.currentAction?.travelingFromSystemId} -> ${x.currentAction?.travelingToSystemId}`,
    action: x.currentAction?.type || 'idle',
    ships: Object.entries(x.ships)
      .map((x) => x.join(' '))
      .join(', '),
    cargo: Object.entries(x.cargo)
      .map((x) => x.join(' '))
      .join(', '),
  }))
