<template>
  <div>
    <div class="modal-header">
      <slot name="header">
        <p>Adding a new album review !</p>
      </slot>
    </div>

    <div class="modal-body">
      <slot name="body">
        <input type="text" class="input-lg" v-model="review.review_title" placeholder="Review Title">
        <br/><br/>
        <input type="text" class="input-lg" v-model="review.review_content" placeholder="Review Content">
        <br/><br/>
        <input type="number" class="input-lg" v-model="review.review_point" placeholder="Review Point">
      </slot>
    </div>

    <div class="modal-footer">
      <slot name="footer">
        <button class="btn btn-danger" v-on:click="$emit('close')">
          Cancel
        </button>
        <button v-if="review.review_point != ''" class="btn btn-success" v-on:click="pushReview">
          Create
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
        review_point: ''
      }
    }
  },
  methods: {
    pushReview () {
      this.$emit('pushAllDatas', this.review);
    }
  }
}
</script>

<style scoped>

</style>