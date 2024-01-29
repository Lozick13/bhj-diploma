/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
	/**
	 * Устанавливает текущий элемент в свойство element
	 * Регистрирует обработчики событий с помощью
	 * AccountsWidget.registerEvents()
	 * Вызывает AccountsWidget.update() для получения
	 * списка счетов и последующего отображения
	 * Если переданный элемент не существует,
	 * необходимо выкинуть ошибку.
	 * */
	constructor(element) {
		if (!element) {
			throw new Error('Передан пустой элемент')
		}
		this.element = element
		this.update()
	}

	/**
	 * При нажатии на .create-account открывает окно
	 * #modal-new-account для создания нового счёта
	 * При нажатии на один из существующих счетов
	 * (которые отображены в боковой колонке),
	 * вызывает AccountsWidget.onSelectAccount()
	 * */
	registerEvents() {
		const createAccountBtn = document.querySelector('.create-account')
		const accounts = document.querySelectorAll('.account')

		createAccountBtn.addEventListener('click', () => {
			App.getModal('createAccount').open()
		})

		accounts.forEach(account => {
			account.addEventListener('click', () => {
				this.onSelectAccount(account)
			})
		})
	}

	/**
	 * Метод доступен только авторизованным пользователям
	 * (User.current()).
	 * Если пользователь авторизован, необходимо
	 * получить список счетов через Account.list(). При
	 * успешном ответе необходимо очистить список ранее
	 * отображённых счетов через AccountsWidget.clear().
	 * Отображает список полученных счетов с помощью
	 * метода renderItem()
	 * */
	update() {
		const data = User.current()
		if (data) {
			Account.list(data, (err, accounts) => {
				if (accounts.success) {
					this.clear()
					accounts.data.forEach(account => {
						this.renderItem(account)
					})
					this.registerEvents()
				}
				if (err) {
					throw new Error(err)
				}
			})
		}
	}

	/**
	 * Очищает список ранее отображённых счетов.
	 * Для этого необходимо удалять все элементы .account
	 * в боковой колонке
	 * */
	clear() {
		const accounts = document.querySelectorAll('.account')

		accounts.forEach(account => {
			account.remove()
		})
	}

	/**
	 * Срабатывает в момент выбора счёта
	 * Устанавливает текущему выбранному элементу счёта
	 * класс .active. Удаляет ранее выбранному элементу
	 * счёта класс .active.
	 * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
	 * */
	onSelectAccount(element) {
		const id = element.getAttribute('data-id')
		const active = document.querySelector('.active')

		if (active) {
			active.classList.remove('active')
		}
		element.classList.add('active')
		App.showPage('transactions', { account_id: id})
	}

	/**
	 * Возвращает HTML-код счёта для последующего
	 * отображения в боковой колонке.
	 * item - объект с данными о счёте
	 * */
	getAccountHTML(item) {
		const newAccount = document.createElement('li')
		const { id, name, sum } = item

		newAccount.className = 'account'
		newAccount.setAttribute('data-id', id)
		newAccount.innerHTML = `<a href="#">
			<span>${name}</span> 
			/<span>${sum} ₽</span>
		</a>`

		return newAccount
	}

	/**
	 * Получает массив с информацией о счетах.
	 * Отображает полученный с помощью метода
	 * AccountsWidget.getAccountHTML HTML-код элемента
	 * и добавляет его внутрь элемента виджета
	 * */
	renderItem(data) {
		const account = this.getAccountHTML(data)
		this.element.append(account)
	}
}
