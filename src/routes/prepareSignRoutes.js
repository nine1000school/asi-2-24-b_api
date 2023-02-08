import jsonwebtoken from "jsonwebtoken"
import config from "../config.js"
import hashPassword from "../utils/hashPassword.js"
import read, { getResourceByField } from "../utils/read.js"
import write from "../utils/write.js"

const getUserByEmail = getResourceByField("users", "email")

const prepareSignRoutes = (app) => {
  // CREATE
  app.post("/sign-up", async (req, res) => {
    const { firstName, lastName, email, password } = req.body
    const [passwordHash, passwordSalt] = hashPassword(password)
    const db = await read()

    console.log(db)
    const user = getUserByEmail(db, email)

    if (user) {
      res.send({ result: true })

      return
    }

    const lastId = db.users.lastId + 1

    await write(db, {
      users: {
        lastId,
        records: {
          [lastId]: {
            id: lastId,
            firstName,
            lastName,
            email,
            passwordHash,
            passwordSalt,
          },
        },
      },
    })

    res.send({ result: true })
  })

  app.post("/sign-in", async (req, res) => {
    const { email, password } = req.body
    const db = await read()
    const user = getUserByEmail(db, email)

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
            id: user.id,
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
