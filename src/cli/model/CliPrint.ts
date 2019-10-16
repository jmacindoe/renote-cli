export interface CliPrint {
  type: "print"
  text: string
}

export function* print(text: string): Generator<CliPrint> {
  yield {
    type: "print",
    text,
  }
}
