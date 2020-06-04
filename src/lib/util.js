export const getDigitrafficEndpoint = async (endpoint) => {
    try {
        const r = await fetch('https://rata.digitraffic.fi/api/v1/' + endpoint)
        const data = await r.json()
        return data
    } catch (e) {
        throw e
    }
}

export const filterTrains = (currentSettings) => {
    const {showOnlyRunning, filterTrainCategories, filterTrainTypes, filterCommuterLineID} = currentSettings
    const filterCategoriesSet = new Set(filterTrainCategories)
    const filterTrainTypesSet = new Set(filterTrainTypes.split(',').map(s => s.toUpperCase()))
    const filterCommuterLineIDSet = new Set(filterCommuterLineID.split(',').map(s => s.toUpperCase()))
    return (train) => {
        if (showOnlyRunning && !train.running) return false;
        if (filterTrainCategories.length > 0 && !filterCategoriesSet.has(train.trainCategory)) return false;
        if (filterTrainTypes.length > 0 && !filterTrainTypesSet.has(train.trainType)) return false;
        if (filterCommuterLineID.length > 0 && !filterCommuterLineIDSet.has(train.commuterLineID)) return false;
        return true;
    }
}