import RateLimiter from './ratelimiter'
import type {
  User,
  System,
  Resource,
  ShipType,
  Fleet,
  PostFleetActionResponse,
  PostFleetBuyShipResponse,
  PostFleetTransferBody,
  PostFleetTransferResponse,
  PostFleetTransferToStationBody,
} from './types'

export class SpaceBotsApi {
  host: string
  getHeaders: HeadersInit
  postHeaders: HeadersInit

  rateLimiter: RateLimiter

  constructor() {
    this.host = import.meta.env.VITE_HOST
    this.getHeaders = {
      Authorization: `Bearer ${import.meta.env.VITE_KEY}`,
    }
    this.postHeaders = {
      Authorization: `Bearer ${import.meta.env.VITE_KEY}`,
      'Content-Type': 'application/json',
    }

    this.rateLimiter = new RateLimiter()
  }

  async Get<T>(url: string): Promise<T> {
    return await this.rateLimiter.Fetch(`${this.host}${url}`, {
      headers: this.getHeaders,
      mode: 'cors',
      credentials: 'omit',
    })
  }

  async GetUser(): Promise<User> {
    return await this.Get<User>('/users/me')
  }

  async GetFleet(fleetId: string): Promise<Fleet> {
    return await this.Get<Fleet>(`/fleets/${fleetId}`)
  }

  async GetMyFleets(): Promise<Fleet[]> {
    return await this.Get<Fleet[]>('/fleets/my')
  }

  async GetResources(): Promise<Resource[]> {
    return await this.Get<Resource[]>('/resources')
  }

  async GetShipTypes(): Promise<ShipType[]> {
    return await this.Get<ShipType[]>('/ship-types')
  }

  async GetSystem(systemId: string): Promise<System> {
    return await this.Get<System>(`/systems/${systemId}`)
  }

  async Post<T>(url: string, body?: any): Promise<T> {
    const options: RequestInit = {
      method: 'POST',
      headers: this.postHeaders,
      mode: 'cors',
      credentials: 'omit',
    }

    if (body !== undefined && body !== null) {
      options.body = JSON.stringify(body)
    }

    return await this.rateLimiter.Fetch(`${this.host}${url}`, options)
  }

  async PostFleetTravel(
    fleetId: string,
    destinationSystemId: string,
  ): Promise<PostFleetActionResponse> {
    return await this.Post<PostFleetActionResponse>(`/fleets/${fleetId}/travel`, {
      destinationSystemId,
    })
  }

  async PostFleetMine(fleetId: string): Promise<PostFleetActionResponse> {
    return await this.Post<PostFleetActionResponse>(`/fleets/${fleetId}/mine`)
  }

  async PostFleetBuyShips(fleetId: string, shipsToBuy: { [key: string]: number }) {
    return await this.Post<PostFleetBuyShipResponse>(`/fleets/${fleetId}/buy-ships`, {
      shipsToBuy,
    })
  }

  async PostFleetDirectSell(fleetId: string, resources: { [key: string]: number }) {
    return await this.Post<PostFleetBuyShipResponse>(`/fleets/${fleetId}/direct-sell`, {
      resources,
    })
  }

  async PostFleetTransfer(fleetId: string, payload: PostFleetTransferBody) {
    return await this.Post<PostFleetTransferResponse>(`/fleets/${fleetId}/transfer`, payload)
  }

  async PostFleetTransferToStation(fleetId: string, payload: PostFleetTransferToStationBody) {
    return await this.Post(`/fleets/${fleetId}/transfer-to-station`, payload)
  }
}
