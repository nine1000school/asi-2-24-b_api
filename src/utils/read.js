import { readFile } from "node:fs/promises"
import { TODOS_PATH } from "../config.js"

const read = async () => {
  const content = await readFile(TODOS_PATH, { flag: "a+", encoding: "utf-8" })

  return content
    ? JSON.parse(content)
    : {
        lastId: 0,
        todos: [],
      }
}

export default read
