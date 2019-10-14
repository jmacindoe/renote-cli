import moment from "moment"
import { LocalDate } from "./LocalDate"

describe("LocalDate", () => {
  describe("daysSince1Jan2000", () => {
    it("gives 1 for 2 Jan 2000", () => {
      expect(
        new LocalDate(moment("20000102", "YYYYMMDD")).daysSince1Jan2000(),
      ).toEqual(1)
    })

    it("gives the same value for all points in the same day local time", () => {
      expect(
        new LocalDate(moment("2019-10-02T00:00:00+10:00")).daysSince1Jan2000(),
      ).toEqual(7214)
      expect(
        new LocalDate(moment("2019-10-02T10:21:31+10:00")).daysSince1Jan2000(),
      ).toEqual(7214)
      expect(
        new LocalDate(moment("2019-10-02T23:59:59+10:00")).daysSince1Jan2000(),
      ).toEqual(7214)
    })
  })
})
