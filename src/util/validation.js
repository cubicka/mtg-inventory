export function Validation(specs) {
    if (typeof specs === "function") {
        return specs
    } else if (typeof specs === "object") {
        return IsObject(specs)
    } else if (Object.prototype.toString.call(arr) === '[object Array]') {
        return IsArray(specs)
    }

    return (x) => (x)
}

export function Complement(fn) {
    return (...args) => (!(fn(...args)))
}

export function IsNumber(x) {
    return (typeof x === "number") && !isNaN(x)
}

export function IsParseNumber(x) {
    return IsNumber(parseFloat(x, 10))
}

export function IsParseDate(s) {
    const d = new Date(s)
    return (Object.prototype.toString.call(d) === "[object Date]") && (isNaN(d.getTime()))
}

export function IsNull(x) {
    return x === null
}

export function IsString(s) {
    return typeof s === "string"
}

export function IsPhone(phone) {
    var regexPhone = /^[+]?([\d]{3}(-| )?[\d]{3}(-| )?[\d]{4}|[\d]{5,12}|}|[(][\d]{3}[)](-| )?[\d]{3}(-| )?[\d]{4})$/;
    return IsString(phone) && regexPhone.test(phone)
}

export function IsObject(specs) {
    return (obj) => {
        if (typeof obj !== "object") return false
        if (!specs) return true
        return Object.keys(specs).reduce((isValidated, attr) => {
            if (!isValidated || !(attr in obj)) return false
            return Validation(specs[attr])(obj[attr])
        }, true)
    }
}

export function IsArray(specFn) {
    return (arr) => {
        if (Object.prototype.toString.call(arr) !== '[object Array]') return false
        if (!specFn) return true

        const fn = Validation(specFn)
        return arr.reduce((isValidated, obj) => {
            if (!isValidated) return false
            return fn(obj)
        }, true)
    }
}

export function Middleware(specs) {
    return (req, res, next) => {
        const fn = Validation(specs)
        if (fn(req)) {
            return next()
        }

        res.send400()
    }
}
