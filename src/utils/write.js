import deepmerge from "deepmerge"
import { writeFile } from "node:fs/promises"
import config from "../config.js"

const write = async (db, update) => {
  const updatedDB = deepmerge(db, update)

  await writeFile(config.db.path, JSON.stringify(updatedDB), {
    encoding: "utf-8",
  })
}

export default write
