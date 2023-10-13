import { describe, expect, test } from "vitest";
import { formatPrice } from "./intl";

describe("Localization utilities", () => {
	test("should format price properly", () => {
		expect(formatPrice(1)).toBe("£1.00");
		expect(formatPrice(0)).toBe("£0.00");
		expect(formatPrice(1000)).toBe("£1,000.00");
	});
});
