const priceFormatter = new Intl.NumberFormat("en-GB", {
	style: "currency",
	currency: "GBP",
});

export function formatPrice(price: number) {
	return priceFormatter.format(price);
}
