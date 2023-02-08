import { readFile } from "node:fs/promises"
import config from "../config.js"

const read = async () => {
  const content = await readFile(config.db.path, {
    flag: "a+",
    encoding: "utf-8",
  })

  return content
    ? JSON.parse(content)
    : {
        lastId: 0,
        users: [],
      }
}

export default read
