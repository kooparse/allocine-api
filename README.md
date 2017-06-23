# Allociné API


## Install
### Unix and OS/X
- Fork or download this repository.
- `cd` to the project's location.
- run `yarn`.

## Running in development
- run `yarn start`.
- open `http://localhost/3005` on your favorite browser.


## API
- Liste of showtimes from zipcode.
`POST`::`/api/showtimelist` <zip: number>
- Liste of movie currently in theaters.
`GET`::`/api/nowshowing`
