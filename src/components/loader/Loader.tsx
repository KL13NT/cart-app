import styles from "./Loader.module.scss";

/**
 * Modified version of Pure CSS Loader
 * @see https://loading.io/css/
 */
export function Loader() {
	return (
		<div className={styles.ellipsis} data-testid="loader">
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	);
}
