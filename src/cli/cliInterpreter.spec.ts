import { cliInterpreter } from "./cliInterpreter"
import { CliComponent } from "./model/CliComponent"

describe("cliInterpreter", () => {
  it("stops on done", async () => {
    const cli: () => CliComponent = async function*() {}
    await cliInterpreter(cli)
  })
})
