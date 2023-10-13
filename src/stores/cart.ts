import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import type { StateCreator } from "zustand";
import type { CartProduct, Product } from "~/types";

interface CartStore {
	products: CartProduct[];
	open: boolean;
	toggle: () => void;
	addProduct: (product: Product) => void;
	removeProduct: (productId: number) => void;
	changeQuantity: (productId: number, quantity: number) => void;
}

const store: StateCreator<CartStore> = (set, get) => ({
	products: [],
	open: false,
	addProduct: (product: Product) => {
		const products = get().products;
		const found = products.find(
			(storedProduct) => storedProduct.id === product.id,
		);

		if (!found) {
			return set({
				products: [
					...products,
					{
						...product,
						quantity: 1,
					},
				],
			});
		}

		const updated = products.map((storedProduct) => {
			if (storedProduct.id === product.id) {
				return {
					...storedProduct,
					quantity: storedProduct.quantity + 1,
				};
			}

			return storedProduct;
		});

		return set(() => ({
			products: updated,
		}));
	},
	removeProduct: (productId: number) =>
		set((state) => ({
			products: state.products.filter((product) => product.id !== productId),
		})),
	changeQuantity: (productId: number, quantity: number) => {
		const products = get().products;
		const found = products.find((product) => product.id === productId);

		if (!found) {
			return;
		}

		if (quantity > 0) {
			const updated = products.map((product) => {
				if (product.id === productId) {
					return {
						...product,
						quantity,
					};
				}

				return product;
			});

			return set(() => ({
				products: updated,
			}));
		}

		return set((state) => ({
			products: state.products.filter((product) => product.id !== productId),
		}));
	},
	clear: () =>
		set(() => ({
			products: [],
		})),
	toggle: () =>
		set((state) => ({
			open: !state.open,
		})),
});

export const useCart = create(
	devtools(
		persist(store, {
			name: "Cart",
		}),
	),
);
