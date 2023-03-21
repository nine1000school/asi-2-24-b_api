import jsonwebtoken from "jsonwebtoken"
import config from "../config.js"
import UserModel from "../db/models/UserModel.js"
import hashPassword from "../utils/hashPassword.js"

const prepareSignRoutes = (app) => {
  // CREATE
  app.post("/sign-up", async (req, res) => {
    const { firstName, lastName, email, password } = req.body
    const [passwordHash, passwordSalt] = hashPassword(password)
    const user = await UserModel.findOne({ email })

    if (user) {
      res.send({ result: true })

      return
    }

    await UserModel.insertMany({
      firstName,
      lastName,
      email,
      passwordHash,
      passwordSalt,
    })

    res.send({ result: true })
  })

  app.post("/sign-in", async (req, res) => {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email })

    if (!user) {
      res.status(401).send({ error: "Invalid credentials" })

      return
    }

    const [passwordHash] = hashPassword(password, user.passwordSalt)

    if (passwordHash !== user.passwordHash) {
      res.status(401).send({ error: "Invalid credentials" })

      return
    }

    const jwt = jsonwebtoken.sign(
      {
        payload: {
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        },
      },
      config.security.jwt.secret,
      { expiresIn: config.security.jwt.expiresIn }
    )

    res.send({ result: jwt })
  })
}

export default prepareSignRoutes
