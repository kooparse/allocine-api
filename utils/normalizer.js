const _ = require('lodash')
const hash = require('object-hash')

const toBool = val => val === 'true'
const getGenre = (g = []) => g.map(({ $ }) => $)
const getFormat = ({ $ = null }) => $
const getVersion = v => ({
  original: toBool(v.original),
  lang: v.$
})

const getMovie = movie => {
  const { code, originalTitle, title, genre, } = movie

  return {
    code,
    originalTitle,
    title,
    genre: getGenre(genre),
    directors: _.get(movie, 'castingShort.directors', ''),
    actors: _.get(movie, 'castingShort.actors', ''),
    cover: _.get(movie, 'poster.href', ''),
    releaseDate: _.get(movie, 'release.releaseDate', ''),
    distributor: _.get(movie, 'release.distributor.name', ''),
    rankTopMovie: _.get(movie, 'statistics.rankTopMovie', null),
    ratings: {
      pressRating: _.get(movie, 'statistics.pressRating', null),
      userRating: _.get(movie, 'statistics.userRating', null)
    }
  }
}

const getMovieList = list => _.get(list, 'feed.movie', []).map(movie => {
  return getMovie(movie)
})

const getTheaterList = list => _.get(list, 'feed.theater', []).map(
  ({ code, name, area, city, postalCode, address, picture = {} }) => ({
    code,
    name,
    area,
    city,
    postalCode: parseInt(postalCode, 10),
    address,
    picture: picture.href
  })
)

const getShowTimeList = list => _.get(list, 'feed.theaterShowtimes', [])
  .map(({ place: { theater }, movieShowtimes = [] }) => {

    const timeList = []
    movieShowtimes.forEach(({ onShow: { movie } , scr = [], version: versionFormat = {}, screenFormat = {} }) => {
      scr.forEach(({ d, t = [] }) => {
        const day = d
        const movieCode = movie.code
        const theaterCode = theater.code
        const version = getVersion(versionFormat)
        const format = getFormat(screenFormat)
        const code = hash.sha1(`
          ${day}
          ${format}
          ${movieCode}
          ${theaterCode}
          ${JSON.stringify(version)}
        `)

        timeList.push({
          code,
          theaterCode,
          movieCode,
          version,
          format,
          day,
          theaterName: theater.name,
          movieTitle: movie.title,
          times: t.map(r => ({
            buyLink: _.get(r, 'tk'),
            time: _.get(r, '$')
          }))
        })
      })
    })

    return {
      theaterCode: theater.code,
      timeList,
    }
  }
)

exports.getMovie = getMovie
exports.getMovieList = getMovieList
exports.getTheaterList = getTheaterList
exports.getShowTimeList = getShowTimeList
