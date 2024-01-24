/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
	const xhr = new XMLHttpRequest(),
		url = options.url,
		method = options.method,
		callback = options.callback

	xhr.responseType = 'json'

	// события
	xhr.addEventListener('load', () => {
		if (xhr.status === 200) {
			callback(null, xhr.response)
		} else {
			callback({ status: xhr.status, statusText: xhr.statusText }, null)
		}
	})
	xhr.addEventListener('error', () => {
		callback({ status: xhr.status, statusText: xhr.statusText }, null)
	})

	// запросы
	if (method === 'GET') {
		let newUrl = url

		if (options.data && options.data.mail) {
			newUrl += '?mail=' + options.data.mail
		}
		if (options.data && options.data.password) {
			newUrl += '&password=' + options.data.password
		}

		try {
			xhr.open(method, newUrl)
			xhr.send()
		} catch (e) {
			callback(e)
		}
	} else {
		const formData = new FormData()

		if (options.data && options.data.mail) {
			formData.append('mail', options.data.mail)
		}
		if (options.data && options.data.password) {
			formData.append('password', options.data.password)
		}

		try {
			xhr.open(method, url)
			xhr.send(formData)
		} catch (e) {
			callback(e)
		}
	}
}
