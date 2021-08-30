<template>
  <b-container class="register-template">
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
            <h3>Please regiter on the system to post and comment</h3>
            <hr>
          </b-card-title>
          <b-card-body>
            <b-form @submit="onSubmit" @reset="onReset" v-if="show">
              <b-form-group
                id="input-group-name"
                label="*name:"
                label-for="name"
              >
                <b-form-input
                  id="name"
                  name="name"
                  v-model="form.name"
                  type="text"
                  placeholder="Enter name"
                  required
                ></b-form-input>
                <span class="text-danger" v-if="errors.name">{{ errors.name[0] }}</span>
              </b-form-group>
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
              <b-form-group
                id="input-group-password"
                label="*Confirm password:"
                label-for="password_confirmation">
                <b-form-input
                  id="password_confirmation"
                  type="password"
                  name="password_confirmation"
                  v-model="form.password_confirmation"
                  placeholder="Confirm password"
                  required
                ></b-form-input>
                <span class="text-danger" v-if="errors.password_confirmation">{{
                    errors.password_confirmation[0]
                  }}</span>
              </b-form-group>
              <router-link to="/login"> Already have a account? Login here</router-link>
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
import csrf from '../api/csrf'
import user from '../api/user'

export default {
  name: 'Login',
  data () {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      },
      variant: 'success',
      dismissSecs: 5,
      dismissCountDown: 0,
      dismissMessage: '',
      show: true,
      errors: []
    }
  },
  computed: {
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
      csrf.getCookie()
        .then(() => {
          user.register(this.form)
            .then(() => {
              this.variant = 'success'
              this.dismissCountDown = 5
              this.dismissMessage = `Registration successfull. We will redirect you in ${this.dismissCountDown} seconds...`
              setTimeout(function () {
                this.$router.push('/')
              }.bind(this), 6000)
            })
            .catch((error) => {
              if (error.response.status === 422) {
                this.errors = error.response.data.validation_errors
              } else if (error.response.status === 500) {
                this.variant = 'danger'
                this.dismissCountDown = 5
                this.dismissMessage = `${error.response.data.message}`
              }
            })
        })
    },
    onReset (event) {
      event.preventDefault()
      // Reset our form values
      this.form.name = ''
      this.form.email = ''
      this.form.password = ''
      this.form.password_confirmation = ''
    }
  }
}
</script>

<style scoped>
.register-template {
  padding: 50px;
}
</style>
