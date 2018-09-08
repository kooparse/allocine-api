global.Promise = require('bluebird')
const Hapi = require('hapi')
const path = require('path')
const Joi = require('joi')
const { syncAll, getShowTimesFromZip } = require('./utils/scheduler')
const server = new Hapi.Server()
const { connect, Movie, Theater, Time } = require('./utils/db')

connect()

server.register([
	// Bind all Boom error on the Reply method.
	require('hapi-boom-decorators'),
])

// Setting server ports.
server.connection({ port: process.env.PORT || 3005 })

server.route({
	method: 'POST',
	path: '/api/showtimelist',
	handler: showtimelist,
	config: {
		cors: { origin: ['*'] }
	}
})

server.route({
	method: 'GET',
	path: '/api/nowshowing',
	handler: nowshowing,
	config: {
		cors: { origin: ['*'] }
	}
})

server.route({
	method: 'GET',
  path: '/api/{zipcode}/sync',
	handler: sync,
	config: {
		cors: { origin: ['*'] }
	}
})

server.route({
	method: 'GET',
  path: '/api/movie/{code}/showtimes',
	handler: showtimes,
	config: {
		cors: { origin: ['*'] }
	}
})

server.start(err => {
	if (err) throw err
	console.log(`Server running at: ${server.info.uri}`)
})

function showtimes(request, reply) {
  const { code } = request.params

  return Time.find({ movieCode: code })
    .then(reply)
    .catch(reply)
}

function sync(request, reply) {
	const { zipcode } = request.params
  syncAll(zipcode)
    .then(reply)
    .catch(reply)
}

function nowshowing(request, reply) {
	return Movie.find().sort('rankTopMovie')
		.then(reply)
		.catch(reply)
}

function showtimelist(request, reply) {
	const postalCode = request.payload.zip

	return Theater.find({ postalCode: postalCode })
		.then(theaters => theaters.map(t => t.code))
		.then(theaterCodes => Time.find({ theaterCode: { $in: theaterCodes } }))
		.then(times => times.length ? times : getShowTimesFromZip(postalCode))
		.then(reply)
		.catch(reply)
}
