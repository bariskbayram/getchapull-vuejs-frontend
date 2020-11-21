<template>
  <div>
    <md-dialog :md-active.sync="showDialog"
               @md-closed="$emit('close')" @md-clicked-outside="$emit('close')">
      <md-app>
        <md-app-content>
          <div class="modal-header">
            <h2>{{theReview.bandName}} - {{ theReview.albumName }}</h2>
          </div>

          <div class="modal-body">
            <div class="col-md-6">
              <slot name="header">
                <img class="img-mine" style="width:60%" v-bind:src="theAlbum.src"/>
              </slot>
            </div>
            <slot name="body">
              <h3>{{theReview.title}}</h3>
              <p>{{theReview.content}}</p>
              <h2>{{theReview.point}}/10</h2>
            </slot>
          </div>
        </md-app-content>
      </md-app>


      <div class="modal-footer">
        <slot name="footer">
          <button v-if="isMyProfile" class="btn btn-warning" v-on:click="$emit('close')">
            Edit
          </button>
          <button v-if="isMyProfile" class="btn btn-danger" v-on:click="deleteAlbumAndReview">
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
  name: "AlbumDetails",
  props: {
    theAlbum: {},
    propsReview: {}
  },
  data () {
    return {
      isMyProfile: false,
      showDialog: true,
      theReview: {}
    }
  },
  methods: {
    deleteAlbumAndReview () {
      this.deleteAlbum(this.theAlbum);
      this.deleteReview(this.theReview);
    },
    deleteAlbum (album) {
      axios.delete(this.$url + "/api/albums/" + album.id, {
        headers: {
          'Authorization': localStorage.getItem('user-token'),
        },
        params: {
          username: localStorage.getItem('username')
        }
      })
    },
    deleteReview (review) {
      axios.delete( this.$url + "/api/reviews/" + review.reviewId, {
        headers: {
          'Authorization': localStorage.getItem('user-token'),
        }
      }).then( (res) => {
        console.log(res);
        this.$emit('close');
        this.$router.push("/");
      })
    },
    getReview () {
      console.log("review getirildi.")
      axios.get(this.$url + "/api/reviews/" + this.theAlbum.id,
          {
            headers: {
              "Authorization": localStorage.getItem('user-token'),
            },
            params: {
              username: this.theAlbum.author,
            }
          }).then(res => {
            this.theReview = res.data;
      })
    },
    checkMyProfile () {
      if(this.$route.path == "/" + localStorage.getItem('username')){
        this.isMyProfile = true;
      }else{
        this.isMyProfile = false;
      }
   }
  },
  mounted() {
    this.theReview = this.propsReview;
    this.checkMyProfile();
    if(this.theReview.bandName == ''){
      this.getReview();
    }
  }
}

</script>

<style scoped>
.md-app {
  max-height: 600px;
  border: 1px solid;
}

.img-mine{
  margin-bottom: 20px;
}
</style>