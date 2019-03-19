const MongoClient = require('mongodb').MongoClient;
const { MLAB_USERNAME, MLAB_ROOT_PASSWORD, MLAB_DATABASE } = require('../../config.js');
 
const url = `mongodb://${MLAB_USERNAME}:${MLAB_ROOT_PASSWORD}@ds117816.mlab.com:17816/${MLAB_DATABASE}`;
const options = { useNewUrlParser: true};

const connect = () => {
	return new Promise((resolve, reject) => {	
		MongoClient.connect(url, options, (err, client) => {
			if (!err) {	 
			  resolve(client.db(MLAB_DATABASE));	
			} else {
				reject(err);
			}
		});
	});
};

const getUser = name => {
	return new Promise((resolve, reject) => {
		connect()
		.then(db => {
			db.collection('users').findOne({ 'name': name }, (error, result) => {
				if (error || !result) reject(error);
				else resolve(result);
			});
		})
		.catch(err => console.error(err))
	});
}

const getAllUsers = () => {
	return new Promise((resolve, reject) => {
		connect()
		.then(db => {
			db.collection('users').find().toArray((error, result) => {
				if (error || !result) reject(result);
				else resolve(result);
			});
		})
		.catch(err => console.error(err))
	});
}

const addUser = info => {
	return new Promise((resolve, reject) => {
		connect()
		.then(db => {
			db.collection('users').insertOne({
				name: info.name,
				location: {
					type: 'Point',
					coordinates: [info.x, info.y]
				},
				icon: info.icon
			}, (error, result) => {
				if (error) reject(error);
				else resolve(result);
			});		
		})
		.catch(err => console.error(err))		
	});
};

connect()
.then(() => {
	console.log('Connected to mLab');
})
.catch(err => {
	console.err('Failed to connect to mLab:', err);
})

module.exports = { getUser, getAllUsers, addUser };