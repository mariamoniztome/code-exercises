const { MongoClient } = require('mongodb')
const uri = require('./atlas_uri')

console.log('MongoDB URI:', uri)
const client = new MongoClient(uri)
const dbName = 'bank'

const connectToMongoDB = async () => {
  try {
    await client.connect()  
    console.log('Connected successfully to MongoDB server')
    const db = client.db(dbName)
    return db
  } catch (err) {
    console.error('Connection to MongoDB failed:', err)
    throw err
  }
}

connectToMongoDB()