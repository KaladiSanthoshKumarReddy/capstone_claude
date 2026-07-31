import client from './client'
import type { Item, ItemsResponse } from '../types'

export interface FetchParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  tag?: string
}

export async function fetchItems(params: FetchParams = {}): Promise<ItemsResponse> {
  const res = await client.get<ItemsResponse>('/items', { params })
  return res.data
}

export async function createItem(title: string, description?: string, tags?: string): Promise<{ id: number }> {
  const res = await client.post<{ success: boolean; data: { id: number } }>('/items', { title, description, tags })
  return res.data.data
}

export async function updateItem(id: number, patch: Partial<Pick<Item, 'title' | 'description' | 'status' | 'tags'>>): Promise<Item> {
  const res = await client.patch<{ success: boolean; data: Item }>(`/items/${id}`, patch)
  return res.data.data
}

export async function deleteItem(id: number): Promise<void> {
  await client.delete(`/items/${id}`)
}
