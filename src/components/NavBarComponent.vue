<template>
  <div>
    <header class="bg-dark-black fixed-navbar">
      <div class="container">
        <nav id="navbar">
          <div class="logo">
            <h1><a href="/">GetchaPull</a></h1>
          </div>
          <div class="search-and-links" :class="{'nav-active':isNavOpen}">
            <div class="search-block">
              <input class="search-bar" type="text" placeholder="| Search" @keyup.enter="search"/>
              <i class="fas fa-search"></i>
            </div>
            <ul class="nav-links">
              <li><a href="#" @click.prevent="goProfile">Profile</a></li>
              <li><a href="#" @click.prevent="goSettings">Settings</a></li>
              <li><a href="#" @click.prevent="goHelp">Help</a></li>
              <li><a href="#" @click.prevent="logOut">LogOut</a></li>
            </ul>
            <ul class="social-media-nav">
              <li><a href="#"><i class="fab fa-facebook"></i></a></li>
              <li><a href="#"><i class="fab fa-twitter"></i></a></li>
              <li><a href="#"><i class="fab fa-google"></i></a></li>
            </ul>
          </div>
          <div class="burger" :class="{'toggle':isNavOpen}" @click="isNavOpen=!isNavOpen">
            <div class="line1"></div>
            <div class="line2"></div>
            <div class="line3"></div>
          </div>
        </nav>
      </div>
    </header>

    <router-view class="content" :class="{'nav-active-content':isNavOpen}"></router-view>

  </div>
</template>

<script>

export default {
  name: "NavComponent",
  data() {
    return{
      isNavOpen: false,
    }
  },
  methods: {
    goProfile() {
      this.$router.push("/" + localStorage.getItem('username')).catch( () => {});
      this.isNavOpen = !this.isNavOpen;
    },

    goSettings() {
      this.$router.push("/" + localStorage.getItem('username') + "/edit-profile").catch( () => {});
      this.isNavOpen = !this.isNavOpen;
    },

    goHelp() {
      this.isNavOpen = !this.isNavOpen;
    },

    search() {
      console.log("search edildi.")
    },

    logOut() {
      localStorage.clear();
      this.$router.push("/login");
    },
  },
  created() {
    document.querySelector('body').classList.remove('red-background');
    document.querySelector('body').classList.add('white-background');
  }
}
</script>

<style scoped>

.bg-dark-black {
  background:  black;
}

.fixed-navbar {
  top: 0;
  left: 0;
  right: 0;
  position: fixed;
  z-index: 1030;
}

.container {
  max-width: 1170px;
  margin: 0 auto;
}

nav {
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.75rem;
  min-height: 45px;
}

nav .logo {
  color: rgb(223, 223, 223);
}

nav .logo h1 a {
  font-family: 'Texturina', serif;
  color: white;
}

nav .logo h1 a:visited {
  color: white;
}

nav .search-and-links {
  width: 90%;
  display: flex;
  justify-content: space-between;
  margin-left: 70px;
}

nav .search-and-links .nav-links {
  list-style-type: none;
  display: flex;
  align-items: center;
  font-size: 17px;
}

nav .search-and-links .nav-links li {
  border-right: 1px solid white;
}

nav .search-and-links .nav-links :last-child {
  border-right: 0px;
}

nav .search-and-links .nav-links li a{
  padding: 0.5rem;
  letter-spacing: 1.5px;
  color: rgb(223, 223, 223);
}

nav .search-and-links .nav-links li a:hover {
  color: white;
}

nav .search-and-links .social-media-nav {
  display: none;
  list-style: none;
}

nav .burger {
  display: none;
  cursor: pointer;
}

nav .burger div {
  width: 25px;
  height: 3px;
  background-color: rgb(223, 223, 223);
  margin: 5px;
  transition: all 0.3s ease;
}

.content {
  transition: transform 0.5s ease-in;
}

@media(max-width: 768px){

  body{
    overflow-x: hidden;
  }

  nav .search-and-links {
    background:black;
    width: 40%;
    position: absolute;
    right: 0px;
    top: 45px;
    height: 92vh;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    transform: translateX(100%);
    transition: transform 0.5s ease-in;
  }

  nav .search-and-links .nav-links li {
    border-right: 0px;
  }

  /* For animation */
  nav .search-and-links * {
    opacity: 1;
  }

  nav .search-and-links .search-block {
    margin: 20px 0;
    width: 80%;
  }

  nav .search-and-links .nav-links {
    height: 30%;
    justify-content: space-between;
    flex-direction: column;
  }

  nav .search-and-links .social-media-nav {
    margin: 40px 0;
    width: 80%;
    display: flex;
    justify-content: space-evenly;
  }

  nav .burger {
    display: block;
  }

  nav .nav-active {
    transform: translateX(0%);
  }

  .nav-active-content {
    transform: translateX(-40%);
  }

  .toggle .line1 {
    transform: rotate(-45deg) translate(-5px, 6px);
  }
  .toggle .line2 {
    opacity: 0;
  }
  .toggle .line3 {
    transform: rotate(45deg) translate(-5px, -6px);
  }

}

@keyframes nav-mobile-fade {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0px);
  }
}

</style>