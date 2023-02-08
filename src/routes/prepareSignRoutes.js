import jsonwebtoken from "jsonwebtoken"
import config from "../config.js"
import filterDBResult from "../utils/filterDBResult.js"
import hashPassword from "../utils/hashPassword.js"
import read from "../utils/read.js"
import write from "../utils/write.js"

const prepareSignRoutes = (app) => {
  // CREATE
  app.post("/sign-up", async (req, res) => {
    const { firstName, lastName, email, password } = req.body
    const [passwordHash, passwordSalt] = hashPassword(password)
    const { lastId, users } = await read()
    const newId = lastId + 1
    const user = {
      id: newId,
      firstName,
      lastName,
      email,
      passwordHash,
      passwordSalt,
    }

    await write({
      lastId: newId,
      users: [...users, user],
    })

    res.send(filterDBResult(user))
  })

  app.post("/sign-in", async (req, res) => {
    const { email, password } = req.body
    const { users } = await read()
    const user = users.find((user) => user.email === email)

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
