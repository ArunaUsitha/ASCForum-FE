<template>
  <div class="home">
    <b-row class="justify-content-md-center">
      <b-col lg="12">
        <NavBar/>
      </b-col>
      <b-col lg="8">
        <div class="posts-div">
          <posts/>
        </div>
      </b-col>
    </b-row>

  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'
import Posts from '@/components/Posts.vue'
import { mapState } from 'vuex'
// import api from '../api/api'
// import csrf from '@api/csrf'

export default {
  name: 'Home',
  components: {
    NavBar,
    Posts
  },
  computed: {
    ...mapState(['bearerToken'])
  }
}
</script>

<style scoped>
.posts-div{
  margin-top: 10px;
}
</style>
