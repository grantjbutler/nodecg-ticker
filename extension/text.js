module.exports = (nodecg, api) => {
    let textModule = new api.TickerModule('com.grantjbutler.nodecg-ticker.text', 'Text', 'Displays text in the ticker.')
                            .registerDialog('ticker-add-text', nodecg.bundleName)
                            .onMakeInstanceDescription((data) => {
                                return data.text
                            })
    api.registerModule(textModule)
}