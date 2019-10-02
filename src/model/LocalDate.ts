import moment, { Moment } from "moment"

export class LocalDate {
  private daysSince2000: number

  /// from as a number is the number of days since Jan 1 2000. Given a Moment,
  /// it will be converted to a LocalDate.
  constructor(from?: number | Moment) {
    if (typeof from === "number") {
      this.daysSince2000 = from
    } else {
      const now = from || moment()
      this.daysSince2000 = now.diff(moment("20000101", "YYYYMMDD"), "days")
    }
  }

  public daysSince1Jan2000(): number {
    return this.daysSince2000
  }

  public addDays(ndays: number) {
    return new LocalDate(this.daysSince2000 + ndays)
  }
}
