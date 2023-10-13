import { useMemo } from "react";
import { Button } from "~/components/button/Button";
import { formatPrice } from "~/utils/intl";
import { useCart } from "~/stores/cart";

import type { MouseEvent } from "react";

import styles from "./Cart.module.scss";

import closeIcon from "~/assets/icons/x.svg";
import plusIcon from "~/assets/icons/plus.svg";
import minusIcon from "~/assets/icons/minus.svg";

export function Cart() {
	const products = useCart((state) => state.products);
	const toggleCart = useCart((state) => state.toggle);
	const changeQuantity = useCart((state) => state.changeQuantity);
	const open = useCart((state) => state.open);

	const total = useMemo(
		() =>
			products.reduce((total, { discountPercentage, price, quantity }) => {
				const finalPrice =
					discountPercentage > 0
						? price - price * (discountPercentage / 100)
						: price;

				const subtotal = total + finalPrice * quantity;

				return total + Number(subtotal.toFixed(2));
			}, 0),
		[products],
	);

	const handleChangeQuantity = (event: MouseEvent<HTMLButtonElement>) => {
		const container = event.currentTarget.closest<HTMLLIElement>("[data-id]");
		const id = Number(container?.dataset.id);
		const op = event.currentTarget.dataset.op;
		const product = products.find((product) => product.id === id)!;

		if (op === "add") {
			changeQuantity(id, product.quantity + 1);
		} else {
			changeQuantity(id, product.quantity - 1);
		}
	};

	if (!open) return null;

	return (
		<div className={styles.cart} data-testid="cart">
			<div className={styles.header}>
				<div className={styles.title}>
					<h1>My Cart</h1>
					<p data-testid="product-count">({products.length} items)</p>
				</div>

				<button
					onClick={() => toggleCart()}
					aria-label="Close cart"
					data-testid="close"
					className={styles.close}
				>
					<img src={closeIcon} alt="" role="presentation" />
				</button>
			</div>

			<div className={styles.container}>
				<ul className={styles.list} data-testid="products">
					{products.map(({ id, thumbnail, title, quantity }) => (
						<li className={styles.product} key={id} data-id={id}>
							<img src={thumbnail} alt={title} />
							<div className={styles.content}>
								<p>{title}</p>

								<div className={styles.quantity}>
									<button
										data-op="remove"
										onClick={handleChangeQuantity}
										className={styles.quantityAction}
										aria-label="Remove one"
									>
										<img src={minusIcon} alt="" role="presentation" />
									</button>
									<p aria-label="Quantity in cart" data-testid="quantity">
										{quantity}
									</p>
									<button
										data-op="add"
										onClick={handleChangeQuantity}
										className={styles.quantityAction}
										aria-label="Add one"
									>
										<img src={plusIcon} alt="" role="presentation" />
									</button>
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>

			<div className={styles.footer}>
				<div className={styles.price}>
					<p>Subtotal</p>
					<p data-testid="subtotal">{formatPrice(total)}</p>
				</div>

				<Button
					className={styles.checkout}
					disabled={products.length === 0}
					data-testid="checkout"
				>
					Proceed to checkout
				</Button>
			</div>
		</div>
	);
}
