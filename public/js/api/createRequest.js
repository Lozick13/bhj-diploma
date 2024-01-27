/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
	const xhr = new XMLHttpRequest()
	const [url, data, method, callback] = options.data
		? options
		: [options.url, null, options.method, options.callback]

	xhr.responseType = 'json'

	// события
	xhr.addEventListener('load', () => {
		callback(null, xhr.response)
	})
	xhr.addEventListener('error', () => {
		callback({ status: xhr.status, statusText: xhr.statusText }, null)
	})

	// data
	let newUrl = url
	if (data) {
		if (method === 'GET') {
			const dataString = Object.keys(data)
				.map(key => `${key}=${data[key]}`)
				.join('&')

			newUrl += `?${dataString}`
		} else {
			const formData = new FormData()

			Object.keys(data).forEach(key => formData.append(key, data[key]))
		}
	}

	// запросы
	try {
		xhr.open(method, newUrl)
		method === 'GET' ? xhr.send() : xhr.send(formData)
	} catch (e) {
		callback(e)
	}
}
