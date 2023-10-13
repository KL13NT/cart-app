import { useEffect } from "react";
import { Loader } from "../loader/Loader";
import { ProductCard } from "./Product";
import { useProducts } from "./useProducts";
import { useCart } from "~/stores/cart";

import styles from "./Products.module.scss";

export function Products() {
	const { products, error, loadProducts } = useProducts();
	const cartProducts = useCart((state) => state.products);
	const addToCartStore = useCart((state) => state.addProduct);

	useEffect(() => {
		loadProducts();
	}, [loadProducts]);

	const addToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
		const container = event.currentTarget.closest<HTMLDivElement>("[data-id]");
		const id = Number(container?.dataset.id);
		const product = products!.find((product) => product.id === id);

		addToCartStore(product!);
	};

	if (error) {
		return (
			<div data-testid="error">
				<h1>Something went wrong 😭</h1>
				<p>{error.message}</p>
			</div>
		);
	}

	return (
		<div className={styles.container} data-testid="products">
			<h1>Discover our latest collection!</h1>
			<p className={styles.description}>
				Featuring the freshest arrival and the hottest trends, our collection is
				the perfect way to stay ahead of the tech game and express your unique
				style.
			</p>

			{!products ? (
				<Loader />
			) : (
				<ul className={styles.productsList}>
					{products.map((product) => (
						<li key={product.id} data-testid="listing-product">
							<ProductCard
								product={product}
								addToCart={addToCart}
								cartProduct={cartProducts.find(
									(cartProduct) => cartProduct.id === product.id,
								)}
							/>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
