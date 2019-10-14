import { BasePost } from "../../base/model/BasePost"

export interface DiaryPost extends BasePost {
  type: "diary"
  prompt: string
}
