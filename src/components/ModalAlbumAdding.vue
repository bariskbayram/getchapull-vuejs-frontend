<template>

  <div class="modal" id="modal">
    <div class="modal-header">
      <h1>Select the album</h1>
      <div class="modal-confirm">
        <button class="btn-green" v-if="picked != null"
                @click="pushSelectedAlbumToParent">Next</button>
      </div>
    </div>
    <div class="modal-close" @click="$emit('closeModal')">
      <div class="close-rotation">
        <div class="line1"></div>
        <div class="line2"></div>
      </div>
    </div>
    <div class="modal-guts">
      <div class="select-section" >
        <div class="card" v-for="(album ,index) in allAlbums" v-bind:key="index">
          <div class="card-content" tabindex="0" @click="picked = album">
            <div class="text-part">
              <h3>{{  album.name }} - {{ album.release_date.substring(0,4) }}</h3>
            </div>
            <div class="image-part image-band">
              <img :src="album.images[0].url" v-if="album.images.length > 0"/>
              <img src="https://i.pinimg.com/originals/9e/df/af/9edfaf9d82b6d107b25cbe6824926572.png" v-else />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

const axios = require('axios');

export default {
  name: "AlbumAddingModal",
  data() {
    return {
      picked: null,
      allAlbums: [],
      isProgressActive: false,
    }
  },
  methods: {
    getAllAlbums() {
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
      }).then((res) => {
        this.allAlbums = res.data.items;
        this.trimAlbums();
      })
    },
    pushSelectedAlbumToParent() {
      this.$emit('toReviewPart', this.picked);
    },
    trimAlbums() {
      let result = [];
      this.allAlbums.forEach( (album, index) => {
        if (!this.countMoreThanOne(album.name)) {
          result.push(album);
        } else {
          this.allAlbums.splice(index,1)
        }
      })
    },
    countMoreThanOne(name) {
      let count = 0;
      this.allAlbums.forEach( (album) => {
        if (album.name === name) {
          count++;
        }
      })
      return count > 1;
    }
  },
  async created() {
    this.getAllAlbums();
  }
}
</script>

<style scoped>

.btn-green {
  width: 140px;
  cursor: pointer;
}

.modal {
  width: 80%;
  height: 85%;
}

.card .card-content:focus {
  outline: 8px solid #048315;
}

.modal .modal-guts {
  padding: 20px 20px 20px 20px;
}

@media screen and (max-width: 768px){

  .btn-green {
    font-size: 1rem;
  }

  .modal .modal-header {
    justify-content: space-between;
  }

  .card .card-content .image-band {
    width: 100%;
    height: 100%;
  }

  @keyframes animateleft {
    from {left: -300px; opacity: 0}
    to {left: 35%; opacity: 1}
  }
}

@media screen and (max-width: 500px){

  .modal .modal-header .modal-confirm {
    right: 10px;
  }

  .btn-green {
    font-size: 0.8rem;
    width: 100px;
  }

}
</style>