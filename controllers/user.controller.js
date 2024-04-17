import {db, dbClient} from "../database.js";
class UserController {
  static async getAllUsers(req, res) {
    dbClient.query('select * from users')
      .then(dbRes => {
        res.send(dbRes.rows)
      })
      .catch(err => console.log(err))
  }
  static async getUser(req, res) {
    const userId = req.params.id
    dbClient.query(`select * from users where id = ${userId}`)
      .then(dbRes => {
        res.send(dbRes.rows)
      })
      .catch(err => console.log(err))
  }
  static async addUser(req, res) {
    const {name, password} = req.body;
    if (name === undefined || password === undefined) {
      await res.json({message: 'Fields are empty'})
      return;
    }
    const userNames = await dbClient.query(`select name from users`)
    console.log(userNames)
    //await dbClient.query(`insert into users(name, password) VALUES ('${name}', '${password}')`)
    res.json(req.body)
  }
  static async
}

export { UserController }