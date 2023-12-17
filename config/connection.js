const MongoClient = require("mongodb").MongoClient

const state = {
  db: null
}

module.exports.connect = (callback) => {



  // // Replace the uri string with your connection string.
  const url = "mongodb://localhost:27017/";

  const client = new MongoClient(url);
  state.db = client.db('shoppingCart');
  const database = state.db
  callback()

}

module.exports.get = () => { return state.db }