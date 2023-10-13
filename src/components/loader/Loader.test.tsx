import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Loader } from "./Loader";

describe("Loader", () => {
	test("matches snapshot", () => {
		const rendered = render(<Loader />);

		expect(rendered).toMatchSnapshot();
	});
});
