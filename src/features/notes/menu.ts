import { CliComponent } from "../../cli/model/CliComponent"
import { listPrompt } from "../../cli/model/CliPrompt"
import { doReview } from "./review"
import { addNote } from "./add"

export async function* mainMenu(): CliComponent {
  const command = yield* listPrompt(["Review", "Add"])
  switch (command) {
    case "Review":
      yield* doReview()
      break
    case "Add":
      yield* addNote()
      break
    default:
      throw new Error("Unknown command: " + command)
  }
}
