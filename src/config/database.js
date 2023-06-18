import mysql from 'mysql2'

const db = mysql.createConnection({
  host: database.host,
  user: database.user,
  password: database.password,
  database: database.database
})

export default db
