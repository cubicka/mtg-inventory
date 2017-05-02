const fs = require('fs')

function Cleaner(ss) {
    const lands = ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest']
    const lines = ss.split('\n')

    function StartWithNumber(line) {
        return !isNaN(parseInt(line.split(' ')[0], 10))
    }

    function IsLand(name) {
        return lands.indexOf(name) !== -1
    }

    return lines.filter(StartWithNumber).reduce((cards, line) => {
        const token = line.split(' ')
        const number = parseInt(token[0], 10)
        const sliceIdx = token[1] === 'x' ? 2 : 1
        const name = token.slice(sliceIdx).join(' ').trim()

        if (IsLand(name)) return cards
        const prevIdx = cards.findIndex((card) => (card.name === name))

        if (prevIdx === -1) {
            return cards.concat([{name, number}])
        }

        cards[prevIdx].number += number
        return cards
    }, []).map((card) => (`${card.number} ${card.name}`))
}

function AddDeck(url, name, cards) {
    const deck = {url, name}
    deck.cards = Cleaner(cards)
    fs.writeFile(`decks/target/${deck.name}.json`, JSON.stringify(deck), (err) => {console.log('err', err)})
    console.log(deck.cards)
}

function LoadExpansion() {
    const cards = []
    expansions.forEach((setCode) => {
        const exp = require(`../cards/${setCode}`)
        Object.keys(exp).map((x) => {
            cards.push(Object.assign(exp[x], {setCode}))
        })
    })

    return cards
}

function LoadCollections(type = 'online') {
    const cards = {}
    expansions.forEach((setCode) => {
        const exp = require(`../${type}/${setCode}`)
        Object.keys(exp).map((x) => {
            cards[x] = exp[x]
        })
    })

    return cards
}

const expansions = ['AKH', 'AER', 'KLD', 'EMN', 'SOI', 'OGW', 'BFZ']
const allCards = LoadExpansion()
const allColls = LoadCollections()

function CheckColls() {
    fs.readdirSync('decks/target')
    .forEach(function(file) {
        const decks = require(`../decks/target/${file}`)
        console.log('=======', decks.name)
        decks.cards.forEach((card) => {
            const token = card.split(' ')
            const number = parseInt(token[0], 10)
            const name = token.slice(1).join(' ').trim()

            const cardDetail = allCards.find((detail) => (detail.name === name))
            if (cardDetail) {
                if (allColls[cardDetail.id] < number) {
                    console.log(number - allColls[cardDetail.id], name)
                }
            } else {
                console.log('NOT_FOUND', name)
            }
        })
        console.log()
    });
}

CheckColls()
