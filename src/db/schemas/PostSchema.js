import { Schema, Types } from "mongoose"

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: new Schema(
        {
          id: {
            type: Types.ObjectId,
            required: true,
          },
          firstName: {
            type: String,
            required: true,
          },
          lastName: {
            type: String,
            required: true,
          },
        },
        {
          _id: false,
        }
      ),
      required: true,
    },
    publishedAt: Date,
  },
  { timestamps: true }
)

export default PostSchema
