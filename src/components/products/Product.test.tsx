import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import type { ProductCardProps } from "./Product";
import { ProductCard } from "./Product";

import type { Product } from "~/types";
import { useCart } from "~/stores/cart";

describe("Product Card", () => {
	const props: ProductCardProps = {
		addToCart: () => null,
		product: {
			id: 0,
			discountPercentage: 0,
			price: 100,
			thumbnail: "",
			title: "",
		} as unknown as Product,
	};

	test("matches snapshot", () => {
		const rendered = render(<ProductCard {...props} />);

		expect(rendered).toMatchSnapshot();
	});

	test("should reflect quantity in cart", () => {
		const cartProduct = {
			...props.product,
			quantity: 1,
		};

		render(<ProductCard {...props} cartProduct={cartProduct} />);

		expect(screen.getByTestId("quantity")).toHaveTextContent("1");
	});

	test("should add item to cart on click add to cart", () => {
		useCart.setState({
			products: [],
		});

		const addToCart = vi.fn().mockImplementation(() => {
			useCart.getState().addProduct({ ...props.product });
		});

		render(<ProductCard {...props} addToCart={addToCart} />);

		fireEvent.click(screen.getByText("Add to Cart"));

		expect(addToCart).toHaveBeenCalledTimes(1);
		expect(useCart.getState().products).toHaveLength(1);
	});

	test("should display price formatted in GBP", () => {
		render(<ProductCard {...props} />);

		expect(screen.getByTestId("final-price")).toHaveTextContent("£100.00");
	});

	test("should render discounted price on demand", () => {
		const { rerender } = render(<ProductCard {...props} />);

		expect(screen.queryByTestId("original-price")).toBeNull();

		rerender(
			<ProductCard
				{...props}
				product={{ ...props.product, discountPercentage: 10 }}
			/>,
		);

		expect(screen.queryByTestId("original-price")).toHaveTextContent("£100.00");
		expect(screen.queryByTestId("final-price")).toHaveTextContent("£90.00");
	});

	test("should display high value indicator in case discount > 15%", () => {
		const { rerender } = render(<ProductCard {...props} />);

		expect(screen.queryByTestId("high-value")).toBeNull();

		rerender(
			<ProductCard
				{...props}
				product={{
					...props.product,
					discountPercentage: 16,
				}}
			/>,
		);

		expect(screen.getByTestId("high-value")).toBeInTheDocument();
	});
});
