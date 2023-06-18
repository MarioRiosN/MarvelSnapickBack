import db from '../config/database.js'

export const createDraft = ({ userLogged }, result) => {
  db.query(
    'CREATE TABLE `marvelsnapick_db`.`' +
      userLogged +
      '` (`jugador` INT NOT NULL AUTO_INCREMENT , `sobre1` VARCHAR(255) NOT NULL , `sobre2` VARCHAR(255) NOT NULL , `sobre3` VARCHAR(255) NOT NULL , `mazo` VARCHAR(1000) NOT NULL , PRIMARY KEY (`jugador`)) ENGINE = InnoDB ',
    (err, res) => {
      if (err) {
        result(err, null)
      } else {
        result(null, res)
      }
    }
  )
}

export const addPlayer = ({ userLogged, jugador, sobre1, sobre2, sobre3, mazo }, result) => {
  db.query(
    'INSERT INTO`' + userLogged + '`SET?',
    [{ jugador, sobre1, sobre2, sobre3, mazo }],
    (err, res) => {
      if (err) {
        result(err, null)
      } else {
        result(null, res)
      }
    }
  )
}

export const countPlayers = ({ nombrePartida }, result) => {
  db.query('SELECT COUNT(*) FROM `' + nombrePartida + '`', (err, res) => {
    if (err) {
      result(err, null)
    } else {
      result(null, res)
    }
  })
}

export const getCardsGame = ({ userLogged, jugador }, result) => {
  db.query(
    'SELECT sobre1,sobre2,sobre3 FROM `' + userLogged + '` WHERE jugador<' + jugador,
    (err, res) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        result(null, res)
      }
    }
  )
}

export const getPlayerCards = ({ nombrePartida, fillSobre, fillJugador }, result) => {
  db.query(
    'SELECT ' + fillSobre + ' FROM `' + nombrePartida + '` WHERE jugador=' + fillJugador,
    (err, res) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        result(null, res)
      }
    }
  )
}

export const updatePlayer = ({ nombrePartida, fillSobre, fillJugador, updatedCards }, result) => {
  db.query(
    'UPDATE `' + nombrePartida + '` SET ' + fillSobre + '= ? WHERE jugador= ?',
    [updatedCards, fillJugador],
    (err, res) => {
      if (err) {
        console.log(err)
        result(err, null)
      } else {
        result(null, res)
      }
    }
  )
}

export const dropTable = ({ nombrePartida }, result) => {
  db.query('DROP TABLE `' + nombrePartida + '`', (err, res) => {
    if (err) {
      console.log(err)
      result(err, null)
    } else {
      result(null, res)
    }
  })
}
