export default class Cache {
    "use strict";
    constructor(fetchFunction, minutesToLive = 10) {
        this.millisecondsToLive = minutesToLive * 60 * 1000
        this.fetchFunction = fetchFunction
        this.cache = null
        this.getData = this.getData.bind(this)
        this.resetCache = this.resetCache.bind(this)
        this.isCacheExpired = this.isCacheExpired.bind(this)
        this.fetchDate = new Date(0)
    }

    isCacheExpired() { return (this.fetchDate.getTime() + this.millisecondsToLive < new Date().getTime()) }
    resetCache() { this.fetchDate = new Date(0) }
    async getData() {
        if (!this.cache || this.isCacheExpired()) {// 
            try {
                const data = await this.fetchFunction()
                this.cache = data
                this.fetchDate = new Date()
                return data
            } catch (error) {
                return undefined
            }
        } else {
            return Promise.resolve(this.cache)
        }
    }
}