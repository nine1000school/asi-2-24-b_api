import express from "express"
import mongoose from "mongoose"
import morgan from "morgan"
import config from "./src/config.js"
import prepareCommentsRoutes from "./src/routes/prepareCommentsRoutes.js"
import preparePostsRoutes from "./src/routes/preparePostsRoutes.js"
import prepareSignRoutes from "./src/routes/prepareSignRoutes.js"

const app = express()
const log = morgan("dev")

await mongoose.connect(config.db.uri)

app.use(log)
app.use(express.json())

prepareSignRoutes(app)
preparePostsRoutes(app)
prepareCommentsRoutes(app)

// Error 404 Not found
app.use((req, res) => {
  res.status(404).send({ error: "Not found" })
})

app.listen(config.port, () => console.log(`Listening on :${config.port}`))
