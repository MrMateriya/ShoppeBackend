import pg from 'pg'
import mongoose from "mongoose";
const dbClient = new pg.Client({
  user: 'postgres',
  password: 'zoro1234554321',
  host: 'localhost',
  port: 5432,
  database: 'TestOnlineJewerlyStore'
})
const db = new pg.Pool({
  user: 'postgres',
  password: 'zoro1234554321',
  host: 'localhost',
  port: 5432,
  database: 'TestOnlineJewelryStore'
})

dbClient.connect(err => {
  if (err) throw new err
})
mongoose.connect('mongodb+srv://gamearashow:WmtymlqStDK7QlxS@onlinejewelrystore.j7rnqv8.mongodb.net/OnlineJewelryStore')
  .then(() => {console.log('MongooseClient connected')})
  .catch((err) => {throw new Error(err)})

export {db, dbClient}