const fs = require('fs')

function ProjectObj(obj, attrs) {
    if (!obj) return obj

    return attrs.reduce((accum, attr) => {
        accum[attr] = obj[attr]
        return accum
    }, {})
}

function AddSet(setCode, type = 'online', isEmpty = 'true') {
    const setRaw = require(`../raw/${setCode}.json`)
    if (setRaw) {
        const collsFile = `${type}/${setCode}.json`

        let set = {}
        let colls = {}
        try {
            colls = require(`../${collsFile}`)
        } catch (e) {}

        const copiedAttrs = ['cmc', 'id', 'manaCost', 'name', 'number', 'rarity', 'types', 'subtypes']

        setRaw.cards.forEach((card) => {
            const cardNumber = parseInt(card.number, 10)
            if (card.rarity === "Basic Land") return

            var cardProcessed = ProjectObj(card, copiedAttrs)
            if (card.layout === "aftermath") {
                console.log('multiple names', card.names)
                cardProcessed.name = card.names.join(' // ')
            }

            colls[card.id] = isEmpty ? 0 : 4
            set[cardNumber] = cardProcessed
        })

        fs.writeFile(`cards/${setCode}.json`, JSON.stringify(set), (err) => {})
        fs.writeFile(collsFile, JSON.stringify(colls), (err) => {})
    }
}

function ExcludeCollection(setCode, missing, type = 'online') {
    const cardsObj = require(`../cards/${setCode}.json`)
    const collsFile = `${type}/${setCode}.json`
    const colls = require(`../${collsFile}`)

    const cards = Object.keys(cardsObj).map((x) => (cardsObj[x]))
    const names = missing.map((name) => (name.slice(2)))
    const notFound = names.filter((name) => (cards.findIndex((card) => (card.name === name)) === -1))

    if (notFound.length > 0) {
        console.log('Not Found', notFound)
        return
    }

    missing.forEach((item) => {
        const count = parseInt(item.slice(0,2), 10)
        const name = item.slice(2)
        const card = cards.find((card) => (card.name === name))
        const id = card.id

        colls[id] -= count
    })

    fs.writeFile(collsFile, JSON.stringify(colls), (err) => {
        console.log('err', err)
    })
}

// const expansions = ['AKH', 'AER', 'KLD', 'EMN', 'SOI', 'OGW', 'BFZ']
// const expansions = ['OGW']
// expansions.forEach((name) => {AddSet(name)})