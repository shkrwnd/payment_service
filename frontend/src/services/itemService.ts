import { apiClient } from "../api";
import { API_ENDPOINTS } from "../constants";
import { Item, ItemCreate, ItemUpdate } from "../types";

export const getItems = async (): Promise<Item[]> => {
  const response = await apiClient.get<Item[]>(API_ENDPOINTS.ITEMS.LIST);
  return response.data;
};

export const getItem = async (id: number): Promise<Item> => {
  const response = await apiClient.get<Item>(API_ENDPOINTS.ITEMS.GET(id));
  return response.data;
};

export const createItem = async (data: ItemCreate): Promise<Item> => {
  const response = await apiClient.post<Item>(API_ENDPOINTS.ITEMS.CREATE, data);
  return response.data;
};

export const updateItem = async (id: number, data: ItemUpdate): Promise<Item> => {
  const response = await apiClient.put<Item>(API_ENDPOINTS.ITEMS.UPDATE(id), data);
  return response.data;
};

export const deleteItem = async (id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.ITEMS.DELETE(id));
};
