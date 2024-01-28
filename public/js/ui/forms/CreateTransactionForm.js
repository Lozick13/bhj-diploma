/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
	/**
	 * Вызывает родительский конструктор и
	 * метод renderAccountsList
	 * */
	constructor(element) {
		super(element)
		this.renderAccountsList()
	}

	/**
	 * Получает список счетов с помощью Account.list
	 * Обновляет в форме всплывающего окна выпадающий список
	 * */
	renderAccountsList() {
		const data = User.current()
		const accountsSelect = document.querySelector('.accounts-select')

		if (data) {
			Account.list(data, (err, accounts) => {
				if (accounts.success) {
					accounts.data.forEach(account => {
						const option = document.createElement('option')

						option.value = account.id
						option.textContent = account.name

						accountsSelect.appendChild(option)
					})
				}
				if (err) {
					throw new Error(err)
				}
			})
		}
	}

	/**
	 * Создаёт новую транзакцию (доход или расход)
	 * с помощью Transaction.create. По успешному результату
	 * вызывает App.update(), сбрасывает форму и закрывает окно,
	 * в котором находится форма
	 * */
	onSubmit(data) {
		Transaction.create(data, (err, response) => {
			if (response && response.success) {
				this.element.reset()
				App.getModal('newIncome').close()
				App.getModal('newExpense').close()
				App.update()
			}
			if (err) {
				throw new Error(err)
			}
		})
	}
}
