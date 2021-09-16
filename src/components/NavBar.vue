<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="/">ASC Forum</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="/posts/create">New post</b-nav-item>
          <b-nav-item href="/posts/all">My posts</b-nav-item>
          <b-nav-item href="/posts/pending">Pending posts</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em>{{  username }}</em>
            </template>
            <b-dropdown-item @click.prevent="logout" href="#">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import user from '../api/user'

export default {
  name: 'NavBar',
  data () {
    return {
      username: localStorage.getItem('username')
    }
  },
  methods: {
    logout () {
      console.log('logout')
      user.logout().then(() => {
        localStorage.removeItem('username')
        localStorage.removeItem('auth')
        localStorage.removeItem('userId')
        this.$router.push({ name: 'Login' })
      })
    }
  }
}
</script>

<style scoped>

</style>
