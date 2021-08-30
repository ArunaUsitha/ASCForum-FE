<template>
  <div>
    <NavBar/>
    <b-container class="post-create-template">
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
              <h3>Create a post</h3>
              <hr>
            </b-card-title>
            <b-card-body>
              <b-form @submit="onSubmit" @reset="onReset" v-if="show">
                <b-form-group
                  id="input-group-email"
                  label="*Title"
                  label-for="title"
                >
                  <b-form-input
                    id="title"
                    name="title"
                    v-model="form.title"
                    type="text"
                    placeholder="Enter title"
                    required
                  ></b-form-input>
                  <span class="text-danger" v-if="errors.title">{{ errors.title[0] }}</span>
                </b-form-group>

                <b-form-group
                  id="input-group-password"
                  label="*text:"
                  label-for="text">
                  <b-form-textarea
                    id="text"
                    name="text"
                    v-model="form.text"
                    placeholder="Enter post content"
                    required
                  ></b-form-textarea>
                  <span class="text-danger" v-if="errors.text">{{ errors.text[0] }}</span>
                </b-form-group>
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
  </div>

</template>

<script>
import Api from '../api/api'
import NavBar from '../components/NavBar'

export default {
  name: 'PostCreate',
  components: {
    NavBar
  },
  data () {
    return {
      form: {
        title: '',
        text: ''
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
      Api.post(
        '/post-create',
        this.form
      ).then(response => {
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
      this.form.title = ''
      this.form.text = ''
    },
    onReset (event) {
      this.resetForm(event)
    }
  }
}
</script>

<style scoped>
.post-create-template {
  padding: 50px;
}
</style>
