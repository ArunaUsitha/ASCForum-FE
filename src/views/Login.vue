<template>
  <b-container class="login-template">
    <b-row class="justify-content-md-center">
      <b-col lg="6">
        <b-alert
          :show="dismissCountDown"
          dismissible
          :variant="variant"
          @dismissed="dismissCountDown=0"
          @dismiss-count-down="countDownChanged"
        >
          {{ dismissMessage }}
        </b-alert>
        <b-card>
          <b-card-title>
            <h3>Please enter credentials to login</h3>
            <hr>
          </b-card-title>
          <b-card-body>
            <b-form @submit="onSubmit" @reset="onReset" v-if="show">
              <b-form-group
                id="input-group-email"
                label="*Email address:"
                label-for="email"
              >
                <b-form-input
                  id="email"
                  name="email"
                  v-model="form.email"
                  type="email"
                  placeholder="Enter email"
                  required
                ></b-form-input>
                <span class="text-danger" v-if="errors.email">{{ errors.email[0] }}</span>
              </b-form-group>

              <b-form-group
                id="input-group-password"
                label="*Password:"
                label-for="password">
                <b-form-input
                  id="password"
                  type="password"
                  name="password"
                  v-model="form.password"
                  placeholder="Enter password"
                  required
                ></b-form-input>
                <span class="text-danger" v-if="errors.password">{{ errors.password[0] }}</span>
              </b-form-group>
              <router-link to="/register"> Need an account? Register Here</router-link>
              <div>
                <b-button type="submit" variant="primary">Submit</b-button>&nbsp;
                <b-button type="reset" variant="danger">Reset</b-button>
              </div>
            </b-form>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import user from '../api/user'

export default {
  name: 'Login',
  data () {
    return {
      form: {
        email: '',
        password: ''
      },
      variant: 'success',
      dismissSecs: 5,
      dismissCountDown: 0,
      dismissMessage: '',
      show: true,
      errors: []
    }
  },
  methods: {
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert () {
      this.dismissCountDown = this.dismissSecs
    },
    onSubmit (event) {
      event.preventDefault()
      user.login(this.form).then(response => {
        localStorage.setItem('auth', 'true')
        localStorage.setItem('username', response.data.name)
        this.$router.push('/')
      })
        .catch(error => {
          if (error.response.status === 422) {
            this.errors = error.response.data.validation_errors
          }
          if (error.response.status === 401 || error.response.status === 500) {
            this.variant = 'danger'
            this.dismissCountDown = 5
            this.dismissMessage = error.response.data.message
          }
        })
    },
    onReset (event) {
      event.preventDefault()
      // Reset our form values
      this.form.email = ''
      this.form.password = ''
    }
  }
}
</script>

<style scoped>
.login-template {
  padding: 50px;
}
</style>
