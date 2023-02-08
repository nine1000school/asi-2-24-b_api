import express from "express"
import morgan from "morgan"
import preparePostsRoutes from "./src/routes/preparePostsRoutes.js"
import prepareSignRoutes from "./src/routes/prepareSignRoutes.js"

const app = express()
const log = morgan("dev")

app.use(log)
app.use(express.json())

preparePostsRoutes(app)
prepareSignRoutes(app)

// Error 404 Not found
app.use((req, res) => {
  res.status(404).send({ error: "Not found" })
})

app.listen(3001, () => console.log("Listening on :3001"))
