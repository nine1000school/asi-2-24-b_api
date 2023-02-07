import express from "express"
import morgan from "morgan"
import read from "./src/utils/read.js"
import write from "./src/utils/write.js"

const app = express()
const log = morgan("dev")

app.use(log)
app.use(express.json())

// CREATE
app.post("/todos", async (req, res) => {
  const { description } = req.body

  const { lastId, todos } = await read()
  const newId = lastId + 1
  const todo = {
    id: newId,
    description,
    done: false,
  }

  await write({
    lastId: newId,
    todos: [...todos, todo],
  })

  res.send(todo)
})

// READ collection
app.get("/todos", async (req, res) => {
  const { todos } = await read()

  res.send(todos)
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

// Error 404 Not found
app.use((req, res) => {
  res.status(404).send({ error: "Not found" })
})

app.listen(3001, () => console.log("Listening on :3001"))
