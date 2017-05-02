import session from 'express-session'
import store from './store'
import config from '../config'

export default session({
    secret: 'expecto patronum!',
    resave: false,
    saveUninitialized: true,
    name: 'quoVadis?',
    store: store,
    cookie: {
        secure: config.isSecure,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 14
    }
})
