import { CliComponent } from "../../cli/model/CliComponent"
import { listPrompt } from "../../cli/model/CliPrompt"
import { doReview } from "./review"
import { addNote } from "./add"

export async function* mainMenu(): CliComponent {
  const command = yield* listPrompt(["Review", "Add"])
  switch (command) {
    case "Review":
      yield* doReview()
    case "Add":
      yield* addNote()
    default:
      throw new Error("Unknown command: " + command)
  }
}
