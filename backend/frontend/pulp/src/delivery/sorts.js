function getLocation(href) {
	var l = document.createElement("a");
	l.href = href;
	return l.hostname;
}

function pages_compare(a, b) {
	if (a.article.page_count > b.article.page_count) return -1;
	if (b.article.page_count > a.article.page_count) return 1;
	return 0;
}

function deliver_compare(a, b) {
	if (a.to_deliver) {
		// If both are set to_deliver, compare by date
		if (b.to_deliver) {
			return date_compare(a, b);
		}
		return -1;
	}
	if (b.to_deliver) {
		return 1;
	}
	return 0;
}

function date_compare(a, b) {
	let date_a = new Date(a.date_added);
	let date_b = new Date(b.date_added);
	if (date_a > date_b) return -1;
	if (date_b > date_a) return 1;
	return 0;
}

function title_compare(a, b) {
	if (a.article.title > b.article.title) return 1;
	if (b.article.title > a.article.title) return -1;
	return 0;
}

export {
	getLocation,
	pages_compare,
	deliver_compare,
	date_compare,
	title_compare
};
