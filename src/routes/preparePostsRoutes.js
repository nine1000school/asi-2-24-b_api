import PostModel from "../db/models/PostModel.js"
import auth from "../middlewares/auth.js"
import filterDBResult from "../utils/filterDBResult.js"

const preparePostsRoutes = (app) => {
  // CREATE
  app.post("/posts", auth, async (req, res) => {
    const { title, content } = req.body
    const sessionUser = req.session.user
    const post = {
      title,
      content,
      author: {
        id: sessionUser.id,
        firstName: sessionUser.firstName,
        lastName: sessionUser.lastName,
      },
    }

    const [newPost] = await PostModel.insertMany(post)

    res.send({ result: filterDBResult(newPost) })
  })

  // READ collection
  app.get("/posts", async (req, res) => {
    const { publishedOnly, authorId } = req.query
    const query = {}

    if (publishedOnly) {
      query.publishedAt = { $exists: true }
    }

    if (authorId) {
      query["author.id"] = authorId
    }

    const posts = await PostModel.find(query, {}, { lean: true })

    res.send({ result: filterDBResult(posts) })
  })

  // READ single
  app.get("/posts/:postId", async (req, res) => {
    const { postId } = req.params
    const post = await PostModel.findById(postId, {}, { lean: true })

    if (!post) {
      res.status(404).send({ error: "Not found" })

      return
    }

    res.send({ result: filterDBResult(post) })
  })

  // UPDATE
  app.patch("/posts/:postId", auth, async (req, res) => {
    const { title, content, publishedAt } = req.body
    const sessionUserId = req.session.user.id
    const { postId } = req.params
    const post = await PostModel.findById(postId, {}, { lean: true })

    if (!post) {
      res.status(404).send({ error: "Not found" })

      return
    }

    if (String(post.author.id) !== String(sessionUserId)) {
      res.status(403).send({ error: "Forbidden" })

      return
    }

    const updatedPost = await PostModel.findByIdAndUpdate(postId, {
      title,
      content,
      publishedAt,
    })

    res.send({ result: filterDBResult(updatedPost) })
  })

  // DELETE
  app.delete("/posts/:postId", auth, async (req, res) => {
    const sessionUserId = req.session.user.id
    const { postId } = req.params
    const post = await PostModel.findById(postId, {}, { lean: true })

    if (!post) {
      res.status(404).send({ error: "Not found" })

      return
    }

    if (String(post.author.id) !== String(sessionUserId)) {
      res.status(403).send({ error: "Forbidden" })

      return
    }

    await PostModel.deleteOne({ _id: post._id })

    res.send({ result: filterDBResult(post) })
  })
}

export default preparePostsRoutes
