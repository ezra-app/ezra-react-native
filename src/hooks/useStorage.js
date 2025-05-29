import { useState, useCallback } from 'react';
import { StorageService } from '../services/storage';

export function useStorage(key) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const loadedItems = await StorageService.getItems(key);
      setItems(loadedItems);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [key]);

  const createItem = useCallback(async (data) => {
    try {
      const newItem = await StorageService.saveItem(key, data);
      setItems(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [key]);

  const updateItem = useCallback(async (id, data) => {
    try {
      const updatedItem = await StorageService.updateItem(key, id, data);
      setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
      return updatedItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [key]);

  const deleteItem = useCallback(async (id) => {
    try {
      await StorageService.deleteItem(key, id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [key]);

  const clearItems = useCallback(async () => {
    try {
      await StorageService.clearStorage([key]);
      setItems([]);
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [key]);

  return {
    items,
    loading,
    error,
    loadItems,
    createItem,
    updateItem,
    deleteItem,
    clearItems
  };
} 