import "dotenv/config"

const config = {
  db: {
    path: "./.db.json",
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
