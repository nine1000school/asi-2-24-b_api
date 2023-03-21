import { model } from "mongoose"
import PostSchema from "../schemas/PostSchema.js"

const PostModel = model("Post", PostSchema)

export default PostModel
