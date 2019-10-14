import { BasePost } from "../../base/model/BasePost"

export interface TextPost extends BasePost {
  type: "text"
  title: string
  body: string
}
