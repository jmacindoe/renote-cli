import mongoose from "mongoose"
import { Errors } from "../error/Errors"

export const BackendDb = {
  init(mongoUri: string) {
    mongoose.Promise = global.Promise

    mongoose
      .connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .catch(e => Errors.recordError(e))

    // Catches errors that occur later, after the connection is established
    mongoose.connection.on("error", e => {
      Errors.recordError(e)
    })
  },

  tearDown() {
    mongoose.disconnect()
  },
}
