export function AllowAJAX(options) {
    return (req, res, next) => {
        function IsOriginAllowed(origin) {
            return options.origins.indexOf(origin) > -1
        }

        // Website you wish to allow to connect
        if (options && options.origins && IsOriginAllowed(req.header('origin'))) {
            res.setHeader('Access-Control-Allow-Origin', req.header('origin'))
        }

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,X-Access-Token')

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        if (options.allowCredential === true) {
            res.setHeader('Access-Control-Allow-Credentials', options.allowCredential)
        }

        // Pass to next layer of middleware
        next()
    }
}

export function ResponseAPI(req, res, next) {
    res.send403 = (message = 'Forbidden.') => {
        res.status(403).send({message})
    }

    res.send401 = (message = 'Invalid request.') => {
        res.status(401).send({message})
    }

    res.send400 = (message = 'Bad request.') => {
        res.status(400).send({message})
    }

    next()
}
