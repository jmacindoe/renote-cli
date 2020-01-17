import { CliComponent } from "../model/CliComponent"
import { testCliInterpreter } from "./testCliInterpreter"
import { print } from "../model/CliPrint"
import { expectPrint } from "./expectPrint"
import { anyFurtherInteraction } from "./anyFurtherInteraction"
import {
  inputPrompt,
  editorPrompt,
  listPrompt,
  listPromptKV,
  autocompletePrompt,
  confirmPrompt,
} from "../model/CliPrompt"
import { expectInput } from "./expectInput"
import { expectEditor } from "./expectEditor"
import { expectList } from "./expectList"
import { expectAutocomplete, expectConfirm } from "../../test/dsl/InputTestDsl"

describe("testCliInterpreter", () => {
  it("returns the sut's return value", async () => {
    const expected = "value"
    const sut: () => CliComponent = async function*() {
      return expected
    }
    const actual = await testCliInterpreter(sut(), [])
    expect(actual).toEqual(expected)
  })

  it("throws if the sut finishes before the expected interaction is done", async () => {
    const sut: () => CliComponent = async function*() {
      return "already done"
    }
    const promise = testCliInterpreter(sut(), [expectPrint("Not gonna happen")])
    await expect(promise).rejects.toMatchInlineSnapshot(
      `[Error: sut is done but expected further interaction: [{"type":"print","text":"Not gonna happen"}]]`,
    )
  })

  it("throws if the sut hasn't finished but no further interaction is expected", async () => {
    const sut: () => CliComponent = async function*() {
      yield* print("First")
    }
    const promise = testCliInterpreter(sut(), [])
    await expect(promise).rejects.toMatchInlineSnapshot(
      `[Error: Expected no further interaction but got: {"type":"print","text":"First"}]`,
    )

    /// TODO: remove this case after refactor
    const sut2: () => CliComponent = async function*() {
      yield* inputPrompt("prompt")
    }
    const promise2 = testCliInterpreter(sut2(), [])
    await expect(promise2).rejects.toMatchInlineSnapshot(
      `[Error: Expected no further interaction but got: {"type":"prompt","question":{"type":"input","name":"result","message":"prompt"}}]`,
    )
  })

  it("doesn't complete the interaction after anyFurtherInteraction()", async () => {
    const sut: () => CliComponent = async function*() {
      yield* print("First")
      yield* print("Second")
      throw new Error("We never get here")
    }
    const promise = testCliInterpreter(sut(), [
      expectPrint("First"),
      anyFurtherInteraction(),
    ])
    await expect(promise).resolves.toBeUndefined()
  })

  // TODO: should also test the failure case, but can't because we use jest's expect so it will fail this test
  // For now, can manually test by modifying these tests and checking they fail :(
  it("passes if print strings match", async () => {
    const sut: () => CliComponent = async function*() {
      yield* print("foo")
    }
    await testCliInterpreter(sut(), [expectPrint("foo")])
  })

  it("fails if print strings don't match", async () => {
    const sut: () => CliComponent = async function*() {
      yield* print("foo")
    }
    const promise = testCliInterpreter(sut(), [expectPrint("bar")])
    await expect(promise).rejects.toMatchInlineSnapshot(`
            [Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoEqual[2m([22m[32mexpected[39m[2m) // deep equality[22m

            [32m- Expected[39m
            [31m+ Received[39m

            [2m  Object {[22m
            [32m-   "text": "bar",[39m
            [31m+   "text": "foo",[39m
            [2m    "type": "print",[22m
            [2m  }[22m]
          `)
  })

  it("passes if input prompt matches and uses the provided value", async () => {
    const sut: () => CliComponent = async function*() {
      const answer = yield* inputPrompt("Q:")
      yield* print(answer)
    }
    await testCliInterpreter(sut(), [
      expectInput("Q:", "ans"),
      expectPrint("ans"),
    ])
  })

  it("fails if input prompt doesn't match", async () => {
    const sut: () => CliComponent = async function*() {
      yield* inputPrompt("Q:")
    }
    const promise = testCliInterpreter(sut(), [expectInput("Q", "ans")])
    await expect(promise).rejects.toMatchInlineSnapshot(`
            [Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoEqual[2m([22m[32mexpected[39m[2m) // deep equality[22m

            [32m- Expected[39m
            [31m+ Received[39m

            [2m  Array [[22m
            [2m    "input",[22m
            [32m-   "Q",[39m
            [31m+   "Q:",[39m
            [2m  ][22m]
          `)
  })

  it("passes if editor prompt matches and uses the provided value", async () => {
    const sut: () => CliComponent = async function*() {
      const answer = yield* editorPrompt("Q:")
      yield* print(answer)
    }
    await testCliInterpreter(sut(), [
      expectEditor("Q:", "ans"),
      expectPrint("ans"),
    ])
  })

  it("fails if editor prompt doesn't match", async () => {
    const sut: () => CliComponent = async function*() {
      yield* editorPrompt("Q:")
    }
    const promise = testCliInterpreter(sut(), [expectEditor("Q", "ans")])
    await expect(promise).rejects.toMatchInlineSnapshot(`
            [Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoEqual[2m([22m[32mexpected[39m[2m) // deep equality[22m

            [32m- Expected[39m
            [31m+ Received[39m

            [2m  Array [[22m
            [2m    "editor",[22m
            [32m-   "Q",[39m
            [31m+   "Q:",[39m
            [2m  ][22m]
          `)
  })

  it("passes if list prompt has provided value and then uses that value", async () => {
    const sut: () => CliComponent = async function*() {
      const answer = yield* listPrompt(["A", "B"])
      yield* print(answer)
    }
    await testCliInterpreter(sut(), [expectList(null, "A"), expectPrint("A")])
  })

  it("returns the value for a list prompt with different values to names", async () => {
    const sut: () => CliComponent = async function*() {
      const answer = yield* listPromptKV([
        {
          name: "A",
          value: 1,
        },
        {
          name: "B",
          value: 2,
        },
      ])
      yield* print(JSON.stringify(answer))
    }
    await testCliInterpreter(sut(), [expectList(null, "A"), expectPrint("1")])
  })

  it("fails if list prompt doesn't contain value", async () => {
    const sut: () => CliComponent = async function*() {
      yield* listPrompt(["A", "B"])
    }
    const promise = testCliInterpreter(sut(), [expectList(null, "C")])
    await expect(promise).rejects.toMatchInlineSnapshot(
      `[Error: Expected choice (C) not in list: ["A","B"]]`,
    )
  })

  it("fails if list prompt doesn't contain value in pairs", async () => {
    const sut: () => CliComponent = async function*() {
      yield* listPromptKV([
        {
          name: "A",
          value: "val",
        },
      ])
    }
    const promise = testCliInterpreter(sut(), [expectList(null, "val")])
    await expect(promise).rejects.toMatchInlineSnapshot(
      `[Error: Expected choice (val) not in list: [{"name":"A","value":"val"}]]`,
    )
  })

  it("fails if list prompt doesn't have all the expected options", async () => {
    const sut: () => CliComponent = async function*() {
      yield* listPrompt(["A", "B"])
    }
    const promise = testCliInterpreter(sut(), [
      expectList(["A", "B", "C"], "A"),
    ])
    await expect(promise).rejects.toMatchInlineSnapshot(`
            [Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoEqual[2m([22m[32mexpected[39m[2m) // deep equality[22m

            [32m- Expected[39m
            [31m+ Received[39m

            [2m  Array [[22m
            [2m    "A",[22m
            [2m    "B",[22m
            [32m-   "C",[39m
            [2m  ][22m]
          `)
  })

  it("passes if list prompt has expected options", async () => {
    const sut: () => CliComponent = async function*() {
      yield* listPrompt(["A", "B"])
    }
    await testCliInterpreter(sut(), [expectList(["A", "B"], "A")])
  })

  it("fails if list prompt has additional options", async () => {
    const sut: () => CliComponent = async function*() {
      yield* listPrompt(["A", "B", "C"])
    }
    const promise = testCliInterpreter(sut(), [expectList(["A", "B"], "A")])
    await expect(promise).rejects.toMatchInlineSnapshot(`
            [Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoEqual[2m([22m[32mexpected[39m[2m) // deep equality[22m

            [32m- Expected[39m
            [31m+ Received[39m

            [2m  Array [[22m
            [2m    "A",[22m
            [2m    "B",[22m
            [31m+   "C",[39m
            [2m  ][22m]
          `)
  })

  it("fails if print was expected but got a prompt", async () => {
    const sut: () => CliComponent = async function*() {
      yield* inputPrompt("Q")
    }
    const promise = testCliInterpreter(sut(), [expectPrint("Q")])
    await expect(promise).rejects.toMatchInlineSnapshot(`
            [Error: Got a prompt but expected print.
            Actual: {"type":"prompt","question":{"type":"input","name":"result","message":"Q"}}
            Expected: {"type":"print","text":"Q"}]
          `)
  })

  it("fails if editor was expected but got input", async () => {
    const sut: () => CliComponent = async function*() {
      yield* editorPrompt("Q")
    }
    const promise = testCliInterpreter(sut(), [expectInput("Q", "ans")])
    await expect(promise).rejects.toMatchInlineSnapshot(`
            [Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoEqual[2m([22m[32mexpected[39m[2m) // deep equality[22m

            [32m- Expected[39m
            [31m+ Received[39m

            [2m  Array [[22m
            [32m-   "input",[39m
            [31m+   "editor",[39m
            [2m    "Q",[22m
            [2m  ][22m]
          `)
  })

  it("fails if a prompt was expected but got print", async () => {
    const sut: () => CliComponent = async function*() {
      yield* print("Hi")
    }
    const promise = testCliInterpreter(sut(), [expectInput("Hi", "ans")])
    await expect(promise).rejects.toMatchInlineSnapshot(`
            [Error: Got a print but expected prompt.
            Actual: {"type":"print","text":"Hi"}
            Expected: {"type":"prompt","kind":"input","question":"Hi","response":"ans"}]
          `)
  })

  describe("autocomplete", () => {
    it("returns the response", async () => {
      const sut: () => CliComponent = async function*() {
        const answer = yield* autocompletePrompt("Q", async () => ["option1"])
        yield* print(answer)
      }
      await testCliInterpreter(sut(), [
        expectAutocomplete("Q", "option1"),
        expectPrint("option1"),
      ])
    })

    it("fails if suggestOnly or message doesn't match", async () => {
      const sut: () => CliComponent = async function*() {
        yield* autocompletePrompt("Q", async () => ["option1"])
      }
      const promise = testCliInterpreter(sut(), [
        expectAutocomplete("message", "ans", { suggestOnly: true }),
      ])
      await expect(promise).rejects.toMatchInlineSnapshot(`
              [Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoEqual[2m([22m[32mexpected[39m[2m) // deep equality[22m

              [32m- Expected[39m
              [31m+ Received[39m

              [2m  Array [[22m
              [2m    "autocomplete",[22m
              [32m-   "message",[39m
              [32m-   true,[39m
              [31m+   "Q",[39m
              [31m+   false,[39m
              [2m    "ans",[22m
              [2m  ][22m]
            `)
    })

    it("fails if responseMustAlreadyExist but response not in options", async () => {
      const sut: () => CliComponent = async function*() {
        yield* autocompletePrompt("Q", async () => ["option1"])
      }
      const promise = testCliInterpreter(sut(), [
        expectAutocomplete("Q", "ans", {
          responseMustAlreadyExist: true,
        }),
      ])
      await expect(promise).rejects.toMatchInlineSnapshot(`
              [Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoContain[2m([22m[32mexpected[39m[2m) // indexOf[22m

              Expected value: [32m"ans"[39m
              Received array: [31m["option1"][39m]
            `)
    })

    it("fails if expectedAutocompletions don't match", async () => {
      const sut: () => CliComponent = async function*() {
        yield* autocompletePrompt("Q", async () => ["option1"])
      }
      const promise = testCliInterpreter(sut(), [
        expectAutocomplete("Q", "option1", {
          expectedAutocompletions: { foo: ["not there"] },
        }),
      ])
      await expect(promise).rejects.toMatchInlineSnapshot(`
              [Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoEqual[2m([22m[32mexpected[39m[2m) // deep equality[22m

              [32m- Expected[39m
              [31m+ Received[39m

              [2m  Array [[22m
              [32m-   "not there",[39m
              [31m+   "option1",[39m
              [2m  ][22m]
            `)
    })
  })

  describe("confirm", () => {
    it("returns the response", async () => {
      const sut: () => CliComponent = async function*() {
        const answer = yield* confirmPrompt("Q")
        yield* print(JSON.stringify(answer))
      }
      await testCliInterpreter(sut(), [
        expectConfirm("Q", true),
        expectPrint("true"),
      ])
    })

    it("fails if the message doesn't match", async () => {
      const sut: () => CliComponent = async function*() {
        yield* confirmPrompt("Q")
      }
      const promise = testCliInterpreter(sut(), [
        expectConfirm("message", true),
      ])
      await expect(promise).rejects.toMatchInlineSnapshot(`
              [Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoEqual[2m([22m[32mexpected[39m[2m) // deep equality[22m

              [32m- Expected[39m
              [31m+ Received[39m

              [2m  Array [[22m
              [2m    "confirm",[22m
              [32m-   "message",[39m
              [31m+   "Q",[39m
              [2m  ][22m]
            `)
    })

    it("fails if the prefill default doesn't match", async () => {
      const sut: () => CliComponent = async function*() {
        yield* confirmPrompt("Q")
      }
      const promise = testCliInterpreter(sut(), [
        expectConfirm("Q", true, { default: false }),
      ])
      await expect(promise).rejects.toMatchInlineSnapshot(`
              [Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoEqual[2m([22m[32mexpected[39m[2m) // deep equality[22m

              Expected: [32mfalse[39m
              Received: [31mundefined[39m]
            `)
    })
  })
})
