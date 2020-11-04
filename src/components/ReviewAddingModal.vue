<template>
  <div>
    <div class="modal-header">
      <slot name="header">
        <h2>Adding a new album review !</h2>
      </slot>
    </div>

    <md-app>
      <md-app-content>
        <slot class="modal-body">
          <slot name="body">
            <md-field>
              <label>Review Title</label>
              <md-input v-model="review.review_title" maxlength="30"></md-input>
            </md-field>
            <md-field>
              <label>Review Content</label>
              <md-textarea v-model="review.review_content" md-autogrow md-counter="300"></md-textarea>
            </md-field>
            <md-field>
              <label>Review Point</label>
              <md-input type="number" v-model="review.review_point"></md-input>
              <span class="md-suffix">/10</span>
            </md-field>
            <span v-if="pointError" class="md-error error-mine">Point cannot be more than 10.</span>
          </slot>
        </slot>
      </md-app-content>
    </md-app>

    <div class="modal-footer">
      <slot name="footer">
        <button class="btn btn-danger" v-on:click="$emit('closeModal')">
          Cancel
        </button>
        <button v-if="review.review_point != null" :disabled="isProgressActive" class="btn btn-success" v-on:click="pushReview">
          <span v-if="!isProgressActive">
                    Create
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
export default {
  name: "ReviewAddingModal",
  data () {
    return {
      review: {
        review_title: '',
        review_content: '',
        review_point: null
      },
      pointError: false,
      isProgressActive: false,
    }
  },
  methods: {
    pushReview () {
      if(this.review.review_point >10){
        this.pointError = true;
      }else if(this.review.review_point == null) {
        this.pointError = true;
      }else{
        this.isProgressActive = true;
        this.$emit('pushAllDatas', this.review);
      }
    }
  }
}
</script>

<style scoped>

.error-mine{
  color: red;
}

</style>