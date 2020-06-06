const crypto = require('crypto');

/**
 * Returns an encrypted and base64 encoded string
 */
module.exports.encryptJwt = function (jwt, key) {
    var iv = crypto.randomBytes(32).toString('hex').slice(0,16);

    var cipher = crypto.createCipheriv('aes-128-ctr', key, iv);
    var encrypted = Buffer.concat([cipher.update(jwt), cipher.final()]).toString('base64');

    return Buffer.from(iv + encrypted).toString('base64');
}