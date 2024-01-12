import dayjs from 'dayjs'
import { defineStore } from 'pinia'

import {
  SpaceBotsApi,
  User,
  System,
  Resource,
  ShipType,
  Fleet,
  PostFleetTransferBody,
  PostFleetTransferToStationBody,
} from '@/api'
import {
  getResourceColor,
  getSystemColor,
  getShipTypeColor,
  isSystemEmpty,
  getFleetColor,
  getFleetIcon,
  getFleetName,
} from '@/utils'

const SB_API = new SpaceBotsApi()

export const useAppStore = defineStore('app', {
  state: () => ({
    selectedSystem: <string | undefined>undefined,

    user: <User | undefined>undefined,
    fleets: new Map<string, Fleet>(),
    systems: new Map<string, System>(),
    resources: new Map<string, Resource>(),
    shipTypes: new Map<string, ShipType>(),

    loadingFleets: new Set<string>(),
  }),
  actions: {
    initialFetch() {
      this.fetchUser()
      this.fetchFleets()
      this.fetchSystems()
      this.fetchResources()
      this.fetchShipTypes()
    },
    async fetchUser() {
      try {
        this.user = await SB_API.GetUser()
      } catch (ex) {
        /* empty */
      }
    },
    async fetchFleets() {
      try {
        const fleets = await SB_API.GetMyFleets()
        this.fleets = new Map(fleets.map((f) => [f.id, f]))
        fleets.forEach(this.scheduleFleetRefreshIfNeeded)
      } catch (ex) {
        /* empty */
      }
    },
    async fetchSystem(systemId: string) {
      try {
        const system = await SB_API.GetSystem(systemId)
        this.systems.set(system.id, system)
      } catch (ex) {
        /* empty */
      }
    },
    async fetchSystems(startSystemId: string = 'omega', maxDepth: number = 5) {
      this.systems = new Map<string, System>()

      const queue = [{ id: startSystemId, depth: 0 }]
      const requested = new Set<string>()

      let timeoutId = 0
      const scheduleLoad = () => {
        if (timeoutId === 0) timeoutId = window.setTimeout(loadQueue, 0)
      }

      const loadQueue = (() => {
        timeoutId = 0
        queue.splice(0, queue.length).forEach(({ id, depth }) => {
          if (
            !this.systems.has(id) && // we've not already been here
            depth <= maxDepth // we're not beyond max depth
          ) {
            SB_API.GetSystem(id).then((system) => {
              this.systems.set(system.id, system)
              system.neighboringSystems.forEach(({ systemId }) => {
                if (!requested.has(systemId)) {
                  requested.add(systemId)
                  queue.push({ id: systemId, depth: depth + 1 })
                  scheduleLoad()
                }
              })
            })
          }
        })
      }).bind(this)

      scheduleLoad()
    },
    async fetchResources() {
      try {
        const resources = await SB_API.GetResources()
        this.resources = new Map(resources.map((r) => [r.id, r]))
      } catch (ex) {
        /* empty */
      }
    },
    async fetchShipTypes() {
      try {
        const shipTypes = await SB_API.GetShipTypes()
        this.shipTypes = new Map(shipTypes.map((s) => [s.id, s]))
      } catch (ex) {
        /* empty */
      }
    },

    async fetchFleet(fleetId: string) {
      try {
        this.loadingFleets.add(fleetId)
        const fleet = await SB_API.GetFleet(fleetId)
        this.loadingFleets.delete(fleetId)
        this.fleets.set(fleetId, fleet)
        this.scheduleFleetRefreshIfNeeded(fleet)
      } catch (ex) {
        if (this.fleets.has(fleetId)) this.fleets.delete(fleetId)
      }
    },
    async moveFleet(fleetId: string, destinationSystemId: string) {
      try {
        this.loadingFleets.add(fleetId)
        await SB_API.PostFleetTravel(fleetId, destinationSystemId)
        this.fetchFleet(fleetId)
      } catch (ex) {
        /* empty */
      }
    },
    async mine(fleetId: string) {
      try {
        this.loadingFleets.add(fleetId)
        await SB_API.PostFleetMine(fleetId)
        this.fetchFleet(fleetId)
      } catch (ex) {
        /* empty */
      }
    },
    async buyShips(fleetId: string, shipsToBuy: { [key: string]: number }) {
      try {
        this.loadingFleets.add(fleetId)
        await SB_API.PostFleetBuyShips(fleetId, shipsToBuy)
        this.fetchFleet(fleetId)
        this.fetchUser()
      } catch (ex) {
        /* empty */
      }
    },
    async directSell(fleetId: string, resources: { [key: string]: number }) {
      try {
        this.loadingFleets.add(fleetId)
        await SB_API.PostFleetDirectSell(fleetId, resources)
        this.fetchFleet(fleetId)
        this.fetchUser()
      } catch (ex) {
        /* empty */
      }
    },
    async transfer(fleetId: string, payload: PostFleetTransferBody) {
      try {
        this.loadingFleets.add(fleetId)
        if (payload.targetFleetId) this.loadingFleets.add(payload.targetFleetId)
        const response = await SB_API.PostFleetTransfer(fleetId, payload)
        if (payload.targetFleetId) this.fetchFleet(payload.targetFleetId)
        if (response?.newFleetId) this.fetchFleet(response?.newFleetId)
        this.fetchFleet(fleetId)
      } catch (ex) {
        /* empty */
      }
    },
    async transferToStation(fleetId: string, payload: PostFleetTransferToStationBody) {
      try {
        this.loadingFleets.add(fleetId)
        await SB_API.PostFleetTransferToStation(fleetId, payload)
        this.fetchFleet(fleetId)
        if (this.fleets.get(fleetId)?.locationSystemId)
          this.fetchSystem(this.fleets.get(fleetId)?.locationSystemId as string)
      } catch (ex) {
        /* empty */
      }
    },

    scheduleFleetRefreshIfNeeded(fleet: Fleet) {
      if (fleet.currentAction !== null) {
        const timeStamp = fleet.currentAction.arrivalTime || fleet.currentAction.finishTime
        if (timeStamp) {
          const msToWait = dayjs(timeStamp).diff()
          window.setTimeout(() => this.fetchFleet.bind(this)(fleet.id), msToWait)
        }
      }
    },

    setSelectedSystem(systemId: string[]) {
      if (systemId.length === 0) this.selectedSystem = undefined
      else this.selectedSystem = systemId[0]
    },
  },
  getters: {
    getUser: (state) => state.user,
    getFleets: (state) => Array.from(state.fleets.values()),
    getSystems: (state) => Array.from(state.systems.values()),
    getResources: (state) => Array.from(state.resources.values()).toSorted((a, b) => a.price - b.price),
    getShipTypes: (state) => Array.from(state.shipTypes.values()).toSorted((a, b) => a.price - b.price),

    getSystemById: (state) => (systemId: string) => state.systems.get(systemId),
    getFleetById: (state) => (fleetId: string) => state.fleets.get(fleetId),
    getResourceById: (state) => (resourceId: string) => state.resources.get(resourceId),
    getShipTypeById: (state) => (shipTypeId: string) => state.shipTypes.get(shipTypeId),

    getSelectedSystem: (state) =>
      state.selectedSystem ? state.systems.get(state.selectedSystem) : undefined,

    isSystemEmpty: () => (system: System) => isSystemEmpty(system),
    getCargoValue: (state) => (cargo: { [key: string]: number }) =>
      Object.entries(cargo).reduce(
        (sum, [type, count]) => sum + (state.resources.get(type)?.price ?? 0) * count,
        0,
      ),
    isFleetLoading: (state) => (fleetId: string) => state.loadingFleets.has(fleetId),

    getSystemColor: (state) => (system: System) => getSystemColor(state.resources, system),
    getResourceColor: (state) => (resourceId: string) =>
      getResourceColor(state.resources, resourceId),
    getShipTypeColor: (state) => (shipTypeId: string) =>
      getShipTypeColor(state.shipTypes, shipTypeId),
    getFleetColor: () => (fleetId: string) => getFleetColor(fleetId),
    getFleetIcon: () => (fleetId: string) => getFleetIcon(fleetId),
    getFleetName: () => (fleetId: string) => getFleetName(fleetId),
  },
})
