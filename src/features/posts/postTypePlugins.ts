import { Document } from "mongoose"
import { assertDefined } from "../../error/assert"
import { PostTypePlugin } from "./base/PostTypePlugin"
import { diaryPostPlugin } from "./diary/diaryPostPlugin"
import { textPostPlugin } from "./text/textPostPlugin"
import { Post } from "./base/model/Post"
import { DocumentWithDiscriminator } from "../../db/DocumentWithDiscriminator"

class NotePlugins {
  plugins: PostTypePlugin[] = [textPostPlugin, diaryPostPlugin]

  getUiNames(): string[] {
    return this.plugins.map(p => p.uiName)
  }

  getByType(type: string): PostTypePlugin {
    return assertDefined(this.plugins.find(p => p.type === type))
  }

  getByUiName(uiName: string): PostTypePlugin {
    return assertDefined(this.plugins.find(p => p.uiName === uiName))
  }

  deserialize(doc: DocumentWithDiscriminator): Post {
    doc.validateSync()
    const id = doc.__t
    const plugin = this.getByType(id)
    return plugin.deserialize(doc)
  }

  deserializeAll(docs: DocumentWithDiscriminator[]): Post[] {
    return docs.map(this.deserialize.bind(this))
  }
}

export const noteTypePlugins = new NotePlugins()
