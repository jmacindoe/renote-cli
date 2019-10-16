import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import { BackendDb } from "./BackendDb"

export class TestBackendDb {
  mongod = new MongoMemoryServer()

  async init() {
    const uri = await this.mongod.getConnectionString()
    BackendDb.init(uri)
  }

  tearDown() {
    BackendDb.tearDown()
  }

  async deleteAllData() {
    // @ts-ignore: missing from type signature
    const { host, port } = mongoose.connection
    const testPort = await this.mongod.getPort()
    if (host !== "127.0.0.1" || port !== testPort) {
      throw new Error(
        `Might not be connected to the test DB! Aborting delete operation. Connected to: ${host}:${port}`,
      )
    }
    const db = mongoose.connection.db
    if (db) {
      const collections = await db.listCollections().toArray()
      Promise.all(
        collections
          .map(({ name }) => name)
          .map(collection =>
            mongoose.connection.db.collection(collection).drop(),
          ),
      )
    }
  }

  async createDocument(collectionName: string, document: any): Promise<any> {
    const { ops } = await mongoose.connection.db
      .collection(collectionName)
      .insertOne(document)
    return ops[0]
  }
}
