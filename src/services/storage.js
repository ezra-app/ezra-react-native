import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageService = {
  async saveItem(key, item) {
    try {
      const items = await this.getItems(key);
      const newItem = {
        id: Math.random().toString(36).substring(7),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...item
      };
      
      await AsyncStorage.setItem(
        key,
        JSON.stringify([...items, newItem])
      );
      
      return newItem;
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      throw error;
    }
  },

  async getItems(key) {
    try {
      const items = await AsyncStorage.getItem(key);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
      return [];
    }
  },

  async updateItem(key, id, data) {
    try {
      const items = await this.getItems(key);
      const index = items.findIndex(item => item.id === id);
      
      if (index === -1) throw new Error('Item não encontrado');
      
      const updatedItem = {
        ...items[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      items[index] = updatedItem;
      await AsyncStorage.setItem(key, JSON.stringify(items));
      
      return updatedItem;
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      throw error;
    }
  },

  async deleteItem(key, id) {
    try {
      const items = await this.getItems(key);
      const filteredItems = items.filter(item => item.id !== id);
      await AsyncStorage.setItem(key, JSON.stringify(filteredItems));
    } catch (error) {
      console.error('Erro ao deletar item:', error);
      throw error;
    }
  },

  async clearStorage(keys) {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      throw error;
    }
  }
}; 