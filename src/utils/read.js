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
        users: {
          lastId: 0,
          records: {},
        },
        posts: {
          lastId: 0,
          records: {},
        },
      }
}

export const getResources = (resourceName) => (db) => db[resourceName].records

export const getResourceByField =
  (resourceName, fieldName) => (db, fieldValue) =>
    Object.values(db[resourceName].records).find(
      (resource) => resource[fieldName] === fieldValue
    )

export default read
