import { assertDefined } from "../../error/assert"
import { NoteTypePlugin } from "./base/NoteTypePlugin"
import { diaryNotePlugin } from "./diary/diaryNotePlugin"
import { textNotePlugin } from "./text/textNotePlugin"
import { Note } from "./base/model/Note"
import { DbNote } from "./base/db/NoteDb"

class NotePlugins {
  private plugins: NoteTypePlugin[] = [textNotePlugin, diaryNotePlugin]

  public getUiNames(): string[] {
    return this.plugins.map(p => p.uiName)
  }

  public getByType(type: string): NoteTypePlugin {
    return assertDefined(this.plugins.find(p => p.type === type))
  }

  public getByUiName(uiName: string): NoteTypePlugin {
    return assertDefined(this.plugins.find(p => p.uiName === uiName))
  }

  public deserialize(doc: DbNote): Note {
    const validationError = doc.validateSync()
    if (validationError) {
      throw validationError
    }

    const plugin = this.getByType(doc.type)
    return plugin.deserialize(doc)
  }

  public deserializeAll(docs: DbNote[]): Note[] {
    return docs.map(this.deserialize.bind(this))
  }

  public debugDescription(note: Note): string {
    const plugin = this.getByType(note.type)
    return plugin.debugDescription(note)
  }
}

export const noteTypePlugins = new NotePlugins()
