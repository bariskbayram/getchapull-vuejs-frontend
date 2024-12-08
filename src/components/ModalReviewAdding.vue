<template>

  <div class="modal" id="modal">
    <div class="modal-header">
      <h1>Adding review!</h1>
      <div class="modal-confirm">
        <button class="btn-green" v-if="review.point != null"
                @click="pushReview"
                :disabled="isProgressActive">
          <div v-if="!isProgressActive">Create</div>
            <div v-else class="spinner-loader">
              <div class="rect1"></div>
              <div class="rect2"></div>
              <div class="rect3"></div>
              <div class="rect4"></div>
              <div class="rect5"></div>
              <div class="rect6"></div>
              <div class="rect7"></div>
              <div class="rect8"></div>
            </div>
        </button>
      </div>
    </div>
    <div class="modal-close" @click="$emit('closeModal')">
      <div class="close-rotation">
        <div class="line1"></div>
        <div class="line2"></div>
      </div>
    </div>
    <div class="modal-guts">
      <div class="input-section">
        <label class="with-input-border">Title</label>
        <input type="text" v-model="review.title" required autofocus="" maxlength="30"/>
      </div>
      <div class="input-section">
        <label class="with-input-border">Content</label>
        <textarea v-model="review.content" required maxlength="350" rows="5" cols="50" />
      </div>
      <div class="input-section">
        <label class="with-input-border">Point</label>
        <div class="radios">
          <div class="radio" v-for="(value) in 10" v-bind:key="value">
            <input type="radio" id="one" :value="value" v-model="review.point">
            <label for="one">{{ value }}</label>
          </div>
        </div>
      </div>
      <span v-if="pointError" class="error">Point cannot be more than 10.</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ReviewAddingModal",
  data() {
    return {
      review: {
        title: '',
        content: '',
        point: null
      },
      pointError: false,
      isProgressActive: false,
    }
  },
  methods: {
    pushReview() {
      if (this.review.point >10) {
        this.pointError = true;
      } else if (this.review.point == null) {
        this.pointError = true;
      } else {
        this.isProgressActive = true;
        this.$emit('pushAllDatas', this.review);
      }
    }
  }
}
</script>

<style scoped>

.spinner-loader > div {
  height: 50%;
  position: relative;
  top: -4px;
}

.modal {
  height: 400px;
}

.modal .modal-guts {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.input-section {
  margin-bottom: 30px;
  width: 80%;
}

.input-section textarea {
  width: 100%;
  border: 0;
  outline: 0;
  resize: none;
}

.input-section .radios {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-section .radios .radio{
  width: 20px;
  display: flex;
  flex-direction: column;
}

.input-section .radios .radio label {
  text-align: center;
}

.btn-green {
  width: 100px;
  font-size: 0.9rem;
  cursor: pointer;
  max-height: 50px;
}

.btn-green:disabled {
  width: 100px;
  font-size: 0.9rem;
  cursor: pointer;
  max-height: 50px;
}

@media screen and (max-width: 768px) {

  .modal {
    height: 70%;
  }

  .input-section {
    width: 100%;
  }

  .modal .modal-header {
    justify-content: space-between;
  }

}

@media screen and (max-width: 500px){

  .modal .modal-header {
    font-size: 0.4rem;
  }

  .modal .modal-header .modal-confirm {
    right: 10px;
  }

  .btn-green {
    font-size: 0.6rem;
    width: 100px;
  }

}

</style>