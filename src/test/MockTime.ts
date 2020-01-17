import MockDate from "mockdate"
import moment from "moment"
import { LocalDate } from "../features/notes/base/model/LocalDate"

const initialMockedLocalDate = 3000

const MockTimeConstructor = () => {
  // tslint:disable-next-line: no-var-keyword
  var installed = false
  // tslint:disable-next-line: no-var-keyword
  var today = initialMockedLocalDate

  return {
    set: MockDate.set,
    install() {
      if (installed) {
        throw new Error("MockTime already installed!")
      }
      MockDate.set("2008-03-19T00:00:00.000Z", -120)
      installed = true
      today = initialMockedLocalDate
    },
    reset() {
      if (!installed) {
        throw new Error("MockTime not installed!")
      }

      MockDate.reset()
      installed = false
    },
    initialMockedLocalDate,
    today(): LocalDate {
      return new LocalDate(today)
    },
    tickDays(n: number) {
      today += n
      MockDate.set(
        moment()
          .add(n, "days")
          .toDate(),
      )
    },
  }
}

export const MockTime = MockTimeConstructor()
