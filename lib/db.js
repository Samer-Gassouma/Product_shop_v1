import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

let client;
let db;

async function connectToDatabase() {
  if (!client) {
    client = await MongoClient.connect(uri);
    db = client.db(dbName);
  }
}

function getDB() {
  return db;
}

export { connectToDatabase, getDB };
