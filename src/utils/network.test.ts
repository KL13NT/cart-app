import { describe, expect, test } from "vitest";
import type { Product, ProductsResponse } from "~/types";
import { getProducts } from "./network";
import { server } from "~/mocks/server";
import { rest } from "msw";

describe("getProducts", () => {
	const products: Product[] = [
		{
			id: 1,
			title: "title",
			description: "description",
			price: 1,
			discountPercentage: 1,
			rating: 1,
			stock: 1,
			brand: "brand",
			category: "category",
			thumbnail: "thumbnail",
			images: ["images"],
		},
	];

	const productsResponse: ProductsResponse = {
		products: products,
		total: 1,
		skip: 1,
		limit: 1,
	};

	test("should fetch data properly", () => {
		server.use(
			rest.get(import.meta.env.VITE_API_URL, (_, res, ctx) =>
				res(ctx.status(200), ctx.json(productsResponse)),
			),
		);

		const result = getProducts();

		expect(result).resolves.toEqual(productsResponse);
	});

	test("should throw on request not ok", () => {
		server.use(
			rest.get(import.meta.env.VITE_API_URL, (_, res, ctx) =>
				res(ctx.status(500)),
			),
		);

		expect(getProducts()).rejects.toThrowError("Network response was not ok");
	});
});
