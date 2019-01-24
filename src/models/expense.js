import mongoose, { Schema } from 'mongoose';
import bcrypt from 'mongoose-bcrypt';
import timestamps from 'mongoose-timestamp';
import mongooseStringQuery from 'mongoose-string-query';

import logger from '../utils/logger';
import email from '../utils/email';
import events from '../utils/events';

export const ExpenseSchema = new Schema(
	{
		type: {
			type: String,
			lowercase: true,
			trim: true,
			required: true
		},
		userID: {
			type: String,
			lowercase: true,
			trim: true,
			index: true,
			unique: true,
			required: true
		},
		sum: {
			type: Number,
			required: true
		},
		createDate: {
			type: Date,
			required: true
		},
        modifyDate: {
            type: Date,
            required: true
        },
		project: {
			type: String,
			trim: true,
			default: ''
		},
		image: {
			type: String,
			trim: false,
			default: ''
		},
		description: {
			type: String,
			trim: true,
			default: ''
		}
	},
	{ collection: 'users' }
);

UserSchema.pre('save', function(next) {
	if (!this.isNew) {
		next();
	}

	email({
		type: 'welcome',
		email: this.email
	})
		.then(() => {
			next();
		})
		.catch(err => {
			logger.error(err);
			next();
		});
});

UserSchema.pre('findOneAndUpdate', function(next) {
	if (!this._update.recoveryCode) {
		return next();
	}

	email({
		type: 'password',
		email: this._conditions.email,
		passcode: this._update.recoveryCode
	})
		.then(() => {
			next();
		})
		.catch(err => {
			logger.error(err);
			next();
		});
});

UserSchema.plugin(bcrypt);
UserSchema.plugin(timestamps);
UserSchema.plugin(mongooseStringQuery);

UserSchema.index({ email: 1, username: 1 });

module.exports = exports = mongoose.model('User', UserSchema);
