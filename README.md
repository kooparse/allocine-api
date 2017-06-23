# Allociné API

Push and update new contents on your DB:

<img width="664" alt="screen shot 2017-06-23 at 1 52 20 pm" src="https://user-images.githubusercontent.com/2859122/27481182-9b8084f8-581b-11e7-9a92-43ec7684fee1.png">

Exemple of movie information:

<img width="904" alt="screen shot 2017-06-23 at 1 56 54 pm" src="https://user-images.githubusercontent.com/2859122/27481231-db6f15ac-581b-11e7-84af-75388f02d30a.png">


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
