<template>

  <div class="modal" id="modal">
    <div class="modal-header">
      <h1>{{ theBand.bandName }}</h1>
      <a href="#" @click.prevent="deleteBand" v-if="isMyProfile" >
        <i class="fas fa-trash-alt delete-icon"></i>
      </a>
    </div>
    <div class="modal-close" @click="$emit('close')">
      <div class="close-rotation">
        <div class="line1"></div>
        <div class="line2"></div>
      </div>
    </div>
    <div class="modal-guts">
      <div class="modal-image">
        <img :src="theBand.src" :key="reRenderCount"/>
      </div>
      <div class="modal-info">
        <h4>Albums that you listen from this band.</h4>
        <ul v-for="(album,index) in albums" v-bind:key="index">
          <li>
            <a>{{album.name}}</a>
          </li>
        </ul>
      </div>
    </div>
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
      albums: [],
      reRenderCount: 0
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
    },

    getBandPhoto (){
      axios.get(this.$url + "/api/bands/" + this.theBand.bandId + "/image/download",
          {
            headers: {
              'Authorization': localStorage.getItem('user-token'),
              responseType: 'arrayBuffer'
            },
            params: {
              username: this.theBand.postOwner
            }
          }).then( res => {
        this.theBand.src = "data:image/jpeg;base64," + Buffer.from(res.data, 'binary');
        this.reRenderCount++;
      });
    }
  },

  mounted() {
    if(this.theBand.src == null){
      console.log("fotogetirici")
      this.getBandPhoto();
    }
    this.checkMyProfile();
    this.getAlbumsForTheBand();
  }
}
</script>

<style scoped>

.modal .modal-guts .modal-image {
  margin-right: 35px;
}

.modal .modal-guts .modal-info ul{
  margin-top: 10px;
}

@media screen and (max-width: 768px) {
  .modal .modal-guts .modal-image {
    margin-right: 5px;
  }
}


</style>