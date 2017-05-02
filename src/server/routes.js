import express from 'express'
import {IsArray} from '../util/obj'

function Reify(path) {
    const routeSpecs = require(path).default

    let router = express.Router()
    if ('use' in routeSpecs) {
        routeSpecs.use.forEach((name) => {
            if (typeof name === 'function') {
                router.use(name)
                return
            }

            const childRouter = Reify(path + name)
            router.use(name, childRouter)
        })
    }

    const httpOps = ['get', 'post']
    httpOps.forEach((ops) => {
        if (ops in routeSpecs) {
            const specs = routeSpecs[ops]
            if (IsArray(specs[0])) {
                specs.forEach((spec) => {
                    router[ops](...spec)
                })
            } else {
                router[ops](...specs)
            }
        }
    })

    return router
}

export default Reify('../routes')
