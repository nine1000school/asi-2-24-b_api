import "dotenv/config"

const config = {
  port: process.env.PORT,
  db: {
    uri: process.env.DB_URI,
  },
  security: {
    jwt: {
      secret: process.env.SECURITY_JWT_SECRET,
      expiresIn: "2 days",
    },
    password: {
      saltLen: 128,
      iterations: 10000,
      keylen: 128,
      digest: "sha512",
    },
  },
}

export default config
