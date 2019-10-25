import { Document } from "mongoose"
import { assertDefined } from "../../error/assert"
import { NoteTypePlugin } from "./base/NoteTypePlugin"
import { diaryNotePlugin } from "./diary/diaryNotePlugin"
import { textNotePlugin } from "./text/textNotePlugin"
import { Note } from "./base/model/Note"
import { DocumentWithDiscriminator } from "../../db/DocumentWithDiscriminator"

class NotePlugins {
  plugins: NoteTypePlugin[] = [textNotePlugin, diaryNotePlugin]

  getUiNames(): string[] {
    return this.plugins.map(p => p.uiName)
  }

  getByType(type: string): NoteTypePlugin {
    return assertDefined(this.plugins.find(p => p.type === type))
  }

  getByUiName(uiName: string): NoteTypePlugin {
    return assertDefined(this.plugins.find(p => p.uiName === uiName))
  }

  deserialize(doc: DocumentWithDiscriminator): Note {
    // TODO: this isn't working? (date field)
    doc.validateSync()
    const id = doc.__t
    const plugin = this.getByType(id)
    return plugin.deserialize(doc)
  }

  deserializeAll(docs: DocumentWithDiscriminator[]): Note[] {
    return docs.map(this.deserialize.bind(this))
  }
}

export const noteTypePlugins = new NotePlugins()
