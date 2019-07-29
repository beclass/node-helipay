const crypto = require('crypto');
module.exports={
    /**
     * 加密
     * aes key需要Base64.decode，之后再aes加密,IV向量为空。加密后的byte数组,经过Base64.encode之后,创建字符串,得到加密密文
     */
    aesEncrypt: (encryptedData, secret) => {
        try {
            encryptedData = JSON.stringify(encryptedData)
            const key     = Buffer.from(secret, 'base64')
            const iv      = new Buffer('')
            const cipher  = crypto.createCipheriv('aes-128-ecb', key, iv)
            const sign    = cipher.update(encryptedData, 'utf8', 'base64') + cipher.final('base64')
            return sign
        } catch (err) {
            throw err
        }
    },
    /**
     * 解密
     */
    aesDecrypt: (content,secret) => {
        try{
            const key  = Buffer.from(secret, 'base64')
            const iv   = new Buffer('')
            let decipher = crypto.createDecipheriv('aes-128-ecb', key, iv)
                decipher.setAutoPadding(true)
            let decoded  = decipher.update(content, 'base64', 'utf8')
                decoded += decipher.final('utf8')
            return decoded
        }catch(err){
            throw err
        }
    },
    /**
     * SHA256签名
     */
    sha256: (data, secret) => {
        try {
            const newData    = __objKeySort(data)
            const newDataStr = __convertObjToString(newData, secret)
            const sha        = crypto.createHash('SHA256').update(newDataStr.toString()).digest('hex')
            return sha
        } catch (err) {
            throw err
        }
    }
}

/**
 * 对象key排序
 * @param {object} obj 
 */
function __objKeySort(obj) {
    const newkey = Object.keys(obj).sort()
    let newObj   = {};
    for (let i = 0; i < newkey.length; i++) {
        let val = obj[newkey[i]]
        if (val != '') {
            if (Array.isArray(val)) {
                val.forEach((item, index) => {
                    val[index] = __objKeySort(item)
                })
            }
            newObj[newkey[i]] = val
        }
    }
    return newObj
}
/**
 * 转换等号字符串
 * @param {object} obj 
 * @param {string} secret 
 */
function __convertObjToString(obj, secret) {
    let str = ''
    const newkey = Object.keys(obj)
    for (let i = 0; i < newkey.length; i++) {
        let val = obj[newkey[i]]
        if (Array.isArray(val)) {
            val = JSON.stringify(val)
        }
        str += newkey[i] + '=' + val
        if (i < newkey.length - 1) str += ','
    }
    if (secret) str = secret + ',' + str + ',' + secret
    return str
}