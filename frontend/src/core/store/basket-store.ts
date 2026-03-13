import { defineStore } from 'pinia';
interface BasketItem {
    id: number
    name: string
    price: number
    image?: string
    quantity: number
}

export const useBasketStore = defineStore('basket', {
    state: () => ({
        items: [] as BasketItem[]
    }),
    getters: {
        totalPrice: (state) => 
             state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        totalCount: (state) =>
            state.items.reduce((sum, item) => sum + item.quantity, 0)
    },
    actions: {
        addToCart(dish: Omit<BasketItem, 'quantity'>) {
      const existing = this.items.find(i => i.id === dish.id)

      if (existing) {
        existing.quantity++
      } else {
        this.items.push({ ...dish, quantity: 1 })
      }
    },

    increase(id: number) {
      const item = this.items.find(i => i.id === id)
      if (item) item.quantity++
    },

    decrease(id: number) {
      const item = this.items.find(i => i.id === id)
      if (!item) return

      item.quantity--

      if (item.quantity <= 0) {
        this.items = this.items.filter(i => i.id !== id)
      }
    }
  }
})