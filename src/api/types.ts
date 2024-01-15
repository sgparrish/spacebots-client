export interface User {
  id: string
  name: string
  credits: number
  registeredAt: string
  registerdd: boolean
}

export interface System {
  id: string
  name: string
  x: number
  y: number
  asteroid?: {
    miningResourceId: string
  }
  station?: {
    buyShips: boolean
    directSell: boolean
    cargo: { [key: string]: number }
  }
  neighboringSystems: {
    systemId: string
  }[]
}

export interface Resource {
  id: string
  name: string
  price: number
}

export interface ShipType {
  id: string
  name: string
  price: number
}

export enum FleetOwnerTypeEnum {
  User = 'user',
}

export enum FleetCurrentActionTypeEnum {
  Mining = 'mining',
  Traveling = 'traveling',
}

export interface Fleet {
  id: string
  owner: {
    type: FleetOwnerTypeEnum
    userId: string
  }
  locationSystemId: string | null
  currentAction: {
    type: FleetCurrentActionTypeEnum
    finishTime?: string
    departureTime?: string
    arrivalTime?: string
    travelingFromSystemId?: string
    travelingToSystemId?: string
  } | null
  cargo: { [key: string]: number }
  ships: { [key: string]: number }
}

export interface PostFleetActionResponse {
  arrivalTime: string
  duration: number
}

export interface PostFleetBuyShipResponse {
  creditsSpent: number
}

export interface PostFleetDirectSellResponse {
  creditsGained: number
}

export interface PostFleetTransferBody {
  targetFleetId?: string
  resourcesFromFleetToTarget?: { [key: string]: number }
  resourcesFromTargetToFleet?: { [key: string]: number }
  shipsFromFleetToTarget?: { [key: string]: number }
  shipsFromTargetToFleet?: { [key: string]: number }
}

export interface PostFleetTransferResponse {
  newFleetId: string
}

export interface PostFleetTransferToStationBody {
  resourcesFromFleetToStation?: { [key: string]: number }
  resourcesFromStationToFleet?: { [key: string]: number }
}
