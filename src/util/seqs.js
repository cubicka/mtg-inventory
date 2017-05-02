import lodash from 'lodash'

function concat(arrs) {
    return arrs.reduce((accum, arr) => {
        return accum.concat(arr)
    }, [])
}

function getAttr(attr) {
    return (obj) => (obj[attr])
}

function juxt(...fns) {
    return (obj) => {
        return fns.map((fn) => (fn(obj)))
    }
}

function mapcat(fn, arr) {
    return concat(arr.map(fn))
}

function mapjuxt(...fns) {
    return (arr) => {
        return arr.map(juxt(...fns))
    }
}

function pipe(val, ...fns) {
    return fns.reduce((accum, fn) => {
        return fn(accum)
    }, val)
}

function uniq(arr) {
    return lodash.uniq(arr)
}

export default {
    concat, getAttr, juxt, mapcat, mapjuxt, pipe, uniq
}
