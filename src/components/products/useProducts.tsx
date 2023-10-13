import { useCallback, useState } from "react";
import { getProducts } from "~/utils/network";

import type { Product } from "~/types";

interface State {
	error: Error | null;
	products: Product[] | null;
}

export function useProducts() {
	const [store, setStore] = useState<State>({
		error: null,
		products: null,
	});

	const loadProducts = useCallback(() => {
		getProducts()
			.then(({ products }) => {
				setStore({
					products,
					error: null,
				});
			})
			.catch((error) => {
				setStore({
					products: null,
					error,
				});
			});
	}, []);

	return {
		...store,
		loadProducts,
	};
}
