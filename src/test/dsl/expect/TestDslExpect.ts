export class TestDslExpect {
  private expect: <T>(expected: T) => jest.Matchers<T>

  constructor(not: boolean) {
    this.expect = not ? expected => expect(expected).not : expect
  }

  public async diaryNoteExists(prompt: string) {
    throw Error("To be implemented by subclasses")
  }
}
