# GetchaPull - Frontend - Vue.js

[![Apache-2.0 License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

GetchaPull website -> https://getchapull.wtf

* PostgreSQL -> Google Cloud SQL
* spring-backend -> Google Cloud Run
* vuejs-frontend -> Google Cloud Run

<!-- ABOUT THE PROJECT -->
## About The Project

GetchaPull is a Twitter-like web page for sharing music reviews with others. In the beginning, I was trying to make a web page just for myself with the same aim. Then it became a bigger project than I thought. GetchaPull has 2 repo in Github, one of them is [Spring-Backend](https://github.com/bariskbayram/getchapull-spring-backend) and another one is [VueJS-Frontend](https://github.com/bariskbayram/getchapull-vuejs-frontend). 

The VueJs-Frontend side of the Getchapull is implemented for sending requests to the Spring-Backend side. It has grown even more while adding new features to it. I did almost all the HTML structure and CSS design myself from scratch. I implemented it through Vue.js by using components. It has still several performance issues, I'm gonna keep adding new features and fixing the issues.

* You can add new reviews to your profile.
* You can follow or unfollow other users.
* You can see other reviews belong to one user through its profile page.
* You can see the posts belonging to other users that are followed by you on the main page.

### Build and Run on your localhost

  * It requires Spotify API credentials, so firstly you need to get these. 
  Then you can go to ```src/components/AddAlbumComponent.vue``` file to change ```client_id``` and ```client_secret``` fields. 

1. Download and unzip the source repo, or clone it using Git:
  ```sh
    git clone https://github.com/bariskbayram/getchapull-vuejs-frontend.git
   ```
2. cd into 
  ```sh 
    cd getchapull-vuejs-frontend
  ```
3. Build image and run with Docker
  ```sh
    docker build -t getchapull-vue .
    docker run --name getchapull-vue -d -p 8080:8080 getchapull-vue
  ```
  
* On this side of GetchaPull, it requires authentication so, if you wanna use the whole GetchaPull implementation, run the backend side too.

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

[linkedin-shield]: https://img.shields.io/static/v1?label=LINKEDIN&message=BKB&color=<COLOR>
[linkedin-url]: https://www.linkedin.com/in/bar%C4%B1%C5%9F-kaan-bayram-121850101
[license-shield]: https://img.shields.io/static/v1?label=LICENCE&message=Apache-2.0&color=<COLOR>
[license-url]: https://github.com/bariskbayram/BusCardSystem/blob/master/LICENSE
