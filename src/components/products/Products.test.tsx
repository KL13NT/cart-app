import { describe, expect, test } from "vitest";
import type { Product, ProductsResponse } from "~/types";
import { server } from "~/mocks/server";
import { rest } from "msw";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Products } from "./Products";
import { useCart } from "~/stores/cart";

describe("Products listing", () => {
	const products = [
		{
			id: 1,
			title: "title",
			price: 1,
			discountPercentage: 1,
			brand: "brand",
			thumbnail: "thumbnail",
		} as Product,
	];

	const productsResponse: ProductsResponse = {
		products: new Array(3)
			.fill(products)
			.map((product, index) => ({ ...product, id: index })),
		total: 1,
		skip: 1,
		limit: 1,
	};

	test("matches snapshot", async () => {
		server.use(
			rest.get(import.meta.env.VITE_API_URL, (_, res, ctx) =>
				res(ctx.status(200), ctx.json(productsResponse)),
			),
		);

		const rendered = render(<Products />);

		await waitFor(() =>
			expect(screen.getAllByTestId("listing-product")).toHaveLength(3),
		);

		expect(rendered).toMatchSnapshot();
	});

	test("should render on ok response", async () => {
		server.use(
			rest.get(import.meta.env.VITE_API_URL, (_, res, ctx) =>
				res(ctx.status(200), ctx.json(productsResponse)),
			),
		);

		render(<Products />);

		await waitFor(() =>
			expect(screen.getAllByTestId("listing-product")).toHaveLength(3),
		);

		expect(screen.getByTestId("products")).toBeInTheDocument();
		expect(screen.queryByTestId("error")).toBeFalsy();
	});

	test("should render error on non-ok response", async () => {
		server.use(
			rest.get(import.meta.env.VITE_API_URL, (_, res, ctx) =>
				res(ctx.status(500)),
			),
		);

		render(<Products />);

		await waitFor(() => screen.getByTestId("error"));

		expect(screen.getByTestId("error")).toBeInTheDocument();
	});

	test("should display loading spinner until loaded", async () => {
		server.use(
			rest.get(import.meta.env.VITE_API_URL, (_, res, ctx) =>
				res(ctx.delay(1000), ctx.status(200), ctx.json(productsResponse)),
			),
		);

		render(<Products />);

		await waitFor(() =>
			expect(screen.getByTestId("loader")).toBeInTheDocument(),
		);
	});

	test("clicking add to cart should add item to cart and indicate correct quantity", async () => {
		server.use(
			rest.get(import.meta.env.VITE_API_URL, (_, res, ctx) =>
				res(ctx.status(200), ctx.json(productsResponse)),
			),
		);

		useCart.setState({
			products: productsResponse.products.map((product) => ({
				...product,
				quantity: 2,
			})),
		});

		render(<Products />);

		await waitFor(() =>
			expect(screen.getAllByTestId("listing-product")).toHaveLength(3),
		);

		const products = screen.getAllByTestId("listing-product");

		fireEvent.click(products[0].querySelector("button")!);

		await waitFor(() =>
			expect(
				products[0].querySelector("button")?.lastElementChild,
			).toHaveTextContent("3"),
		);
	});
});
