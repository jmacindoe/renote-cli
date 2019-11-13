import { assertDefined } from "../../error/assert"
import { NoteTypePlugin } from "./base/NoteTypePlugin"
import { diaryNotePlugin } from "./diary/diaryNotePlugin"
import { textNotePlugin } from "./text/textNotePlugin"
import { Note } from "./base/model/Note"
import { DbNote } from "./base/db/NoteDb"

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

  deserialize(doc: DbNote): Note {
    const validationError = doc.validateSync()
    if (validationError) {
      throw validationError
    }

    const plugin = this.getByType(doc.type)
    return plugin.deserialize(doc)
  }

  deserializeAll(docs: DbNote[]): Note[] {
    return docs.map(this.deserialize.bind(this))
  }

  debugDescription(note: Note): string {
    const plugin = this.getByType(note.type)
    return plugin.debugDescription(note)
  }
}

export const noteTypePlugins = new NotePlugins()
