import { Button } from "../button/Button";

import { formatPrice } from "~/utils/intl";

import type { CartProduct, Product } from "~/types";
import type { MouseEventHandler } from "react";

import styles from "./Product.module.scss";

export interface ProductCardProps {
	addToCart: MouseEventHandler<HTMLButtonElement>;
	product: Product;
	cartProduct?: CartProduct;
}

export function ProductCard({
	addToCart,
	product,
	cartProduct,
}: ProductCardProps) {
	const { thumbnail, title, price, id, brand, discountPercentage } = product;
	const finalPrice =
		discountPercentage > 0 ? price - price * (discountPercentage / 100) : price;

	return (
		<div data-id={id} className={styles.product} data-testid="product">
			<div className={styles.header}>
				<div className={styles.intro}>
					<p className={styles.brand}>{brand}</p>
					<p className={styles.title}>{title}</p>
				</div>

				<div className={styles.price}>
					{discountPercentage > 0 && (
						<p
							className={styles.discount}
							aria-label={`Original price ${formatPrice(price)}`}
							data-testid="original-price"
						>
							{formatPrice(price)}
						</p>
					)}
					<p
						className={styles.price}
						aria-label={`Current price`}
						data-testid="final-price"
					>
						{formatPrice(finalPrice)}
					</p>
				</div>
			</div>

			<img
				className={styles.thumbnail}
				src={thumbnail}
				loading="lazy"
				alt={title}
			/>

			<div className={styles.footer}>
				<Button onClick={addToCart} className={styles.addToCart}>
					<span>Add to Cart</span>

					{cartProduct && (
						<span className={styles.quantity} data-testid="quantity">
							{cartProduct.quantity}
						</span>
					)}
				</Button>

				{discountPercentage > 15 && (
					<p className={styles.limited} data-testid="high-value">
						High value!
					</p>
				)}
			</div>
		</div>
	);
}
