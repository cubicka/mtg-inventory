import lodash from 'lodash'

export function IsArray(x) {
    return Object.prototype.toString.call(x) === '[object Array]'
}

export function ValidateObj(obj, attrs) {
    return attrs.reduce((isValidated, attr) => {
        if (typeof attr === "string") {
            return isValidated && obj.hasOwnProperty(attr)
        }

        return attr.reduce((isValidatedDeep, attrsDeep, key) => {
            return isValidatedDeep && obj.hasOwnProperty(key) && ValidateObj(obj[key], attrsDeep)
        }, isValidated)
    }, true)
}

export function ValidateArr(arr, attrs) {
    return arr.reduce((isValidated, obj) => {
        return isValidated && ValidateObj(obj, attrs)
    }, true)
}

export function ProjectObj(obj, attrs) {
    if (!obj) return obj

    return attrs.reduce((accum, attr) => {
        accum[attr] = obj[attr]
        return accum
    }, {})
}

export function ExpandObjs(_objs, expansion) {
    const objs = IsArray(_objs) ? _objs : [_objs]
    return objs.map((obj) => (Object.assign(obj, expansion)))
}

export function ExpandObj(obj, expansion) {
    return lodash.assign({}, obj, expansion)
}

export function ArrToObj(arr, identityFn) {
    return lodash.reduce(arr, (accum, obj) => {
        accum[identityFn(obj)] = obj
        return accum
    }, {})
}

export function GroupBy(arr, identityFn) {
    return lodash.groupBy(arr, identityFn)
}

export function ProjectArr(arr, ids, identityFn = lodash.identity) {
    const filteredArr = lodash.filter(arr, (obj) => (ids.indexOf(identityFn(obj)) > -1))
    const obj = ArrToObj(filteredArr, identityFn)
    return ids.map((id) => (obj[id]))
}

export function DeepAttrs(obj, attrs) {
    return lodash.reduce(attrs, (deepObj, attr) => {
        if (!deepObj || !deepObj.hasOwnProperty(attr)) {
            return deepObj
        }

        return deepObj[attr]
    }, obj)
}
