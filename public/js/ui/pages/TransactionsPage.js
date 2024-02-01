/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
	/**
	 * Если переданный элемент не существует,
	 * необходимо выкинуть ошибку.
	 * Сохраняет переданный элемент и регистрирует события
	 * через registerEvents()
	 * */
	constructor(element) {
		if (!element) {
			throw new Error('Передан пустой элемент')
		}
		this.element = element
		this.registerEvents()
	}

	/**
	 * Вызывает метод render для отрисовки страницы
	 * */
	update() {
		this.render(this.lastOptions)
	}

	/**
	 * Отслеживает нажатие на кнопку удаления транзакции
	 * и удаления самого счёта. Внутри обработчика пользуйтесь
	 * методами TransactionsPage.removeTransaction и
	 * TransactionsPage.removeAccount соответственно
	 * */
	registerEvents() {
		const removeAccountBtn = document.querySelector('.remove-account')
		const transactionsContainer = document.querySelector('.content')

		removeAccountBtn.addEventListener('click', () => {
			this.removeAccount()
		})

		transactionsContainer.addEventListener('click', e => {
			if (e.target.classList.contains('transaction__remove')) {
				const idTransaction = e.target.getAttribute('data-id')
				this.removeTransaction(idTransaction)
			}
		})
	}

	/**
	 * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
	 * Если пользователь согласен удалить счёт, вызовите
	 * Account.remove, а также TransactionsPage.clear с
	 * пустыми данными для того, чтобы очистить страницу.
	 * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
	 * либо обновляйте только виджет со счетами и формы создания дохода и расхода
	 * для обновления приложения
	 * */
	removeAccount() {
		if (this.lastOptions && confirm('Вы действительно хотите удалить счёт?')) {
			const accountData = { id: this.lastOptions.account_id }

			Account.remove(accountData, (err, response) => {
				if (response && response.success) {
					this.clear()
					App.updateWidgets()
					App.updateForms()
				}
			})
		}
	}

	/**
	 * Удаляет транзакцию (доход или расход). Требует
	 * подтверждеия действия (с помощью confirm()).
	 * По удалению транзакции вызовите метод App.update(),
	 * либо обновляйте текущую страницу (метод update) и виджет со счетами
	 * */
	removeTransaction(id) {
		if (confirm('Вы действительно хотите удалить эту транзакцию?')) {
			Transaction.remove({ id: id }, (err, response) => {
				if (response && response.success) {
					this.update()
					App.updateWidgets()
				}
			})
		}
	}
	/**
	 * С помощью Account.get() получает название счёта и отображает
	 * его через TransactionsPage.renderTitle.
	 * Получает список Transaction.list и полученные данные передаёт
	 * в TransactionsPage.renderTransactions()
	 * */
	render(options) {
		if (options) {
			this.lastOptions = options
			Account.get(options.account_id, (err, account) => {
				if (account && account.success) {
					this.renderTitle(account.data.name)
				}
			})
			Transaction.list(options, (err, transaction) => {
				this.renderTransactions(transaction)
			})
		}
	}

	/**
	 * Очищает страницу. Вызывает
	 * TransactionsPage.renderTransactions() с пустым массивом.
	 * Устанавливает заголовок: «Название счёта»
	 * */
	clear() {
		this.renderTransactions([])
		this.renderTitle('Название счёта')
		this.lastOptions = ''
	}

	/**
	 * Устанавливает заголовок в элемент .content-title
	 * */
	renderTitle(name) {
		const title = document.querySelector('.content-title')

		title.textContent = name
	}

	/**
	 * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
	 * в формат «10 марта 2019 г. в 03:20»
	 * */
	formatDate(date) {
		const dateObj = new Date(date)
		return dateObj
			.toLocaleString('ru-RU', {
				day: 'numeric',
				month: 'long',
				year: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
			})
			.replace(',', ' г. в')
	}

	/**
	 * Формирует HTML-код транзакции (дохода или расхода).
	 * item - объект с информацией о транзакции
	 * */
	getTransactionHTML(item) {
		const { created_at, id, name, sum, type } = item
		const date = this.formatDate(created_at)
		const transactionHTML = document.createElement('div')

		transactionHTML.className = `transaction transaction_${type} row`
		transactionHTML.innerHTML = `<div class="col-md-7 transaction__details">
      	<div class="transaction__icon">
         	<span class="fa fa-money fa-2x"></span>
      	</div>
      	<div class="transaction__info">
         	<h4 class="transaction__title">${name}</h4>
        	 <!-- дата -->
         	<div class="transaction__date">${date}</div>
      	</div>
    	</div>
    	<div class="col-md-3">
      	<div class="transaction__summ">
      	<!--  сумма -->
         ${sum} <span class="currency">₽</span>
      	</div>
    	</div>
    	<div class="col-md-2 transaction__controls">
        	<!-- в data-id нужно поместить id -->
        	<button class="btn btn-danger transaction__remove" data-id="${id}">
         	<i class="fa fa-trash"></i>  
        	</button>
    	</div>`

		return transactionHTML
	}

	/**
	 * Отрисовывает список транзакций на странице
	 * используя getTransactionHTML
	 * */
	renderTransactions(data) {
		const content = document.querySelector('.content')

		if (data.data) {
			content.innerHTML = data.data.reduce((html, transaction) => {
				return html + this.getTransactionHTML(transaction).outerHTML
			}, '')
		} else {
			content.innerHTML = ''
		}
	}
}
