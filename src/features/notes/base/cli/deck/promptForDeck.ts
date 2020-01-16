import { CliComponent } from "../../../../../cli/model/CliComponent";
import { autocompletePrompt, confirmPrompt } from "../../../../../cli/model/CliPrompt";
import { getDecksUseCase } from "../../usecase/getDecksUseCase";
import { print } from "../../../../../cli/model/CliPrint";

export async function* promptForDeck(): CliComponent<string> {
  const allDecks = await getDecksUseCase("")

  const deck = yield* autocompletePrompt("Deck", options, {
    suggestOnly: true,
  })

  if (allDecks.indexOf(deck) !== -1) {
    return deck
  }

  const confirmation = yield* confirmPrompt(`Create new deck "${deck}"`, false)

  if (confirmation) {
    yield* print(`Created deck "${deck}"`)
    return deck
  } else {
    yield* print(`Did not create deck`)
    return yield* promptForDeck()
  }
}

export async function* promptForExistingDeck(): CliComponent<string> {
  return yield* autocompletePrompt("Deck", options, {
    suggestOnly: false,
  })
}

async function options(answersSoFar: any, input: string | undefined): Promise<string[]> {
  return await getDecksUseCase(input ?? "")
}