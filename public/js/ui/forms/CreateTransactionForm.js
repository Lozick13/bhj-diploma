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
		const accountsSelect =
			this.element.id === 'new-income-form'
				? this.element.querySelector(`#income-accounts-list`)
				: this.element.querySelector(`#expense-accounts-list`)

		if (data) {
			Account.list(data, (err, accounts) => {
				if (accounts && accounts.success) {
					accountsSelect.innerHTML = accounts.data.reduce((html, account) => {
						return (
							html + `<option value="${account.id}">${account.name}</option>`
						)
					}, '')
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
		})
	}
}
