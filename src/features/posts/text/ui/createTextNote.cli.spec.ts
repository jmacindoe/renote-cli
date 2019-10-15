import { createTextNoteCli } from "./createTextNote.cli"

async function* myGen(): AsyncGenerator<string, string, any> {
  const next = yield "first"
  console.log("next: " + next)
  return next
}
describe("createTextNote.cli", () => {
  it("asks for the title, body and due date", async () => {
    const cli = createTextNoteCli()
    const prompts = await cli.next()
    expect(prompts.done).toEqual(false)
    expect(prompts.value).toMatchInlineSnapshot(`
      Object {
        "questions": Array [
          Object {
            "message": "Title",
            "name": "title",
            "type": "input",
          },
          Object {
            "message": "Body",
            "name": "body",
            "type": "editor",
          },
          Object {
            "message": "Show in how many days from now?",
            "name": "nextDueInNDays",
            "type": "input",
          },
        ],
        "type": "prompt",
      }
    `)
  })
})
