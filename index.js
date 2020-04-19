const fs = require('fs');
const path = require('path');

const _baseConfig = {
    autoCreateUser: true,
    defaultRoles: [0, 1],
    fallbackToLocal: true
};

var _axios = null;
var _ws = null;
var _basepath = null;

function _getConfig() {
    return new Promise((resolve, reject) => {
        resolve(_getConfigSync());
    });
}

function _getConfigSync() {
    try {
        let data = fs.readFileSync(path.join(__dirname, "externalSignon.json"), { encoding: "utf-8" });
        return JSON.parse(data.toString('utf8'));
    } catch{
        return _baseConfig;
    }
}

function _authenticate(user, pass) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, "users.json"), (err, data) => {
            if (err) {
                resolve(false);
                return;
            }
            json = JSON.parse(data.toString('utf8'));
            json['users'].forEach(node => {
                if (node.user === user && node.pass === pass){
                    resolve(true);
                    return;
                }
            });
            resolve(false);
        });
    });
}

module.exports = {
    init: (config) => {
        _axios = config.axios;
        _ws = config.ws;
        _basepath = config.basepath;
    },

    autoCreateUser: () => {
        return _getConfigSync().autoCreateUser;
    },

    defaultRoles: () => {
        return _getConfigSync().defaultRoles;
    },

    fallbackToLocal: () => {
        return _getConfigSync().fallbackToLocal;
    },

    authenticate: (user, pass) => {
        return _authenticate(user, pass);
    },

    name: () => "externalSignonDraft",

    getConfig: () => {
        return new Promise(resolve => {
            _getConfig().then(conf => {
                resolve(conf);
            }).catch(e => {
                resolve(_baseConfig);
            });
        });
    },

    writeConfig: (config) => {
        fs.writeFile(path.join(__dirname, "externalSignon.json"), JSON.stringify(config), (err) => {
            if (err) {
                console.error("Store Config", err);
            }
        });
    },

    getHelp: () => {
        return '{\n' +
            '    autoCreateUser: true,\n' +
            '    defaultRoles: [ 0, 1 ],\n' +
            '    fallbackToLocal: true\n'
            '}'
    }
};
