import async from 'async';
import validator from 'validator';

import User from '../models/user';
import Follow from '../models/follow';

import logger from '../utils/logger';

exports.list = (req, res) => {
	const params = req.params || {};
	const query = req.query || {};

	const page = parseInt(query.page, 10) || 0;
	const perPage = parseInt(query.per_page, 10) || 10;

	Expense.findById(req.params.userId)
		.select('-image')
		.then(expenses => {
			res.json(expenses);
		})
		.catch(err => {
			logger.error(err);
			res.status(422).send(err.errors);
		});
};

exports.get = (req, res) => {
	Expense.findById(req.params.expenseId)
		.then(expense => {
			res.json(expense);
		})
		.catch(err => {
			logger.error(err);
			res.status(422).send(err.errors);
		});
};

exports.put = (req, res) => {
	const data = req.body || {};

	Expense.findByIdAndUpdate({ _id: req.params.expenseId }, data, { new: true })
		.then(expense => {
			if (!expense) {
				return res.sendStatus(404);
			}

			res.json(expense);
		})
		.catch(err => {
			logger.error(err);
			res.status(422).send(err.errors);
		});
};

exports.post = (req, res) => {
	const data = Object.assign({}, req.body, { user: req.user.sub }) || {};

	Expense.create(data)
		.then(expense => {
			res.json(expense);
		})
		.catch(err => {
			logger.error(err);
			res.status(500).send(err);
		});
};

