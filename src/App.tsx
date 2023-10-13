import { Cart } from "./components/cart/Cart";
import { Navbar } from "./components/navbar/Navbar";
import { Products } from "./components/products/Products";

import styles from "./App.module.scss";

export function App() {
	return (
		<>
			<Navbar />
			<div className={styles.layout}>
				<Products />
				<Cart />
			</div>
		</>
	);
}
