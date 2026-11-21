import { create } from 'zustand'
import { errorMessage } from '../api/client'
import { fetchProduct, fetchProducts } from '../api/products'
import type { Product, RequestState } from '../types'

interface ProductsStore {
  list: RequestState<Product[]>
  details: RequestState<Product>
  loadProducts: () => Promise<void>
  loadProduct: (id: number) => Promise<void>
}

export const useProductsStore = create<ProductsStore>((set) => ({
  list: { status: 'idle' },
  details: { status: 'idle' },

  loadProducts: async () => {
    set({ list: { status: 'loading' } })
    try {
      set({ list: { status: 'success', data: await fetchProducts() } })
    } catch (err) {
      set({ list: { status: 'error', error: errorMessage(err) } })
    }
  },

  loadProduct: async (id) => {
    set({ details: { status: 'loading' } })
    try {
      set({ details: { status: 'success', data: await fetchProduct(id) } })
    } catch (err) {
      set({ details: { status: 'error', error: errorMessage(err) } })
    }
  },
}))
