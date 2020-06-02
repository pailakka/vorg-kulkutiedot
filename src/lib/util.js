export const getDigitrafficEndpoint = async (endpoint) => {
    try {
        const r = await fetch('https://rata.digitraffic.fi/api/v1/' + endpoint)
        const data = await r.json()
        return data
    } catch (e) {
        throw e
    }
}