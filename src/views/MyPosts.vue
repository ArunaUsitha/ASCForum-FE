<template>
  <div class="posts">
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
                :class="postClass(post)"
        >
          <b-card-title class="cursor-pointer" @click="viewPost(post.id)">{{ post.title }}</b-card-title>
          <b-card-text class="elipsis">{{ post.text }}</b-card-text>
          {{ post.comments.length }}
          <b-icon-chat-text></b-icon-chat-text>
          <div class="mt-3">
            <b-button-group size="sm">
              <b-button @click="deletePost(post.id)" variant="danger">Delete</b-button>
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
      // return this.role.includes('Administrator')
    }
  },
  methods: {
    deletePost (postId) {
      api.get('/posts/delete/' + postId)
        .then((response) => {
          this.variant = 'success'
          this.dismissCountDown = 5
          this.dismissMessage = response.data.message
          this.getPosts()
        }).catch(error => console.log(error))
    },
    getPosts () {
      api.get('/posts/all')
        .then((response) => {
          this.posts = response.data.posts
          this.role = response.data.role
        }).catch(error => console.log(error))
    },
    postClass: function (post) {
      switch (post.status) {
        case '0':
          return 'pending'
        case '2':
          return 'rejected'
      }
    },
    viewPost: function (index) {
      return this.$router.push({ name: 'posts/view', params: { id: index } })
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

</style>
