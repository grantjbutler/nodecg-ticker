const uuid = require('uuid/v4')

module.exports = (nodecg) => {
    const registryReplicant = nodecg.Replicant('tickerRegistry', { persistent: false })

    let modules = []

    class TickerModule {
        constructor (id, name, description) {
            this.id = id
            this.name = name
            this.description = description
            this.onResolve((instance) => {
                return {
                    ...instance.data,
                    id: instance.id
                }
            })
        }
        get info () {
            return {
                id: this.id,
                name: this.name,
                description: this.description,
                dialogName: this.dialogName,
                bundleName: this.bundleName,
            }
        }
        get hasDialog () {
            return this.dialogName && this.bundleName
        }
        onResolve (callback) {
            this._onResolve = callback

            return this
        }
        onMakeInstanceDescription (callback) {
            this._onMakeInstanceDescription = callback

            return this
        }
        registerDialog (name, bundleName) {
            this.dialogName = name
            this.bundleName = bundleName

            return this
        }
        createInstance (data) {
            let instanceDescription = `${this.name}`
            if (this._onMakeInstanceDescription) {
                let specializedDescription = this._onMakeInstanceDescription(data)
                if (specializedDescription && specializedDescription.trim().length > 0) {
                    instanceDescription = specializedDescription
                }
            }
            
            return {
                id: uuid(),
                moduleID: this.id,
                description: instanceDescription,
                data
            }
        }
    }
    
    return {
        TickerModule,
        registerModule (aModule) {
            modules.push(aModule)
            registryReplicant.value.push(aModule.info)
        },
        moduleWithID (id) {
            return modules.find((registered) => {
                return registered.id == id
            })
        }
    }
}