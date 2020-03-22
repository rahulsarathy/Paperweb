import moment from "moment";

function timeAgo(date) {
	let insta_date = new Date(date);
	let unix = insta_date.getTime();
	let m = moment(unix);
	return m.fromNow();
}

export { timeAgo };
