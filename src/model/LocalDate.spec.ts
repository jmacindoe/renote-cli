import { LocalDate } from "./LocalDate"

describe("LocalDate", () => {
  describe("daysSince1Jan2000", () => {
    it("gives 1 for 2 Jan 2000", () => {
      expect(new LocalDate(new Date(2000, 1, 2)).daysSince1Jan2000()).toEqual(1)
    })
  })
})
