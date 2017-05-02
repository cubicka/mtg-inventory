import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import expressValidator from 'express-validator'
import helmet from 'helmet'
import parsetrace from 'parsetrace'
import config from '../config'
import {AllowAJAX, ResponseAPI} from './helper'
import sessionMiddleware from './session'
import routes from './routes'

let app = express()
const origins = config.allowHost

app.set('port', 3001)
app.set('trust proxy', 1)

app.use(helmet())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(expressValidator())
app.use(cookieParser())

app.use(sessionMiddleware)

// allow ajax request
app.use(AllowAJAX({
    origins: config.domain.seller + config.domain.buyer,
    allowCredential: true,
}))

app.use(ResponseAPI)

// application route, exclude method OPTIONS
app.use('/', (req, res, next) => {
    if (req.method === 'OPTIONS') {
        res.send()
    } else {
        req.kulakan = {}
        next()
    }
})

app.use(routes)

// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
})

// error handlers
app.use((err, req, res, next) => {
    err.status = err.status || err.code || 500
    if (err.status >= 100 && err.status < 600)
        res.status(err.status);
    else
      res.status(500);

    res.errorBody = JSON.stringify({
        message: err.message
    })

    var result = {
        error: {
            message: err.message,
            code: err.status
        }
    }

    res.send(result)
})

export default app
