import mongoose from "mongoose";

function mongoDBConnect() {
  mongoose.connect('mongodb+srv://gamearashow:WmtymlqStDK7QlxS@onlinejewelrystore.j7rnqv8.mongodb.net/OnlineJewelryStore')
    .then(() => {
      console.log('MongoDB Connected successfully')
    })
    .catch((e) => {
      throw new Error(e)
    })
}

export {mongoDBConnect}