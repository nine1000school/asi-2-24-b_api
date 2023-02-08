import auth from "../middlewares/auth.js"
import filterDBResult from "../utils/filterDBResult.js"
import read from "../utils/read.js"
import write from "../utils/write.js"

const prepareUsersRoutes = (app) => {
  // READ collection
  app.get("/users", auth, async (req, res) => {
    const { users } = await read()

    res.send(filterDBResult(users))
  })

  // READ single
  app.get("/todos/:todoId", async (req, res) => {
    const { todos } = await read()
    const todoId = Number.parseInt(req.params.todoId, 10)
    const todo = todos.find(({ id }) => id === todoId)

    if (!todo) {
      res.status(404).send({ error: "Not found" })

      return
    }

    res.send(todo)
  })

  // UPDATE
  app.patch("/todos/:todoId", async (req, res) => {
    const { description, done } = req.body
    const { lastId, todos } = await read()
    const todoId = Number.parseInt(req.params.todoId, 10)
    const todo = todos.find(({ id }) => id === todoId)

    if (!todo) {
      res.status(404).send({ error: "Not found" })

      return
    }

    const updatedTodo = {
      ...todo,
      done: done ?? todo.done,
      description: description ?? todo.description,
    }

    await write({
      lastId,
      todos: todos.map((todo) => (todo.id === todoId ? updatedTodo : todo)),
    })

    res.send(updatedTodo)
  })

  // DELETE
  app.delete("/todos/:todoId", async (req, res) => {
    const { lastId, todos } = await read()
    const todoId = Number.parseInt(req.params.todoId, 10)
    const todo = todos.find(({ id }) => id === todoId)

    if (!todo) {
      res.status(404).send({ error: "Not found" })

      return
    }

    await write({
      lastId,
      todos: todos.filter((todo) => todo.id !== todoId),
    })

    res.send(todo)
  })
}

export default prepareUsersRoutes
