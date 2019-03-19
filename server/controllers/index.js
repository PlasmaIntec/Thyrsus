const db = require('../models');

const routes = {
	getUser: (req, res) => {
		db.getUser(req.params.name)
		.then(user => res.status(200).send(user))
		.catch(err => res.status(404).send('User Not Found'))
	},
	getAllUsers: (req, res) => {
		db.getAllUsers()
		.then(users => res.status(200).send(users))
		.catch(err => res.status(404).send('No Users'))
	},
	addUser: (req, res) => {
		db.addUser(req.body)
		.then(name => res.status(201).send(`ADDED: ${req.body.name}`))
		.catch(err => res.status(404).send('Cannot Add User'))
	}
};

module.exports = routes;