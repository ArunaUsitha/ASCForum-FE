<template>
  <div class="posts-pending">
    <b-row class="justify-content-md-center">
      <b-col lg="12">
        <NavBar/>
      </b-col>
      <b-col lg="8">
        <b-alert class="alert-custom"
          :show="dismissCountDown"
          dismissible
          :variant="variant"
          @dismissed="dismissCountDown=0"
          @dismiss-count-down="countDownChanged"
        >
          {{ dismissMessage }}
        </b-alert>
        <b-card class="post-card"
                v-for="(post) in posts"
                :key="post.id"
        >
          <b-card-title class="cursor-pointer" @click="viewPost(post.id)">{{ post.title }}</b-card-title>
          <b-card-text class="elipsis">{{ post.text }}</b-card-text>
          {{ post.comments.length }}
          <b-icon-chat-text></b-icon-chat-text>
          <div class="mt-3">
            <b-button-group size="sm">
              <b-button @click="ApprovePost(post.id)" v-if="isAdmin" variant="success">Approve</b-button>
              <b-button @click="RejectPost(post.id)" v-if="isAdmin" variant="warning">Reject</b-button>
              <b-button @click="deletePost(post.id)" v-if="isAdmin" variant="danger">Delete</b-button>
            </b-button-group>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import api from '../api/api'

export default {
  name: 'Posts',
  data () {
    return {
      posts: [],
      role: '',
      variant: 'success',
      dismissSecs: 5,
      dismissCountDown: 0,
      dismissMessage: '',
      show: true
    }
  },
  components: {
    NavBar
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    isAdmin: function () {
      return this.role.includes('Administrator')
    }
  },
  methods: {
    deletePost (postId) {
      api.get('/post-delete/' + postId)
        .then((response) => {
          this.variant = 'success'
          this.dismissCountDown = 5
          this.dismissMessage = response.data.message
          this.getPosts()
        })
    },
    ApprovePost (postId) {
      api.post('/post-approve', { postId })
        .then((response) => {
          console.log(response)
          this.variant = 'success'
          this.dismissCountDown = 5
          this.dismissMessage = response.data.message
          this.getPosts()
        })
        .catch(error => {
          if (error.response.status === 500) {
            this.variant = 'danger'
            this.dismissCountDown = 5
            this.dismissMessage = error.response.data.message
          } else if (error.response.status === 401) {
            this.$router.push({ name: 'Login' })
          }
        })
    },
    RejectPost (postId) {
      api.post('/post-reject', { postId })
        .then((response) => {
          this.variant = 'success'
          this.dismissCountDown = 5
          this.dismissMessage = response.data.message
          this.getPosts()
        })
        .catch(error => {
          if (error.response.status === 500) {
            this.variant = 'danger'
            this.dismissCountDown = 5
            this.dismissMessage = error.response.data.message
          } else if (error.response.status === 401) {
            this.$router.push({ name: 'Login' })
          }
        })
    },
    getPosts () {
      api.get('/posts-pending')
        .then((response) => {
          this.posts = response.data.posts
          this.role = response.data.role
        })
    },
    postClass: function (post) {
      if (post.status === '0') {
        return 'un-approved'
      }
    },
    viewPost: function (index) {
      return this.$router.push({ name: 'post-view', params: { id: index } })
    },
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert () {
      this.dismissCountDown = this.dismissSecs
    }
  },
  beforeMount () {
    this.getPosts()
  }
}
</script>

<style scoped>
.post-card {
  margin: 10px 10px;
}
.cursor-pointer{
  cursor: pointer;
}
.alert-custom{
 margin-top: 10px;
}
.elipsis{
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.un-approved {
  background-color: #ec8686;
}

</style>
