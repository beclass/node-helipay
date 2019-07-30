const urllib = require('urllib')
const util = require('./util')
class Helipay {
    constructor({merchant_no, notify_url, sandbox = false} = {}, debug = false ){
        if(!merchant_no)  throw new Error('merchant_no fail')
        this.merchant_no = merchant_no
        this.notify_url  = notify_url
        this.domesticUrls= sandbox ? {
            appScan : 'https://cbptest.helipay.com/cbtrx/rest/domestic/pay/appScan',
            wxApp : 'https://cbptest.helipay.com/cbtrx/rest/domestic/pay/weChat/applet'
        } : {
            appScan : 'https://cbptrx.helipay.com/cbtrx/rest/domestic/pay/appScan',
            wxApp : 'https://cbptrx.helipay.com/cbtrx/rest/domestic/pay/weChat/applet'
        }
        this.debug = debug
    }
    log(...args) {
        if (this.debug) console.log(...args)
    }
    static init(...args) {
        return new Helipay(...args)
    }
    /**
     * @param {object} params 
     * @param {string} type 
     */
    async _request(params, url) {
        if(!params.serverCallbackUrl&&this.notify_url) {
            params.serverCallbackUrl = this.notify_url
        }
        const {aes_key, sha256_key, ...others} = params
        // 内容加密
        const content = util.aesEncrypt(others, aes_key)
        //签名
        const sign = util.sha256(others, sha256_key)
        const body = {
            merchantNo : this.merchant_no,
            orderNo    : others.orderNo,
            productCode: others.productCode,
            content    : content,
            sign       : sign
        }
        // 创建请求参数
        const pkg = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            content: JSON.stringify(body),
            timeout: [10000, 15000]
        }
        this.log('post data =>\r\n%s\r\n', pkg.content)
        let {status, data} = await urllib.request(url, pkg)
        if (status !== 200) throw new Error('request fail')
        data = JSON.parse(data.toString())
        let res = util.aesDecrypt(data.content, aes_key)
        res     = JSON.parse(res)
        this.log('receive data =>\r\n%s\r\n', JSON.stringify(res))
        return res
    }
    /**
     * 境内收单
     * @param {object} params 
     * @param {string} type 
     */
    domesticPay(params, type){
        const pkg = {
            ...params,
            merchantNo : this.merchant_no,
        }
        return this._request(pkg, this.domesticUrls[type])
    }
    payCallback(body,{aes_key, sha256_key} = {}){
        if(!aes_key) throw new Error('aes_key fail')
        if(!sha256_key) throw new Error('sha256_key fail')
        let decryptData = util.aesDecrypt(body.content, aes_key)
        decryptData     = JSON.parse(decryptData)
        this.log('helipay callback =>\r\n%s\r\n', JSON.stringify(decryptData))
        const sign = util.sha256(decryptData, sha256_key)
        if(sign!= body.sign) throw new Error('sign签名错误')
        return decryptData
    }
}


module.exports = Helipay

