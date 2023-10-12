import { setupServer } from "msw/node";

if (!process.env.VITE_API_URL) {
	throw new Error("VITE_API_URL not defined");
}

export const server = setupServer();
