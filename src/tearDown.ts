import mongoose from "mongoose"

export function tearDown() {
  tearDownDB()
}

function tearDownDB() {
  mongoose.disconnect()
}
