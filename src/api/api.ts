import RateLimiter, { FetchProxy } from './ratelimiter'
import {
  type User,
  type System,
  type Resource,
  type ShipType,
  type Fleet,
  type PostFleetActionResponse,
  type PostFleetBuyShipResponse,
  type PostFleetTransferBody,
  type PostFleetTransferResponse,
  type PostFleetTransferToStationBody,
  type MarketData,
  type Paginated,
  type MarketQuote,
  type MarketOrder,
  type PostInstantSellResponse,
  type PostInstantBuyResponse,
} from './types'

export class SpaceBotsApi {
  host: string
  getHeaders: HeadersInit
  postHeaders: HeadersInit

  fetchProxy: FetchProxy

  constructor() {
    this.host = import.meta.env.VITE_HOST
    this.getHeaders = {
      Authorization: `Bearer ${import.meta.env.VITE_KEY}`,
    }
    this.postHeaders = {
      Authorization: `Bearer ${import.meta.env.VITE_KEY}`,
      'Content-Type': 'application/json',
    }

    this.fetchProxy = new RateLimiter()
  }

  // Generic
  async Get<T>(url: string): Promise<T> {
    return await this.fetchProxy.Fetch(`${this.host}${url}`, {
      headers: this.getHeaders,
      mode: 'cors',
      credentials: 'omit',
    })
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

    return await this.fetchProxy.Fetch(`${this.host}${url}`, options)
  }

  // Users
  async GetUser(): Promise<User> {
    return await this.Get<User>('/users/me')
  }

  // Systems
  async GetSystem(systemId: string) {
    return await this.Get<System>(`/systems/${systemId}`)
  }

  async GetSystemFleets(systemId: string) {
    return await this.Get<Paginated<Fleet>>(`/systems/${systemId}/fleets`)
  }

  // Fleets
  async PostFleetTravel(fleetId: string, destinationSystemId: string) {
    return await this.Post<PostFleetActionResponse>(`/fleets/${fleetId}/travel`, {
      destinationSystemId,
    })
  }

  async PostFleetMine(fleetId: string) {
    return await this.Post<PostFleetActionResponse>(`/fleets/${fleetId}/mine`)
  }

  async PostFleetBuyShips(fleetId: string, shipsToBuy: { [key: string]: number }) {
    return await this.Post<PostFleetBuyShipResponse>(`/fleets/${fleetId}/buy-ships`, {
      shipsToBuy,
    })
  }

  async GetMyFleets() {
    return await this.Get<Fleet[]>('/fleets/my')
  }

  async GetFleet(fleetId: string) {
    return await this.Get<Fleet>(`/fleets/${fleetId}`)
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

  // Markets
  async GetSystemMarketData(systemId: string, resourceId: string) {
    return await this.Get<MarketData>(`/systems/${systemId}/market/resources/${resourceId}`)
  }

  async GetSystemSellOrders(systemId: string, resourceId: string) {
    return await this.Get<Paginated<MarketQuote>>(`/systems/${systemId}/market/resources/${resourceId}/sell-orders`)
  }

  async PostSystemMarketSellOrder(systemId: string, resourceId: string, payload: MarketQuote) {
    return await this.Post(`/systems/${systemId}/market/resources/${resourceId}/sell-orders`, payload)
  }

  async PostSystemMarketInstantSell(systemId: string, resourceId: string, payload: MarketOrder) {
    return await this.Post<PostInstantSellResponse>(
      `/systems/${systemId}/market/resources/${resourceId}/instant-sell`,
      payload,
    )
  }

  async GetSystemBuyOrders(systemId: string, resourceId: string) {
    return await this.Get<Paginated<MarketQuote>>(`/systems/${systemId}/market/resources/${resourceId}/buy-orders`)
  }

  async PostSystemMarketBuyOrder(systemId: string, resourceId: string, payload: MarketQuote) {
    return await this.Post(`/systems/${systemId}/market/resources/${resourceId}/buy-orders`, payload)
  }

  async PostSystemMarketInstantBuy(systemId: string, resourceId: string, payload: MarketOrder) {
    return await this.Post<PostInstantBuyResponse>(
      `/systems/${systemId}/market/resources/${resourceId}/instant-buy`,
      payload,
    )
  }

  async GetSystemMarketMyBuyOrders(systemId: string, resourceId: string) {
    return await this.Get<MarketQuote>(`/systems/${systemId}/market/resources/${resourceId}/buy-orders/my`)
  }

  async GetSystemMarketMySellOrders(systemId: string, resourceId: string) {
    return await this.Get<MarketQuote>(`/systems/${systemId}/market/resources/${resourceId}/sell-orders/my`)
  }

  // Ship Types
  async GetShipTypes() {
    return await this.Get<ShipType[]>('/ship-types')
  }

  // Resources
  async GetResources() {
    return await this.Get<Resource[]>('/resources')
  }
}
