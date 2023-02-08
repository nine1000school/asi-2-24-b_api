import auth from "../middlewares/auth.js"
import filterDBResult from "../utils/filterDBResult.js"
import read, { getResourceByField, getResources } from "../utils/read.js"
import write from "../utils/write.js"

const getPostById = getResourceByField("posts", "id")
const getPosts = getResources("posts")

const preparePostsRoutes = (app) => {
  // CREATE
  app.post("/posts", auth, async (req, res) => {
    const { title, content } = req.body
    const sessionUserId = req.session.user.id
    const db = await read()
    const lastId = db.posts.lastId + 1
    const post = {
      id: lastId,
      title,
      content,
      userId: sessionUserId,
      publishedAt: null,
    }

    await write(db, {
      posts: {
        lastId,
        records: {
          [lastId]: post,
        },
      },
    })

    res.send({ result: filterDBResult(post) })
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
