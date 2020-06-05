import {readable} from "svelte/store";
import {Trains} from "./domain/trains";


export const stations = readable({}, (set) => {
    fetch('https://rata.digitraffic.fi/api/v1/metadata/stations')
        .then(r => r.json())
        .then(rawStations => {
            const stations = {}
            rawStations.forEach(rs => {
                stations[rs.stationShortCode] = rs
            })
            set(stations)

        }).catch((e) => {
        throw e
    })
})

export const operators = readable({}, (set) => {
    fetch('https://rata.digitraffic.fi/api/v1/metadata/operators')
        .then(r => r.json())
        .then(rawOperator => {
            const operators = {}
            rawOperator.forEach(rs => {
                operators[rs.operatorShortCode] = rs
            })
            set(operators)

        }).catch((e) => {
        throw e
    })
})

export const causeCodes = readable(undefined, (set) => {
    const byIds = {}
    Promise.all([
        fetch('https://rata.digitraffic.fi/api/v1/metadata/cause-category-codes')
            .then(r => r.json())
            .catch((e) => {
                throw e
            }),
        fetch('https://rata.digitraffic.fi/api/v1/metadata/detailed-cause-category-codes')
            .then(r => r.json())
            .catch((e) => {
                throw e
            }),
        fetch('https://rata.digitraffic.fi/api/v1/metadata/third-cause-category-codes')
            .then(r => r.json())
            .catch((e) => {
                throw e
            })
    ]).then(([cat, detailed, third]) => {
        cat.forEach(c => byIds[c.id] = ({...c, name: c.categoryName, code: c.categoryCode}))
        detailed.forEach(d => byIds[d.id] = ({...d, name: d.detailedCategoryName, code: d.detailedCategoryCode}))
        third.forEach(t => byIds[t.id] = ({...t, name: t.thirdCategoryName, code: t.thirdCategoryCode}))

        set(byIds)
    }).catch((e) => {
        throw e
    })
})

export const EVENT_HUMAN_READABLE = {
    'COMMERCIAL_DEPARTURE': 'Lähtee',
    'COMMERCIAL_ARRIVAL': 'Saapuu (kaup)',
    'DEPARTURE': 'Lähtee',
    'ARRIVAL': 'Saapuu',
    'PASS': 'Ohittaa',
    'CANCELLED': 'Peruttu'
}