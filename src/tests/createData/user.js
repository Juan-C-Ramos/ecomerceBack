const User = require("../../models/User")

const user = async () => {
  const body = {
    firstName: "Camila",
    lastName: "Ramos",
    email: "camila@email.com",
    password: "camila123",
    phone: "12345678"
  }

  await User.create(body)
}

module.exports = user