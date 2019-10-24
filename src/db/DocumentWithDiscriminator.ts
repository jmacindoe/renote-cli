import { Document } from "mongoose"

export type DocumentWithDiscriminator = Document & {
  __t: string
}
