import { differenceInCalendarDays, differenceInDays } from "date-fns"

export class LocalDate {
  private daysSince2000: number

  /// from as a number is the number of days since Jan 1 2000. As a Date, it will
  /// be converted to a LocalDate.
  constructor(from?: number | Date) {
    if (typeof from === "number") {
      this.daysSince2000 = from
    } else {
      this.daysSince2000 = differenceInDays(
        from || new Date(),
        new Date(2000, 1, 1),
      )
    }
  }

  public daysSince1Jan2000(): number {
    return this.daysSince2000
  }

  public addDays(ndays: number) {
    return new LocalDate(this.daysSince2000 + ndays)
  }
}
