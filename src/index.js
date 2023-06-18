import express from 'express'
import corss from 'cors'
import { getCards, getCard, setCard, deleteCard, updateSeries } from './models/CardModel.js'
import {
  getUsers,
  setUser,
  updateUsername,
  updatePassword,
  updateRol,
  deleteUser
} from './models/UserModel.js'
import {
  createDraft,
  addPlayer,
  countPlayers,
  getCardsGame,
  getPlayerCards,
  updatePlayer,
  dropTable
} from './models/GameModel.js'
const app = express()
const port = process.env.PORT || 8081;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use(corss())
app.use(express.json())

// Middleware to intercept the response body, adding to locals so we can log later.
app.use((req, res, next) => {
  const oldJson = res.json
  res.json = (body) => {
    res.locals.body = body
    return oldJson.call(res, body)
  }
  next()
})

// Middleware to log in console the request and body response.
app.use(function (req, res, next) {
  if (req.url !== '/') {
    res?.on('finish', () => {
      const response = res.locals.body
      const details = {
        method: req?.method,
        url: req?.path,
        status: res.statusCode,
        code: res.statusMessage,
        body: response || {}
      }
      console.log(details)
    })
  }
  next()
})

app.post('/user/login', (req, res) => {
  const { username, password } = req.body
  getUsers((err, results) => {
    if (err) {
      res.send(err)
    } else if (
      results.some(
        (user) =>
          user['username'] === username && user['password'] === password && user['rol'] === 'admin'
      )
    ) {
      res.send('admin')
    } else if (
      results.some(
        (user) =>
          user['username'] === username && user['password'] === password && user['rol'] === 'user'
      )
    ) {
      res.send('user')
    } else {
      res.status(404).send({ data: 'User not found!' })
    }
  })
})

app.post('/user/register', (req, res) => {
  const { username, password } = req.body
  //busca si existe en el array obtenido de la bbdd un objeto cuyo username coincida con el nuevo username
  getUsers((err, results) => {
    if (err) {
      res.send(err)
    } else if (results.some((user) => user['username'] === username)) {
      res.status(404).send({ data: 'User repeat!' })
    } else {
      setUser({ username, password }, (err, results) => {
        if (err) {
          res.send(err)
        } else {
          res.send(true)
        }
      })
    }
  })
})

app.put('/user/rename', (req, res) => {
  const { userLogged, oldUsername, newUsername } = req.body
  if (oldUsername === userLogged) {
    //busca en el array obtenido de la base de datos el objeto cuyo username coincida con oldUsername y lo cambia a newUsername
    updateUsername({ oldUsername, newUsername }, (err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.send(true)
      }
    })
  } else {
    res.status(404).send({ data: 'User does not match!' })
  }
})

app.put('/user/repassword', (req, res) => {
  const { userLogged, oldPassword, newPassword } = req.body
  getUsers((err, results) => {
    if (err) {
      res.send(err)
    } else if (
      results.some((user) => user['username'] === userLogged && user['password'] === oldPassword)
    ) {
      updatePassword({ oldPassword, newPassword }, (err, results) => {
        if (err) {
          res.send(err)
        } else {
          res.send(true)
        }
      })
    } else {
      res.status(404).send({ data: 'User not found!' })
    }
  })
})
app.get('/user/users', (req, res) => {
  getUsers((err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.send(results)
    }
  })
})
app.put('/user/rerol', (req, res) => {
  var { username, rol } = req.body
  if (rol === 'admin') {
    rol = 'user'
  } else {
    rol = 'admin'
  }
  updateRol({ username, rol }, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.send(true)
    }
  })
})

app.delete('/user/delete', (req, res) => {
  const { username } = req.body
  deleteUser({ username }, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.send(true)
    }
  })
})

app.get('/cards', (req, res) => {
  getCards((err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.send(results)
    }
  })
})
app.post('/cards/getCard', (req, res) => {
  const { id } = req.body
  getCard({ id }, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.send(results)
    }
  })
})
app.post('/cards/addCard', (req, res) => {
  const { CardDefId, series, Img } = req.body
  setCard({ CardDefId, series, Img }, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.send(true)
    }
  })
})
app.delete('/cards/deleteCard', (req, res) => {
  const { CardDefId } = req.body
  deleteCard({ CardDefId }, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.send(true)
    }
  })
})
app.put('/cards/editSeries', (req, res) => {
  const { CardDefId, newSeries } = req.body
  updateSeries({ CardDefId, newSeries }, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.send(true)
    }
  })
})

