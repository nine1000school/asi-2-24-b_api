import express from "express"
import morgan from "morgan"
import prepareSignRoutes from "./src/routes/prepareSignRoutes.js"
import prepareUsersRoutes from "./src/routes/prepareUsersRoutes.js"

const app = express()
const log = morgan("dev")

app.use(log)
app.use(express.json())

prepareUsersRoutes(app)
prepareSignRoutes(app)

// Error 404 Not found
app.use((req, res) => {
  res.status(404).send({ error: "Not found" })
})

app.listen(3001, () => console.log("Listening on :3001"))
