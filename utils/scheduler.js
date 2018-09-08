const _ = require('lodash')
const allocine = require('allocine-api')
const { Theater, Movie, Time } = require('./db')
const {
  getMovieList,
  getTheaterList,
  getShowTimeList,
  getMovie
} = require('./normalizer')

const getMovies = movieCode => new Promise((resolve, reject) => {
  const query = { code: movieCode, profile: 'medium' }
  return allocine.api('movie', query, (err, result) => {
    if (err) return reject(err)

    const movie = getMovie(result.movie)
    return Movie.findOneAndUpdate({ code: movie.code }, movie, { upsert: true, new: true })
      .then(doc => {
        console.log(`Movie: Added/Updated ${doc.title}.`)
        resolve(doc)
      })
      .catch(reject)
  })
})

const getShowingMovies = () => new Promise((resolve, reject) => {
  const query = { filter: 'nowshowing', page: 1, order: 'toprank', count: 100 }
  return allocine.api('movielist', query, (error, result) => {
    if (error) return reject(error)

    const list = getMovieList(result)
    const dbQuery = m => Movie.findOneAndUpdate({ code: m.code }, m, { upsert: true, new: true })

    Promise.all(list.map(dbQuery))
      .each(doc => console.log(`Movie: Added/Updated ${doc.title}.`))
      .then(resolve)
      .catch(reject)
  })
})

const getTheaters = (zip, theaterCode = undefined) => new Promise((resolve, reject) => {
  const query = { zip, count: 50, page: 1 }
  if (theaterCode) query.theater = theaterCode

  return allocine.api('theaterlist', query, (error, result) => {
    if (error) return reject(error)

    const list = getTheaterList(result)
    const dbQuery = t => Theater.findOneAndUpdate({ code: t.code }, t, { upsert: true, new: true })

    Promise.all(list.map(dbQuery))
      .each(doc => console.log(`Theater: Added/Updated ${doc.name}.`))
      .then(resolve)
      .catch(reject)
  })
})

const getShowTimesFromZip = zip => new Promise((resolve, reject) => {
  const query = { zip, count: 20, page: 1, code: 1 }
  return allocine.api('showtimelist', query, (error, result) => {
    if (error) return reject(error)

    console.log(JSON.stringify(result));

    const list = getShowTimeList(result)
    const times = _.flattenDeep(list.map(({ timeList }) => timeList.map(t => t)))
    const theaterCodes = _.uniqBy(list, 'theaterCode').map(({ theaterCode }) => theaterCode)
    const movieCodes = _.uniqBy(times, 'movieCode').map(({ movieCode }) => movieCode)
    const dbQuery = t => Time.findOneAndUpdate({ code: t.code }, t, { upsert: true, new: true })

    const theaterQueries = theaterCodes.map(c => getTheaters(zip, c))
    const MovieQueries = movieCodes.map(getMovies)
    const TimeQueries = times.map(dbQuery)
    const props = { docs: TimeQueries, rest: [...theaterQueries, MovieQueries] }

    Promise.props(props)
      .get('docs')
      .each(doc => console.log(`Time: Added ${doc.movieTitle} for ${doc.day}.`))
      .then(resolve)
      .catch(reject)
  })
})

exports.getShowTimesFromZip = getShowTimesFromZip

exports.syncAll = zip => new Promise((resolve, reject) =>
  Promise.all([
    getShowingMovies(),
    // getTheaters(zip),
    // getShowTimesFromZip(zip)
  ])
  .then(resolve)
  .catch(reject)
)
