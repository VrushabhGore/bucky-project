var mongoose = require('mongoose');
var crypto = require('crypto')
var uuid = require('uuid/v1')
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    salt: {
        type: String,
    },
    hashedPassword: {
        type: String,
    },
    currentEmp: {
        type: String,
    },
    study: {
        type: String,
    },
    publications: {
        type: String,
    },
    research: {
        type: String,
    }, activity: {
        type: String,
    }, membership: {
        type: String
    }
})

userSchema.virtual('password').set(function (password) {
    this._password = password;
    this.salt = uuid();
    this.hashedPassword = this.encryptPassword(password)
}).get(function () {
    this._password
}
)

userSchema.methods = {
    authenticate: function (plaintext) {
        return this.encryptPassword(plaintext) === this.hashedPassword
    },

    encryptPassword: function (password) {
        if (!password) {
            return ''
        }
        try {

            return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
        }
        catch (e) {
            return e;
        }
    }

}

module.exports = mongoose.model('User', userSchema)


// virtual fields
