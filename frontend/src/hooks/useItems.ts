import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as itemService from "../services/itemService";
import { ItemCreate, ItemUpdate } from "../types";

export const useItems = () => {
  return useQuery({
    queryKey: ["items"],
    queryFn: itemService.getItems,
  });
};

export const useItem = (id: number | null) => {
  return useQuery({
    queryKey: ["items", id],
    queryFn: () => itemService.getItem(id!),
    enabled: id !== null,
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ItemCreate) => itemService.createItem(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["items"] }),
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ItemUpdate }) =>
      itemService.updateItem(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["items"] }),
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => itemService.deleteItem(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["items"] }),
  });
};
