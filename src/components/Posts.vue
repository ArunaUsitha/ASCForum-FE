<template>
  <div>
    <b-input-group class="mt-3">
      <b-form-input v-on:keyup="getPosts" v-model="search" placeholder="Search posts using title, text, author">Search
      </b-form-input>
    </b-input-group>
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
      | <span>Author : {{ post.user.name }}</span> |
      <b-icon-trash-fill v-if="canDelete(post.user.id)" @click="deletePost(post.id)" class="deleteButton">Delete</b-icon-trash-fill>
    </b-card>

  </div>
</template>

<script>
import api from '../api/api'

export default {
  name: 'Posts',
  data () {
    return {
      posts: [],
      role: '',
      search: '',
      variant: 'success',
      dismissSecs: 5,
      dismissCountDown: 0,
      dismissMessage: ''
    }
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    isAdmin: function () {
      return this.role.includes('Administrator')
    }
  },
  methods: {
    isOwner: function (userid) {
      const AuthUserID = localStorage.getItem('userId')
      return AuthUserID.toString() === userid.toString()
    },
    // eslint-disable-next-line vue/return-in-computed-property
    canDelete: function (userid) {
      if (this.isAdmin) {
        return true
      } else if (this.isOwner(userid)) {
        return true
      } else {
        return false
      }
    },
    deletePost (postId) {
      api.get('/posts/delete/' + postId)
        .then((response) => {
          this.variant = 'success'
          this.dismissCountDown = 5
          this.dismissMessage = response.data.message
          this.getPosts()
        }).catch(error => console.log(error))
    },
    postApiCall () {
      api.get('/posts/get?search=' + this.search)
        .then((response) => {
          this.posts = response.data.posts
          this.role = response.data.role
        }).catch(error => console.log(error))
    },
    getPosts () {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => {
        this.postApiCall()
      }, 500)
    },
    postClass: function (post) {
      if (post.status === '0') {
        return 'un-approved'
      }
    },
    viewPost: function (index) {
      return this.$router.push({
        name: 'posts/view',
        params: { id: index }
      })
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

.cursor-pointer {
  cursor: pointer;
}

.elipsis {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.un-approved {
  background-color: #ec8686;
}

.deleteButton{
  color: #c54141;
  cursor: pointer;
}

</style>
