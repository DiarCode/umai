import { defineStore } from "pinia";
interface BasketItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

export const useBasketStore = defineStore("basket", {
  state: () => ({
    items: [] as BasketItem[],
  }),
  getters: {
    totalPrice: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    totalCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
  },
  actions: {
    addToCart(dish: Omit<BasketItem, "quantity">) {
      if (!dish.id || !dish.name || typeof dish.price !== "number") {
        console.error("Invalid basket item:", dish);
        return;
      }

      if (dish.price < 0) {
        console.error("Invalid price:", dish.price);
        return;
      }

      const existing = this.items.find((i) => i.id === dish.id);

      if (existing) {
        if (existing.quantity >= 99) return; // лимит
        existing.quantity++;
      } else {
        this.items.push({ ...dish, quantity: 1 });
      }
    },

    increase(id: string) {
      const item = this.items.find((i) => i.id === id);
      if (item) item.quantity++;
    },

    decrease(id: string) {
      const item = this.items.find((i) => i.id === id);
      if (!item) return;

      item.quantity--;

      if (item.quantity <= 0) {
        this.items = this.items.filter((i) => i.id !== id);
      }
    },
  },
});
