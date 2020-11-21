<template>
  <div>
    <md-app>
      <md-app-content>
        <div class="container-fluid">
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 every-card" v-for="(album ,index) in allAlbums" v-bind:key="index">
            <div >
              <md-checkbox v-model="picked" :value="album">
                <md-card>
                  <md-card-header>
                    <div class="md-title">{{album.name}} - {{album.release_date.substring(0,4)}}</div>
                  </md-card-header>
                  <md-card-media md-medium>
                    <img :src="album.images[0].url" v-if="album.images.length > 0"/>
                    <img src="https://i.pinimg.com/originals/9e/df/af/9edfaf9d82b6d107b25cbe6824926572.png" v-else />
                  </md-card-media>
                </md-card>
              </md-checkbox>
            </div>
          </div>
        </div>
      </md-app-content>
    </md-app>

    <div class="modal-footer">
      <slot name="footer">
        <button class="btn btn-danger" @click="$emit('closeModal')">
          Cancel
        </button>
        <button class="btn btn-success" :disabled="isProgressActive" v-if="picked != null" @click="pushSelectedAlbumToParent">
         <span v-if="!isProgressActive">
                    Next
          </span>
          <span v-else>
            <md-progress-spinner id="spinner" :md-diameter="20" :md-stroke="3"
                                 md-mode="indeterminate"/>
          </span>
        </button>
      </slot>
    </div>
  </div>
</template>

<script>

const axios = require('axios');

export default {
  name: "AlbumAddingModal",
  data () {
    return {
      picked: null,
      allAlbums: [],
      isProgressActive: false,
    }
  },
  methods: {
    getAllAlbums () {
      console.log(this.$attrs.token);
      axios.get("https://api.spotify.com/v1/artists/" + this.$attrs.bandId + "/albums", {
        headers: {
          'Authorization': 'Bearer ' + this.$attrs.token,
          "Accept" : "application/json",
          "Content-Type": "application/json"
        },
        params: {
          limit: 30,
          market: 'TR'
        },
        json: true
      }).then( (res) => {
        console.log(res)
        this.allAlbums = res.data.items;
        this.trimAlbums();
      })
    },
    pushSelectedAlbumToParent () {
      this.$emit('toReviewPart', this.picked);
    },
    trimAlbums(){
      let result = [];
      this.allAlbums.forEach( (album, index) => {
        if(!this.countMoreThanOne(album.name)){
          result.push(album);
        }else{
          this.allAlbums.splice(index,1)
        }
      })
    },
    countMoreThanOne(name){
      let count = 0;
      this.allAlbums.forEach( (album) => {
        if(album.name == name){
          count++;
        }
      })
      if(count > 1){
        return true;
      }else{
        return false;
      }
    }
  },
  async created() {
    this.getAllAlbums();
  }
}
</script>

<style scoped>
.albums{
  margin-left: 20px;
  font-size: large;
}


.md-card {
  width: 250px;
  margin: 4px;
  display: inline-block;
  vertical-align: top;
}

.md-app {
  max-height: 430px;
}

.every-card {
  margin-bottom: 40px;
}

.md-checkbox {
  margin-bottom: 400px;
}
</style>