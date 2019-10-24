import { Document } from "mongoose"
import { assertDefined } from "../../error/assert"
import { PostTypePlugin } from "./base/PostTypePlugin"
import { diaryPostPlugin } from "./diary/diaryPostPlugin"
import { textPostPlugin } from "./text/textPostPlugin"
import { Post } from "./base/model/Post"
import { DocumentWithDiscriminator } from "../../db/DocumentWithDiscriminator"

class NotePlugins {
  plugins: PostTypePlugin[] = [textPostPlugin, diaryPostPlugin]

  getNames(): string[] {
    return this.plugins.map(p => p.name)
  }

  getById(id: string): PostTypePlugin {
    return assertDefined(this.plugins.find(p => p.id === id))
  }

  getByName(name: string): PostTypePlugin {
    return assertDefined(this.plugins.find(p => p.name === name))
  }

  deserialize(doc: DocumentWithDiscriminator): Post {
    doc.validateSync()
    const id = doc.__t
    const plugin = this.getById(id)
    return plugin.deserialize(doc)
  }

  deserializeAll(docs: DocumentWithDiscriminator[]): Post[] {
    return docs.map(this.deserialize.bind(this))
  }
}

export const noteTypePlugins = new NotePlugins()
