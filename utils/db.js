const mongoose = require('mongoose')
mongoose.Promise = global.Promise

exports.connect = () => mongoose.connect('mongodb://localhost/allocine_api')

const db = mongoose.connection
db.once('open', () => console.log('connected'))

const theaterSchema = mongoose.Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, default: '' },
    postalCode: { type: Number, required: true },
    address: { type: String, default: '' },
    picture: { type: String, default: '' },
})

const movieSchema = mongoose.Schema({
    code: { type: Number, required: true },
    originalTitle: { type: String },
    title: { type: String, required: true },
    genre: Array,
    directors: { type: String, default: '' },
    actors: { type: String, default: '' },
    cover: { type: String, default: '' },
    releaseDate: { type: String, default: '' },
    distributor: { type: String, default: '' },
    rankTopMovie: { type: Number, required: true },
    ratings: { type: Object, default: {} }
})

const timeSchema = mongoose.Schema({
    code: { type: String, required: true },
    movieCode: { type: Number, required: true },
    movieTitle: { type: String, required: true },
    theaterCode: { type: String, required: true },
    theaterName: { type: String, required: true },
    version: { type: Object, required: true },
    format: { type: String, required: true },
    day: { type: String, required: true },
    times: { type: Array, required: true, default: [] }
})

const Theater = mongoose.model('Theater', theaterSchema)
const Movie = mongoose.model('Movie', movieSchema)
const Time = mongoose.model('Time', timeSchema)

exports.Theater = Theater
exports.Movie = Movie
exports.Time = Time
