module.exports = (nodecg, api) => {
    const currentTickerReplicant = nodecg.Replicant('currentTicker', { persistent: false })
    const tickerReplicant = nodecg.Replicant('ticker')

    let runningTicker
    let activeItems = []

    function buildTicker() {
        // TODO: replace with deep copy, since that's something that comes with nodecg.
        let ticker = JSON.parse(JSON.stringify(tickerReplicant.value))
        if (ticker.length == 0) {
            return null
        }
        return ticker
    }

    function scheduleNextTransition() {
        if (activeItems.length == 0) {
            resolveNextInstance()
        }

        if (activeItems.length > 0) {
            currentTickerReplicant.value = activeItems.shift()
        }

        setTimeout(scheduleNextTransition, nodecg.bundleConfig.interval * 1000)
    }

    function resolveNextInstance() {
        if (runningTicker == null) {
            return
        }
        
        let instance = runningTicker.shift()
        
        if (runningTicker.length == 0) {
            runningTicker = buildTicker()
        }
        
        let tickerModule = api.moduleWithID(instance.moduleID)
        if (!tickerModule) {
            resolveNextInstance()
            return
        }

        activeItems = tickerModule._onResolve(instance)
        if (!Array.isArray(activeItems)) {
            activeItems = [activeItems]
        }
    }

    runningTicker = buildTicker()
    scheduleNextTransition()
}