<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              <p>Adding a new album review !</p>
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <input type="text" class="input-lg" v-model="band_name" placeholder="Band name">
              <br/><br/>
              <input type="file" v-on:change="onBandFileChanged">
              <br/><br/>
              <input type="text" class="input-lg" v-model="album_title" placeholder="Album title">
              <br/><br/>
              <input type="file" v-on:change="onAlbumFileChanged">
              <br/><br/>
              <input class="input-lg" type="number" v-model="point" placeholder="Year">
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="btn btn-danger" v-on:click="$emit('close')">
                Cancel
              </button>
              <button class="btn btn-success" v-on:click="createAlbumReview">
                Create
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
const axios = require('axios');

export default {
  name: "AddAlbumContent",
  data(){
    return{
      selectedBandFile:null,
      selectedAlbumFile:null,
      band_name:'',
      album_title:'',
      point:''
    }
  },
  methods:{

    onAlbumFileChanged(event){
      this.selectedAlbumFile = event.target.files[0]
    },

    onBandFileChanged(event){
      this.selectedBandFile = event.target.files[0]
    },

    createAlbumReview(){
      this.$emit('close');
      const formData = new FormData();
      formData.append("album_file", this.selectedAlbumFile);
      formData.append("band_file", this.selectedBandFile);
      formData.append("album_title", this.album_title);
      formData.append("band_name", this.band_name);
      formData.append("year", this.point);
      formData.append("username", this.$route.params.username);
      axios.post("https://metal-review-spring.herokuapp.com/api/albums/image/upload",
        formData,
          {
            headers:{
              "Content-Type":"multipart/form-data",
              "Authorization": localStorage.getItem('user-token')
            }
          }
      ).then(() => {
          console.log("datas uploaded successfully");
      }).catch(err => {
          console.log(err);
      });
    }

  }
}
</script>

<style scoped>

</style>