app.post('/games/createDraft', (req, res) => {
  const { userLogged } = req.body
  createDraft({ userLogged }, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.send(true)
    }
  })
})
app.post('/games/addFirstPlayer', (req, res) => {
  const { userLogged } = req.body
  var cards = []
  var cardsPlayer = []
  var jugador = 1
  var sobre1 = []
  var sobre2 = []
  var sobre3 = []
  const mazo = ''
  getCards((err, results) => {
    if (err) {
      res.send(err)
    } else {
      for (i = 0; i < results.length; i++) {
        cards.push(results[i].CardDefId)
      }
      for (var i = cards.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1))
        var temp = cards[i]
        cards[i] = cards[j]
        cards[j] = temp
      }
      for (var k = 0; k < 18; k++) {
        cardsPlayer.push(cards.pop())
      }
      for (var l = 0; l < 6; l++) {
        sobre1.push(cardsPlayer.pop())
        sobre2.push(cardsPlayer.pop())
        sobre3.push(cardsPlayer.pop())
      }
      sobre1 = sobre1.toString()
      sobre2 = sobre2.toString()
      sobre3 = sobre3.toString()
      addPlayer({ userLogged, jugador, sobre1, sobre2, sobre3, mazo }, (err, results) => {
        if (err) {
          res.send(err)
        } else {
          res.send(true)
        }
      })
    }
  })
})
app.post('/games/countPlayers', (req, res) => {
  const { nombrePartida } = req.body
  countPlayers({ nombrePartida }, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.send(results)
    }
  })
})
app.post('/games/addPlayer', (req, res) => {
  const { nombrePartida, jugador } = req.body
  var cards = []
  var cardsToSplit = ''
  var cardsOthers = []
  var cardsPlayer = []
  var sobre1 = []
  var sobre2 = []
  var sobre3 = []
  const mazo = ''
  var userLogged = nombrePartida
  getCards((err, results) => {
    if (err) {
      res.send(err)
    } else {
      for (var i = 0; i < results.length; i++) {
        cards.push(results[i].CardDefId)
      }
      getCardsGame({ userLogged, jugador }, (err, results) => {
        if (err) {
          res.send(err)
        } else {
          if (jugador === 2) {
            cardsToSplit =
              Object.values(results[0])[0] +
              ',' +
              Object.values(results[0])[1] +
              ',' +
              Object.values(results[0])[2]
          } else if (jugador == 3) {
            cardsToSplit =
              Object.values(results[0])[0] +
              ',' +
              Object.values(results[0])[1] +
              ',' +
              Object.values(results[0])[2] +
              ',' +
              Object.values(results[1])[0] +
              ',' +
              Object.values(results[1])[1] +
              ',' +
              Object.values(results[1])[2]
          } else {
            cardsToSplit =
              Object.values(results[0])[0] +
              ',' +
              Object.values(results[0])[1] +
              ',' +
              Object.values(results[0])[2] +
              ',' +
              Object.values(results[1])[0] +
              ',' +
              Object.values(results[1])[1] +
              ',' +
              Object.values(results[1])[2] +
              ',' +
              Object.values(results[2])[0] +
              ',' +
              Object.values(results[2])[1] +
              ',' +
              Object.values(results[2])[2]
          }
          cardsOthers = cardsToSplit.split(',')
          for (var i = 0; i < cardsOthers.length; i++) {
            cards.splice(cards.indexOf(cardsOthers[i]), 1)
          }
          for (var i = cards.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1))
            var temp = cards[i]
            cards[i] = cards[j]
            cards[j] = temp
          }
          for (var k = 0; k < 18; k++) {
            cardsPlayer.push(cards.pop())
          }
          for (var l = 0; l < 6; l++) {
            sobre1.push(cardsPlayer.pop())
            sobre2.push(cardsPlayer.pop())
            sobre3.push(cardsPlayer.pop())
          }
          sobre1 = sobre1.toString()
          sobre2 = sobre2.toString()
          sobre3 = sobre3.toString()
          addPlayer({ userLogged, jugador, sobre1, sobre2, sobre3, mazo }, (err, results) => {
            if (err) {
              res.send(err)
            } else {
              res.send(true)
            }
          })
        }
      })
    }
  })
})
app.post('/games/getPlayerCards', (req, res) => {
  const { nombrePartida, fillSobre, fillJugador } = req.body
  var cardsToSplit = ''
  var cardsOthers = []
  getPlayerCards({ nombrePartida, fillSobre, fillJugador }, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      cardsToSplit = Object.values(results[0])[0]
      cardsOthers = cardsToSplit.split(',')
      res.send(cardsOthers)
    }
  })
})
app.put('/games/updatePlayer', (req, res) => {
  const { nombrePartida, fillSobre, fillJugador, updatedCards } = req.body
  updatePlayer({ nombrePartida, fillSobre, fillJugador, updatedCards }, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.send(true)
    }
  })
})

app.delete('/games/dropTable', (req, res) => {
  const { nombrePartida } = req.body
  dropTable({ nombrePartida }, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.send(true)
    }
  })
})
