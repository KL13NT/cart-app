import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Cart } from "./Cart";
import { useCart } from "~/stores/cart";

import type { CartProduct } from "~/types";

describe("Cart", () => {
	test("matches snapshot", () => {
		useCart.setState({
			open: true,
		});

		const rendered = render(<Cart />);

		expect(rendered).toMatchSnapshot();
	});

	test("should have cart product count reflecting items in store", () => {
		useCart.setState({
			open: true,
			products: [
				{
					quantity: 1,
					id: 0,
				} as CartProduct,
			],
		});

		const rendered = render(<Cart />);

		expect(screen.getByTestId("product-count")).toHaveTextContent("(1 items)");

		useCart.setState({
			open: true,
			products: [],
		});

		rendered.rerender(<Cart />);
		expect(screen.getByTestId("product-count")).toHaveTextContent("(0 items)");
	});

	test("should render total price in cart with respect to discount percentage formatted to GB locale", () => {
		useCart.setState({
			open: true,
			products: [
				{
					quantity: 2,
					discountPercentage: 10,
					price: 100,
					thumbnail: "",
					title: "",
					id: 0,
				} as CartProduct,
			],
		});

		render(<Cart />);

		expect(screen.getByTestId("subtotal")).toHaveTextContent("£180.00");
	});

	test("should render items in cart", () => {
		useCart.setState({
			open: true,
			products: [
				{
					quantity: 2,
					discountPercentage: 10,
					price: 100,
					thumbnail: "",
					title: "",
					id: 1,
				} as CartProduct,
				{
					quantity: 2,
					discountPercentage: 10,
					price: 100,
					thumbnail: "",
					title: "",
					id: 2,
				} as CartProduct,
			],
		});

		render(<Cart />);
		const products = screen.getByTestId("products");

		expect(products.querySelectorAll("li")).toHaveLength(2);
	});

	test("should react to quantity actions and remove item from cart when quantity = 0", () => {
		useCart.setState({
			open: true,
			products: [
				{
					quantity: 1,
					discountPercentage: 10,
					price: 100,
					thumbnail: "",
					title: "",
					id: 1,
				} as CartProduct,
			],
		});

		const { rerender } = render(<Cart />);
		const products = screen.getByTestId("products");

		const firstAddButton =
			products.querySelector<HTMLButtonElement>('[data-op="add"]')!;

		const firstRemoveButton =
			products.querySelector<HTMLButtonElement>('[data-op="remove"]')!;

		fireEvent.click(firstAddButton);

		rerender(<Cart />);

		expect(screen.getAllByTestId("quantity")[0]).toHaveTextContent("2");

		fireEvent.click(firstRemoveButton);

		rerender(<Cart />);
		expect(screen.getAllByTestId("quantity")[0]).toHaveTextContent("1");

		fireEvent.click(firstRemoveButton);

		rerender(<Cart />);
		expect(screen.queryByTestId("quantity")).toBeFalsy();
	});

	test("Closing the cart should return null", () => {
		useCart.setState({
			open: true,
		});

		const { rerender, container } = render(<Cart />);
		const closeButton = screen.getByTestId("close");

		fireEvent.click(closeButton);

		rerender(<Cart />);

		expect(container).toBeEmptyDOMElement();
	});
});
