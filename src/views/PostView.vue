<template>
  <div class="home">
    <b-row class="justify-content-md-center">
      <b-col lg="12">
        <NavBar/>
      </b-col>
      <b-col lg="8">
        <div class="posts-div">
          <h3>Post</h3>
          <b-card class="post-card"
                  v-bind:title="this.post.title">
            <b-card-text>{{ post.text }}</b-card-text>
          </b-card>
        </div>
      </b-col>

      <b-col lg="8">
        <div class="comments-div">
          <h3>Comments</h3>
          <div v-for="(comment) in comments" :key="comment.id">
            <p>{{ comment.text }} | by {{ comment.user.name }}</p>
            <hr>
          </div>
        </div>
      </b-col>

      <b-col lg="8">
        <b-alert
          :show="dismissCountDown"
          dismissible
          :variant="variant"
          @dismissed="dismissCountDown=0"
          @dismiss-count-down="countDownChanged"
        >
          {{ dismissMessage }}
        </b-alert>
        <b-form @submit="addComment">
          <b-form-group
            id="input-group-password"
            label=""
            label-for="comment">
            <b-form-textarea
              id="comment"
              name="comment"
              v-model="form.comment"
              placeholder="Add a comment to the post"
              required
            ></b-form-textarea>
            <span class="text-danger" v-if="errors.comment">{{ errors.comment[0] }}</span>
          </b-form-group>
          <div>
            <b-button type="submit" variant="primary">Submit</b-button>&nbsp;
          </div>
        </b-form>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import api from '../api/api'

export default {
  name: 'PostView',
  components: {
    NavBar
  },
  data () {
    return {
      form: {
        postId: this.$route.params.id,
        comment: ''
      },
      post: '',
      comments: [],
      errors: [],
      variant: 'success',
      dismissSecs: 5,
      dismissCountDown: 0,
      dismissMessage: ''
    }
  },
  methods: {
    getPost () {
      api.get('/post-view/' + this.form.postId)
        .then((response) => {
          this.post = response.data[0]
          this.comments = response.data[0].comments
        })
    },
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert () {
      this.dismissCountDown = this.dismissSecs
    },
    addComment (event) {
      event.preventDefault()
      api.post('/comment-add', this.form)
        .then((response) => {
          this.getPost()
          this.resetForm()
          this.variant = 'success'
          this.dismissCountDown = 5
          this.dismissMessage = response.data.message
        })
        .catch(error => {
          if (error.response.status === 422) {
            this.errors = error.response.data.validation_errors
          } else if (error.response.status === 500) {
            this.variant = 'danger'
            this.dismissCountDown = 5
            this.dismissMessage = error.response.data.message
          } else if (error.response.status === 401) {
            this.$router.push({ name: 'Login' })
          }
        })
    },
    resetForm () {
      this.form.comment = ''
    }
  },
  mounted () {
    this.postId = this.$route.params.id
    this.getPost()
  }
}
</script>

<style scoped>
.post-card {
  margin: 10px 10px;
  cursor: pointer;
}

</style>
