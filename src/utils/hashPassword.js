import { pbkdf2Sync, randomBytes } from "crypto"
import config from "../config.js"

const hashPassword = (
  password,
  salt = randomBytes(config.security.password.saltLen).toString("hex")
) => [
  pbkdf2Sync(
    password,
    salt,
    config.security.password.iterations,
    config.security.password.keylen,
    config.security.password.digest
  ).toString("hex"),
  salt,
]

export default hashPassword
