import db from '../config/database.js'

export const getCards = (result) => {
  db.query('SELECT * FROM cards', (err, res) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, res)
    }
  })
}

export const getCard = ({ id }, result) => {
  db.query('SELECT * FROM cards WHERE CardDefId = ?', [id], (err, res) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, res)
    }
  })
}

export const setCard = ({ CardDefId, series, Img }, result) => {
  db.query('INSERT INTO cards SET? ', [{ CardDefId, series, Img }], (err, res) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, res)
    }
  })
}

export const deleteCard = ({ CardDefId }, result) => {
  db.query('DELETE FROM cards WHERE CardDefId = ?', [CardDefId], (err, res) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, res)
    }
  })
}

export const updateSeries = ({ CardDefId, newSeries }, result) => {
  db.query('UPDATE cards SET series = ? WHERE CardDefId= ?', [newSeries, CardDefId], (err, res) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, res)
    }
  })
}
