module.exports = (nodecg) => {
    let api = require('./api')(nodecg)
    
    // Load and register the text module.
    require('./text')(nodecg, api)
    require('./events')(nodecg, api)
    require('./ticker')(nodecg, api)

    return api
}