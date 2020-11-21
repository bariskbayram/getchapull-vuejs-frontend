<template>
  <div>
    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <button type="button" id="toggle-button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="/">GetchaPull</a>
        </div>
        <div id="navbar" class="navbar-collapse collapse" aria-expanded="false" style="height: 1px;">
          <ul class="nav navbar-nav navbar-right">
            <li><a href="#" @click.prevent="goProfile">Profile</a></li>
            <li><a href="#" @click.prevent="goSettings">Settings</a></li>
            <li><a href="#" @click.prevent="goHelp">Help</a></li>
            <li><a href="#" @click.prevent="logOut">Log Out</a></li>
          </ul>
          <form class="navbar-form navbar-right">
            <input type="text" class="form-control" placeholder="Search User..." @keyup.enter="search" />
          </form>
        </div><!--/.nav-collapse -->
      </div><!--/.container-fluid -->
    </nav>

    <router-view style="padding-top: 50px"></router-view>

  </div>


</template>

<script>

export default {
  name: "NavComponent",
  methods: {

    goProfile(){
      this.$router.push("/" + localStorage.getItem('username')).catch( () => {});
      if(document.getElementById('navbar').getAttribute('aria-expanded') == 'true'){
        document.getElementById("toggle-button").click();
      }
    },

    goSettings(){
      this.$router.push("/" + localStorage.getItem('username') + "/edit-profile").catch( () => {});
      if(document.getElementById('navbar').getAttribute('aria-expanded') == 'true'){
        document.getElementById("toggle-button").click();
      }
    },

    goHelp(){
      console.log("help sayfasına geçildi.")
      if(document.getElementById('navbar').getAttribute('aria-expanded') == 'true'){
        document.getElementById("toggle-button").click();
      }
    },

    search(){
      console.log("search edildi.")
    },

    logOut(){
      localStorage.clear();
      this.$router.push("/login");
    },
  }
}
</script>

<style scoped>

</style>