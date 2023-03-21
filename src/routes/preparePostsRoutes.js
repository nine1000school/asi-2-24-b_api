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
  app.get("/posts", auth, async (req, res) => {
    const db = await read()
    const posts = getPosts(db)

    res.send({ result: filterDBResult(posts) })
  })

  // READ single
  app.get("/posts/:postId", async (req, res) => {
    const db = await read()
    const postId = Number.parseInt(req.params.postId, 10)
    const post = getPostById(db, postId)

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
    const db = await read()
    const postId = Number.parseInt(req.params.postId, 10)
    const post = getPostById(db, postId)

    if (!post) {
      res.status(404).send({ error: "Not found" })

      return
    }

    if (post.userId !== sessionUserId) {
      res.status(403).send({ error: "Forbidden" })

      return
    }

    const updatedPost = {
      ...post,
      title: title ?? post.title,
      content: content ?? post.content,
      publishedAt:
        typeof publishedAt === "undefined" ? post.publishedAt : publishedAt,
    }

    await write(db, {
      posts: {
        records: {
          [post.id]: updatedPost,
        },
      },
    })

    res.send(updatedPost)
  })

  // DELETE
  app.delete("/posts/:postId", auth, async (req, res) => {
    const db = await read()
    const sessionUserId = req.session.user.id
    const postId = Number.parseInt(req.params.postId, 10)
    const post = getPostById(db, postId)

    if (!post) {
      res.status(404).send({ error: "Not found" })

      return
    }

    if (post.userId !== sessionUserId) {
      res.status(403).send({ error: "Forbidden" })

      return
    }

    await write(db, {
      posts: {
        records: {
          [postId]: undefined,
        },
      },
    })

    res.send(post)
  })
}

export default preparePostsRoutes
