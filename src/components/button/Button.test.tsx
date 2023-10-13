import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Button } from "./Button";

import styles from "./Button.module.scss";

describe("Button", () => {
	test("matches snapshot", () => {
		const rendered = render(<Button>button</Button>);

		expect(rendered).toMatchSnapshot();
	});

	test("renders with the given props properly", () => {
		render(
			<Button className="test-class" disabled>
				button
			</Button>,
		);
		const button = screen.getByTestId("button");

		expect(button).toHaveAttribute("disabled");
		expect(button).toHaveTextContent("button");
		expect(button).toHaveClass(`${styles.button} test-class`);
	});
});
