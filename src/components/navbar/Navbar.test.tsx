import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Navbar } from "./Navbar";
import { useCart } from "~/stores/cart";

import type { CartProduct } from "~/types";

describe("Navbar", () => {
	test("matches snapshot", () => {
		const rendered = render(<Navbar />);

		expect(rendered).toMatchSnapshot();
	});

	test("should have cart icon indicator when items in cart", () => {
		useCart.setState({
			products: [
				{
					quantity: 1,
				} as CartProduct,
			],
		});

		const rendered = render(<Navbar />);
		const cartButton = screen.getByTestId("cart-button");

		expect(cartButton).toHaveAttribute("data-occupied", "true");

		useCart.setState({
			products: [],
		});

		rendered.rerender(<Navbar />);
		expect(cartButton).toHaveAttribute("data-occupied", "false");
	});

	test("cart aria label should reflect number of items in store", () => {
		useCart.setState({
			products: [
				{
					quantity: 1,
				} as CartProduct,
			],
		});

		const rendered = render(<Navbar />);
		const cartButton = screen.getByTestId("cart-button");

		expect(cartButton).toHaveAttribute(
			"aria-label",
			"You have 1 products in your cart",
		);

		useCart.setState({
			products: [],
		});

		rendered.rerender(<Navbar />);

		expect(cartButton).toHaveAttribute(
			"aria-label",
			"You have 0 products in your cart",
		);
	});

	test("cart button should toggle card store", async () => {
		useCart.setState({
			open: false,
		});

		render(<Navbar />);
		const cartButton = screen.getByTestId("cart-button");

		fireEvent.click(cartButton);

		await waitFor(() => expect(useCart.getState().open).toBe(true));
	});
});
