import { writeFile } from "node:fs/promises"
import config from "../config.js"

const write = async (data) => {
  await writeFile(config.db.path, JSON.stringify(data), { encoding: "utf-8" })
}

export default write
