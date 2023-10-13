import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import styles from "./Button.module.scss";

interface Props
	extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {}

export function Button({ children, className = "", ...props }: Props) {
	const classes = [styles.button, className].join(" ");

	return (
		<button {...props} className={classes} data-testid="button">
			{children}
		</button>
	);
}
