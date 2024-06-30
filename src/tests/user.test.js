const request = require('supertest')
const app = require('../app')

const BASE_URL = '/api/v1/users'
let TOKEN
let userId


// Actions before init tests
beforeAll(async () => {
  const body = {
    email: "zarquiz@email.com",
    password: "zarquiz1234",
  }

  const res = await request(app)
    .post(`${BASE_URL}/login`)
    .send(body)

  // console.log(res.body.token);S

  TOKEN = res.body.token

})

//Test #1 Create a new user
test("POST -> 'BASE_URL', should return statusCode 201, and res.body.firstName === user.firstName", async () => {

  const user = {
    firstName: "Camila",
    lastName: "Ramos",
    email: "camila@gmail.com",
    password: "camila123",
    phone: "123456789"
  }

  const res = await request(app)
    .post(BASE_URL)
    .send(user)

  userId = res.body.id

  expect(res.statusCode).toBe(201)
  expect(res.body).toBeDefined()
  expect(res.body.firstName).toBe(user.firstName)
})


//Test #2 Get all users
test("GET -> 'BASE_URL', should return statusCode 200, and res.body.length === 2", async () => {
  const res = await request(app)
    .get(BASE_URL)
    .set('Authorization', `Bearer ${TOKEN}`)
  // console.log(res.body);s
  expect(res.status).toBe(200)

})


//Test #3 Get user by id requires authorization token
test("PUT -> 'URL_BASE/:id', should return status code 200 and res.body.firstName === user.firstName", async () => {
  const user = {
    firstName: "Angel",
  }

  const res = await request(app)
    .put(`${BASE_URL}/${userId}`)
    .send(user)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(res.status).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body.firstName).toBe(user.firstName)

})


//Test #4 Login whit invalid credentials
test("POST -> 'BASE_URL/login', should return statusCode 401", async () => {

  const body = {
    email: "jesus@gmail.com",
    password: "invalid password"
  }

  const res = await request(app)
    .post(`${BASE_URL}/login`)
    .send(body)

  expect(res.statusCode).toBe(401)
})


//Test #5 Login with correct credentials
test("POST -> 'BASE_URL/login', should return statusCode 200, res.body.user and res.body.token to be defined, and res.body.user.email === body.email", async () => {
  const body = {
    email: "jesus@gmail.com",
    password: "jesus1234"
  }

  const res = await request(app)
    .post(`${BASE_URL}/login`)
    .send(body)

  expect(res.status).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body.user).toBeDefined()
  expect(res.body.token).toBeDefined()
  expect(res.body.user.email).toBe(body.email)
})


//Test #6 Delete User require authentication token
test("DELETE -> 'URL_BASE/:id', should return status code 204", async () => {
  const res = await request(app)
    .delete(`${BASE_URL}/${userId}`)
    .set("Authorization", `Bearer ${TOKEN}`)

  expect(res.status).toBe(204)
})