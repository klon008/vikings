const colors = require('chalk')
const _ = require('lodash')
const request = require('request')
const im = require('imagemagick')
const fs = require('fs')
const path = require('path')
const outFilePug = "./src/pug_includes/_right_sidebar_users.pug"

let needUsers = 20
let needUsersStr = (needUsers > 1) ? '?results=' + needUsers : ''
console.log(needUsersStr)
const connectionConfig = {
    url: `https://randomuser.me/api${needUsersStr}`,
    headers: {
        'Connection': 'keep-alive',
        'Content-Type': 'application/json'
    }
}

function generateStatusIcon() {
    let result = ''
    let random_boolean = Math.random() >= 0.5;
    if (random_boolean) {
        let rand = Math.random() * 14 + 1;
        let unread_count_n = Math.floor(rand);
        let unread_count = `\.unread-count ${unread_count_n}`
        result += "\n\t" + unread_count
    }
    let statusicon = `\.status-icon`
    let randomStatus = Math.floor(Math.random() * 4)
    let status;
    switch (randomStatus) {
        case 0:
            status = `\.offline`
            break;
        case 1:
            status = `\.do-not-disturb`
            break;
        case 2:
            status = `\.online`
            break;
        case 3:
            status = `\.away`
            break;
    }
    statusicon += status
    result += "\n\t" + statusicon
    out = {text: result, status: status}
    return out;
}

function writeToOutFile(res) {
    console.log(outFilePug)
    if (res) {
        fs.writeFile(outFilePug, res, function (err) {
            if (err) {
                return console.log(colors.red(err));
            }
            console.log(colors.cyan(`html для файла ${outFilePug} сгенерирован!`));
        });
    }
}

async function generateUsers() {
    return new Promise(function (resolve, reject) {
        request(connectionConfig, (error, response, body) => {
            let users
            if (!error && response.statusCode === 200) {
                let resJson = JSON.parse(body)
                users = resJson
                let stringResult = ""
                for (let userJson of resJson['results']) {
                    let name = `${userJson['name']['first']} ${userJson['name']['last']}`
                    let picture = `${userJson["picture"]["large"]}`
                    let slimString = `
\.right-side-chat__user(data-toggle="tooltip" title="${name}" data-placement="left")
\timg(src='${picture}').right-side-chat__userpic`
                    let out = generateStatusIcon()
                    userJson['status'] = out.status
                    stringResult += slimString + out.text
                }
                writeToOutFile(stringResult)

            } else if (error) {
                console.log(colors.red(error))
            }
            resolve(users)
        });
    })
}

module.exports = generateUsers