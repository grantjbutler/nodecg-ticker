module.exports = (nodecg, api) => {
    const tickerReplicant = nodecg.Replicant('ticker')
    
    nodecg.listenFor('ticker:add-module', (moduleID) => {
        let tickerModule = api.moduleWithID(moduleID)
        if (tickerModule.hasDialog) {
            nodecg.sendMessage('ticker:show-dialog', {
                dialogName: tickerModule.dialogName,
                bundleName: tickerModule.bundleName,
                moduleID
            })
        }
        else {
            nodecg.sendMessage('ticker:create-instance', {
                moduleID
            })
        }
    })

    nodecg.listenFor('ticker:create-instance', (info) => {
        let tickerModule = api.moduleWithID(info.moduleID)
        if (!tickerModule) {
            nodecg.log.error(`Could not find module with ID of ${info.moduleID}`)
            return
        }
        
        tickerReplicant.value.push(tickerModule.createInstance(info.data))
    })

    nodecg.listenFor('ticker:delete-instance', ({ id }) => {
        tickerReplicant.value = tickerReplicant.value.filter((instance) => { return instance.id != id })
    })

    nodecg.listenFor('ticker:move-down', ({ id }) => {
        let index = tickerReplicant.value.findIndex((object) => { return object.id == id })
        if (index == -1) {
            return
        }

        if (index == tickerReplicant.value.length - 1) {
            return
        }

        let removedItem = tickerReplicant.value.splice(index, 1)
        tickerReplicant.value.splice(index + 1, 0, ...removedItem)
    })

    nodecg.listenFor('ticker:move-up', ({ id }) => {
        let index = tickerReplicant.value.findIndex((object) => { return object.id == id })
        if (index == -1) {
            return
        }

        if (index == 0) {
            return
        }

        let removedItem = tickerReplicant.value.splice(index, 1)
        tickerReplicant.value.splice(index - 1, 0, ...removedItem)
    })
}