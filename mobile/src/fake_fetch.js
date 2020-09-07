export default function fakeFetch(data: JSON) {
	return makePromise(getResponse(data));
}

function getResponse(data: JSON) {
	return {
		json() {
			return makePromise(data);
		}
	};
}

function makePromise(value: any) {
	const promise = new Promise((resolve) => {
		const timer = setTimeout(() => {
			resolve(value);
			clearTimeout(timer);
		}, 100);
	});

	return promise;
}
