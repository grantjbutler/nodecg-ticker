if (!process.browser) {
    console.error("Importing browser API in non-browser environment. Use `nodecg.extensions['nodecg-ticker']` to access extension API.")
}

module.exports = {
    createInstance (moduleID, data) {
        if (typeof moduleID !== 'string') {
            console.error('Expected to get a string for the module ID.')
            return
        }

        if (typeof data !== 'object') {
            console.error('Expected to get an object for data.')
            return
        }
        
        nodecg.sendMessage('ticker:create-instance', {
            moduleID,
            data
        })
    }
}