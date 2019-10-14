import mongoose from "mongoose"
import { Errors } from "./error/Errors"

export function init() {
  initDB()
}

function initDB() {
  mongoose.Promise = global.Promise

  mongoose
    .connect("mongodb://localhost:27017/renote", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch(e => Errors.recordError(e))

  // Catches errors that occur later, after the connection is established
  mongoose.connection.on("error", e => {
    Errors.recordError(e)
  })
}
