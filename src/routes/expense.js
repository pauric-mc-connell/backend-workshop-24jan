import User from '../controllers/user';

module.exports = api => {
	api.route('/expenses/:userId').get(Expense.list);
    api.route('/expenses/expense/:expenseId').get(Expense.get);
	api.route('/expenses/:userId').put(Expense.put);
	api.route('/expense/').post(Expense.post);
};
