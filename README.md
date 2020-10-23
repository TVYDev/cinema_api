# Movieer APIs

> 🏗 **Currently in development**

APIs for cinema management including CRUD on cinemas, halls, movies, buying tickets, admin panel...

## I. Features

### 🎥 Cinemas

-   ✅ [Admin] Create a new branch
-   ✅ [Admin] Update branch basic info (name, location, opening hours => 7AM - 10PM)
-   ✅ [Public] Get all cinemas
-   ✅ [Public] Get a single cinema
-   ✅ [Admin] Delete a cinema
-   ✅ [Admin] Upload layout image of cinema ((halls, entrances, exits, seats, counter desk, Snacks & drinks stalls))
-   ✅ [Admin] Upload photo of cinema

### 🎪 Halls

-   ✅ [Admin] Add a new hall to a cinema (name, cinema ID, hall types ID, seats => JSON object, hall location image)
-   ✅ [Admin] Update a hall
-   ✅ [Admin] Get all halls
-   ✅ [Admin] Get all halls of a cinema
-   ✅ [Admin] Get a single hall
-   ✅ [Admin] Delete a hall

### 🏭 Hall Types

-   ✅ [Admin] Create a hall type (name: 2D, 3D, 4D, IMAX, VIP, PREMIUM, description, compatible movie type ids)
-   ✅ [Admin] Update a hall type
-   ✅ [Admin] Get all hall types
-   ✅ [Admin] Get all halls of a hall type
-   ✅ [Admin] Get a single hall type
-   ✅ [Admin] Delete a hall type
-   ✅ [Admin] Get all compatible hall types for a movie type

### 🎬 Movies

-   ✅ [Admin] Create a movie (title, ticketPrice, durationInMinutes, genre ids, movie type id, release date => (for coming soon section) , spoken language id, subtitile language id, country id, description, trailer url, banner url)
-   ✅ [Admin] Update a movie
-   ✅ [Admin] Get all movies
-   ✅ [Admin] Get all movies of a movie type
-   ✅ [Admin] Get all movies of a spoken language
-   ✅ [Admin] Get all movies of a subtitle language
-   ✅ [Admin] Get all movies of a country
-   ✅ [Admin] Get a single movie
-   ✅ [Admin] Delete a movie

### 🎦 Movie Types

-   ✅ [Admin] Create a movie type (name: 2D, 3D, 4D, description)
-   ✅ [Admin] Update a movie type
-   ✅ [Admin] Get all movie types
-   ✅ [Admin] Get a single movie type
-   ✅ [Admin] Delete a movie type

### 🎃 Genres

-   ✅ [Admin] Create a genre (name, description)
-   ✅ [Admin] Update a genre
-   ✅ [Admin] Get all genres
-   ✅ [Admin] Get all movies of a genre
-   ✅ [Admin] Get a single genre
-   ✅ [Admin] Delete a genre

### 🔤 Languages

-   ✅ [ADMIN] Create a language (name)
-   ✅ [ADMIN] Update a language
-   ✅ [ADMIN] Get all languages
-   ✅ [ADMIN] Get a single language
-   ✅ [ADMIN] Delete a language

### 🚩 Countries

-   ✅ [ADMIN] Create a country (name, code)
-   ✅ [ADMIN] Update a country
-   ✅ [ADMIN] Get all country
-   ✅ [ADMIN] Get a single country
-   ✅ [ADMIN] Delete a country

### ⌚ Showtimes

-   ✅ [Admin] Add a movie showtime to a hall of a cinema
-   ✅ [Admin] Update a showtime (movie id, startedDateTime, cinema id)
-   ✅ [Public] Get all showtimes
-   ✅ [Public] Get all showtimes of a movie
-   ✅ [Public] Get a showtime
-   ✅ [Admin] Delete a showtime

### 🎫 Purchases

-   [Private] Initiate a purchase request
-   [Private] Create a purchase request (user id => (Guest or Normal user), showtime id, bought seats, datetime)
-   [Private] Execute a purchase request
-   [Private] Get all my purchases
-   [Private] Get my single purchases
-   [Admin] Get all purchases
-   [Admin] Get a single purchases
-   [Admin] Cancel a purchase

> **Initiate purchase request**
>
> -   Reserve time for seats selection and purchase for the user

> **Create purchase request**
>
> -   Return response to front-end if purchase could be made, with total price, seats selection, hall, movie. (Served as confirmation screen)

> **Execute purchase request**
>
> -   Generate a QR code

> **CHALLENGES**
>
> -   Integrate Stripe API for payment

### 🔊 Announcements

-   ✅ [Admin] Add new announcement (title, description, image, start datetime, end datetime)
-   ✅ [Admin] Update an announcement (title, description, image, start datetime, end datetime)
-   ✅ [Public] Get all annoucements
-   ✅ [Public] Get a single annoucement
-   ✅ [Admin] Delete an annoucement
-   ✅ [Admin] Upload image of announcement

### 📑 Membership

-   [Admin] Create a membership (name, level, description)
-   [Admin] Update a membership
-   [Public] Get all memberships
-   [Public] Get a single membership
-   [Admin] Delete a membership

### 😀 User

-   [Admin] Create a user (name, email, password, membership id)
-   [Admin] Update a user
-   [Admin] Get all users
-   [Admin] Get a single user
-   [Admin] Delete a user

### 👨‍💻 Authentication

-   [Public] Register a user (name, email, password)
-   [Public] Login a user
-   [Private] Change password of a user
-   [Public] Reset password of a user
-   [Private] Get profile user
-   [Private] Logout user

### 💻 Admin/Staff Panel

> Note: Admin/Staff can purchase ticket(s) for a customer

-   [Admin, Staff] Print movie tictets
-   [Admin] Graph show movies tickets solved a period
-   [Admin] Graph show current-showing movies tickets solved

### 📐 Settings

-   [Admin] Configure minimum minutes between movie showtimes
-   [Admin] Configure whether discount if user buy tickets through mobile apps, and discount amount/percentage
-   [Admin] Configure amount of minutes for seats selection and purchase
-   [Admin] Configure sequence of announcements
-   [Admin] Configure recommended list of movies

#

## II. Technlogies Using

<br />
<img src="https://icon-library.com/images/nodejs-icon/nodejs-icon-24.jpg" height=50/>
<img src="https://expressjs.com/images/express-facebook-share.png" height=50/>
<img src="https://webassets.mongodb.com/_com_assets/cms/mongodb_logo1-76twgcu2dm.png" height=50/>
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/800px-Npm-logo.svg.png" height=50/>
<img src="https://ucarecdn.com/e6a83674-f37e-453b-98e0-90b5c3193046/" height=80/>
<img src="https://fastnetmon.com/wp-content/uploads/2019/04/DO.png" height=100/>
