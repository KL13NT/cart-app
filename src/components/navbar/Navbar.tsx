import logoImage from "~/assets/images/logo.webp";
import cartIcon from "~/assets/icons/cart.svg";

import { useCart } from "~/stores/cart";

import styles from "./Navbar.module.scss";

export function Navbar() {
	const products = useCart((state) => state.products);
	const toggleCart = useCart((state) => state.toggle);
	const occupied = products.length > 0;
	const label = `You have ${products.length} products in your cart`;

	return (
		<nav className={styles.navbar} data-testid="navbar">
			<img src={logoImage} alt="Product logo" className={styles.logo} />
			<ul className={styles.links}>
				<li>
					<a href="/">Home</a>
				</li>
				<li>
					<a href="/">Products</a>
				</li>
				<li>
					<a href="/">About</a>
				</li>
			</ul>
			<button
				aria-label={label}
				className={styles.cart}
				data-occupied={occupied}
				onClick={() => toggleCart()}
				data-testid="cart-button"
			>
				<img src={cartIcon} alt="" role="presentation" />
			</button>
		</nav>
	);
}
