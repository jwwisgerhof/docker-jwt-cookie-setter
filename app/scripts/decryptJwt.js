const crypto = require('crypto');

/**
 * Returns an decrypted and base64 encoded string
 */
module.exports.decryptJwt = function (jwt, key) {
    const jwtRaw = Buffer.from(jwt, 'base64').toString();
    const iv = jwtRaw.slice(0,16);
    const encrypted = jwtRaw.slice(16);

    var decipher = crypto.createDecipheriv('aes-128-ctr', key, iv);
    var decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted, 'base64')), decipher.final()]);

    return decrypted.toString();
}