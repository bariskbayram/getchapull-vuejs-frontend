# GetchaPull

[![Apache-2.0 License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

[Visit the Website](https://getchapull.wtf)

GetchaPull is a simple social platform for music lovers to share their thoughts on albums and discover new music. You can think of it like a mix between a review site and a social feed where you follow people for music-related updates.

## What You Can Do

* **Create a Profile:** Sign up, log in, and set up your music review space.
* **Review Albums:** Write reviews, rate albums, and fetch album details from Spotify automatically.
* **Follow Users:** See what others are reviewing and follow profiles you like.
* **Personalized Feed:** Reviews from the people you follow show up on your main page.
* **Save Media:** Album covers, band photos, and profile pictures are stored using AWS S3.

## How It Works

### Backend - [Spring-Backend Repository](https://github.com/bariskbayram/getchapull-spring-backend)

Handles everything behind the scenes:
* Connects to a PostgreSQL database to store users, reviews, bands and albums.
* Authenticates users with JWT.
* Saves images and other files to AWS S3.

### Frontend - [VueJS-Frontend Repository](https://github.com/bariskbayram/getchapull-vuejs-frontend)

This is what users see and interact with:
* Built with Vue.js.
* Fetches and displays data from the backend.
* Responsive and easy-to-use design.

## How to Run It Locally
### Requirements

* **Docker:** To run the app easily.
* **Spotify API credentials:** Needed for Spotify API integration.

#### It requires Spotify API credentials, so firstly you need to get these. Then you can go to `src/components/AddAlbumComponent.vue` file to change `client_id` and `client_secret` fields.


1. Clone the Frontend Repo:
  ```sh
    git clone https://github.com/bariskbayram/getchapull-vuejs-frontend.git
    cd getchapull-vuejs-frontend
   ```
2. Build images and run with Docker
  ```sh
    docker build -t getchapull-vue .
      docker run --name getchapull-vue -d -p 8080:8080 getchapull-vue
  ```

* Backend Setup: Follow instructions in [Spring-Backend Repository](https://github.com/bariskbayram/getchapull-spring-backend).

### Build with and Third-party

* VueJS
* Spotify API

[linkedin-shield]: https://img.shields.io/static/v1?label=LINKEDIN&message=BKB&color=<COLOR>
[linkedin-url]: https://www.linkedin.com/in/bar%C4%B1%C5%9F-kaan-bayram-121850101
[license-shield]: https://img.shields.io/static/v1?label=LICENCE&message=Apache-2.0&color=<COLOR>
[license-url]: https://github.com/bariskbayram/BusCardSystem/blob/master/LICENSE
