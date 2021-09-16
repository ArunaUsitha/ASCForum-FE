import axios from 'axios'

const Api = axios.create({
  baseURL: 'http://localhost:8000/api/v1'
})

const requestHandler = request => {
  // request.headers.Authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTIzNDU2Nzg5IiwibmFtZSI6IlNhbXBsZSIsImlhdCI6MTUxNjIzODIzfQ.ZEBwz4pWYGqgFJc6DIi7HdTN0z5Pfs4Lcv4ZNwMr1rs';
  return request
}

const responseHandler = response => {
  if (response.status === 401) {
    window.location = '/login'
  }

  return response
}

const errorHandler = error => {
  console.log(error.response)
  if (error.response === undefined || error.response.status === 401) {
    window.location = '/login'
    localStorage.removeItem('auth')
  } else if (error.response.status === 500) {
    this.variant = 'danger'
    this.dismissCountDown = 5
    this.dismissMessage = error.response.data.message
  }

  return Promise.reject(error)
}

Api.interceptors.request.use(
  (request) => requestHandler(request),
  (error) => errorHandler(error)
)

Api.interceptors.response.use(
  (response) => responseHandler(response),
  (error) => errorHandler(error)
)

Api.defaults.withCredentials = true

export default Api
