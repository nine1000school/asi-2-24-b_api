import auth from "../middlewares/auth.js"
import filterDBResult from "../utils/filterDBResult.js"

const read = () => {}
const write = () => {}

const prepareCommentsRoutes = (app) => {
  // CREATE
  app.post("/comments", auth, async (req, res) => {
    const { content } = req.body
    const postId = Number.parseInt(req.body.postId, 10)
    const db = await read()
    const userId = req.session.user.id
    const lastId = db.comments.lastId + 1
    const comment = {
      id: lastId,
      content,
      postId,
      userId,
      createdAt: new Date().toISOString(),
    }

    await write(db, {
      comments: {
        lastId,
        records: {
          [lastId]: comment,
        },
      },
    })

    res.send({ result: filterDBResult(comment) })
  })

  // READ collection
  app.get("/comments", async (req, res) => {
    const {
      comments: { records },
    } = await read()
    const comments = Object.values(records)
    const postId = Number.parseInt(req.query.postId, 10)
    const limit = Number.parseInt(req.query.limit, 10) || 10
    const page = Number.parseInt(req.query.page, 10) || 1
    const result = (
      postId
        ? comments.filter((comment) => comment.postId === postId)
        : comments
    ).slice((page - 1) * limit, page * limit)

    res.send({ result })
  })

  // READ single
  app.get("/comments/:commentId", async (req, res) => {
    const commentId = Number.parseInt(req.params.commentId, 10)
    const {
      comments: {
        records: { [commentId]: comment },
      },
    } = await read()

    if (!comment) {
      res.status(404).send({ error: "Not found" })

      return
    }

    res.send({ result: filterDBResult(comment) })
  })
}

export default prepareCommentsRoutes
