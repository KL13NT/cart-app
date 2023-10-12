import { afterAll, afterEach, beforeAll, expect } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { server } from "../src/mocks/server";

import "@testing-library/jest-dom/vitest";

expect.extend(matchers);

if (!process.env.VITE_API_URL) {
	throw new Error("VITE_API_URL not defined");
}

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => {
	cleanup();
	server.resetHandlers();
});
