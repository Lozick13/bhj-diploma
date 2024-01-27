/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
	static url = '/user'

	/**
	 * Устанавливает текущего пользователя в
	 * локальном хранилище.
	 * */
	static setCurrent(user) {
		localStorage.setItem('user', JSON.stringify(user))
	}

	/**
	 * Удаляет информацию об авторизованном
	 * пользователе из локального хранилища.
	 * */
	static unsetCurrent() {
		localStorage.removeItem('user')
	}

	/**
	 * Возвращает текущего авторизованного пользователя
	 * из локального хранилища
	 * */
	static current() {
		const userString = JSON.parse(localStorage.getItem('user'))
		return userString
	}

	/**
	 * Получает информацию о текущем
	 * авторизованном пользователе.
	 * */
	static fetch(callback) {
		createRequest({
			url: this.url + '/current',
			method: 'GET',
			callback: (err, response) => {
				if (response && response.success) {
					this.setCurrent(response.user)
				} else {
					this.unsetCurrent()
				}
				callback(err, response)
			},
		})
	}

	/**
	 * Производит попытку авторизации.
	 * После успешной авторизации необходимо
	 * сохранить пользователя через метод
	 * User.setCurrent.
	 * */
	static login(data, callback) {
		createRequest({
			url: this.url + '/login',
			method: 'POST',
			data: data,
			callback: (err, response) => {
				if (response && response.success) {
					this.setCurrent(response.user)
				}
				callback(err, response)
			},
		})
	}

	/**
	 * Производит попытку регистрации пользователя.
	 * После успешной авторизации необходимо
	 * сохранить пользователя через метод
	 * User.setCurrent.
	 * */
	static register(data, callback) {
		createRequest({
			url: this.url + '/register',
			method: 'POST',
			data: data,
			callback: (err, response) => {
				if (response && response.success) {
					this.setCurrent(response.user)
				}
				callback(err, response)
			},
		})
	}

	/**
	 * Производит выход из приложения. После успешного
	 * выхода необходимо вызвать метод User.unsetCurrent
	 * */
	static logout(callback) {
		createRequest({
			url: this.url + '/logout',
			method: 'POST',
			callback: (err, response) => {
				if (response && response.success) {
					this.unsetCurrent()
				}
				callback(err, response)
			},
		})
	}
}
