import { CliComponent } from "../../../../../cli/model/CliComponent"
import {
  autocompletePrompt,
  confirmPrompt,
  listPrompt,
  inputPrompt,
} from "../../../../../cli/model/CliPrompt"
import { getDecksUseCase } from "../../../../decks/usecase/getDecksUseCase"
import { print } from "../../../../../cli/model/CliPrint"
import { Deck } from "../../../../decks/model/Deck"
import { createDeckUseCase } from "../../../../decks/usecase/createDeckUseCase"
import { assertDefined } from "../../../../../error/assert"

const createNewDeckOption = "[Create New Deck]"

export async function* promptForDeck(): CliComponent<Deck> {
  return yield* prompt(true)
}

export async function* promptForExistingDeck(): CliComponent<Deck> {
  return yield* prompt(false)
}

async function* prompt(canCreateDeck: boolean): CliComponent<Deck> {
  const allDecks = await getDecksUseCase("")

  const options = [
    ...allDecks.map(deck => deck.name),
    ...(canCreateDeck ? [createNewDeckOption] : []),
  ]
  const choice = yield* listPrompt(options, { message: "Deck" })

  if (canCreateDeck && choice === createNewDeckOption) {
    return yield* createNewDeck()
  } else {
    return assertDefined(allDecks.find(deck => deck.name === choice))
  }
}

async function* createNewDeck(): CliComponent<Deck> {
  const name = yield* inputPrompt("Deck name")
  const confirmation = yield* confirmPrompt(`Create new deck "${name}"`, false)

  if (confirmation) {
    const deck = await createDeckUseCase(name)
    yield* print(`Created deck "${name}"`)
    return deck
  } else {
    yield* print(`Did not create deck`)
    return yield* promptForDeck()
  }
}
