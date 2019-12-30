import MockDate from "mockdate"
import moment from "moment"

const MockTimeConstructor = () => {
  // tslint:disable-next-line: no-var-keyword
  var installed = false

  return {
    set: MockDate.set,
    install() {
      if (installed) {
        throw new Error("MockTime already installed!")
      }
      MockDate.set("2008-03-19T00:00:00.000Z", -120)
      installed = true
    },
    reset() {
      if (!installed) {
        throw new Error("MockTime not installed!")
      }

      MockDate.reset()
      installed = false
    },
    initialMockedLocalDate: 3000,
    tickDays(n: number) {
      MockDate.set(
        moment()
          .add(n, "days")
          .toDate(),
      )
    },
  }
}

export const MockTime = MockTimeConstructor()
