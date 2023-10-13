import type { ProductsResponse } from "~/types";

export async function fetch<T>(
	input: RequestInfo | URL,
	init: RequestInit = {},
) {
	const res = await globalThis.fetch(input, init);

	if (!res.ok) {
		throw new Error(`Network response was not ok, status ${res.status}`);
	}

	return res.json() as Promise<T>;
}

export async function getProducts() {
	return fetch<ProductsResponse>(import.meta.env.VITE_API_URL);
}
