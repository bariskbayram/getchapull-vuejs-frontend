<template>
  <div>
    <md-dialog :md-active.sync="showDialog"
               @md-closed="$emit('close')" @md-clicked-outside="$emit('close')">
      <md-app>
        <md-app-content>
          <div class="modal-header">
            <h2> {{ theBand.bandName }} </h2>
          </div>

          <div class="modal-body">
            <div class="col-md-6">
              <slot name="header">
                <img class="img-mine" style="width:60%" v-bind:src="theBand.src"/>
              </slot>
            </div>
            <slot name="body">
              <h4>Other albums that you listen from this band.</h4>
              <ul v-for="(album,index) in albums" v-bind:key="index">
                <li>
                  <a>{{album.name}}</a>
                </li>
              </ul>
            </slot>
          </div>
        </md-app-content>
      </md-app>


      <div class="modal-footer">
        <slot name="footer">
          <button v-if="isMyProfile" class="btn btn-warning" v-on:click="$emit('close')">
            Edit
          </button>
          <button v-if="isMyProfile" class="btn btn-danger" v-on:click="deleteBand">
            Delete
          </button>
          <button class="btn btn-primary" v-on:click="$emit('close')">
            Close
          </button>
        </slot>
      </div>
    </md-dialog>
  </div>
</template>

<script>

const axios = require('axios');

export default {
  name: "BandDetails",
  props: {
    theBand: {}
  },
  data () {
    return {
      isMyProfile: false,
      showDialog: true,
      albums: []
    }
  },
  methods: {
    deleteBand () {
      axios.delete(this.$url + "/api/bands/" + this.theBand.bandId, {
        headers: {
          'Authorization': localStorage.getItem('user-token'),
        },
        params: {
          username: localStorage.getItem('username')
        }
      }).then( (res) => {
        console.log(res);
        this.$emit('close');
        this.$router.push("/");
      })
    },
    checkMyProfile () {
      if(this.$route.path == "/" + localStorage.getItem('username')){
        this.isMyProfile = true;
      }else{
        this.isMyProfile = false;
      }
    },
    getAlbumsForTheBand() {
      axios.get(this.$url + "/api/albums/albums-of-band", {
        headers: {
          'Authorization': localStorage.getItem('user-token'),
        },
        params: {
          username: localStorage.getItem('username'),
          bandId: this.theBand.bandId
        }
      }).then( (res) => {
        console.log(res);
        this.albums = res.data;
      })
    }
  },
  mounted() {
    this.checkMyProfile();
    this.getAlbumsForTheBand();
  }
}
</script>

<style scoped>

</style>