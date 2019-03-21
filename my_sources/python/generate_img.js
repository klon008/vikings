const resourcesFolder = './src/img/resources/';
const usersFolder = './src/img/users/';
const colors = require('chalk');
const im = require('imagemagick');
const fs = require('fs');
const path = require('path');
let names = []

const result_file = "./src/pug_includes/_sidebar_resources.pug"
const right_sidebar_users_template = "./src/pug_includes/_right_sidebar_users.pug"
console.log(`Generate ${result_file}`.bgYellow);

fs.readdir(resourcesFolder, (err, files) => {
    files.forEach(file => {
        let r = file.replace(/\.[^/.]+$/, "")
        let color = "#e4a62b"
        let ss = `
div(data-toggle="tooltip" title="${r}").resources-grid__item
    img(src=require("../img/resources/${file}")).resources-grid__img
    div.resources-grid__title(style="color:${color}") 7.78(b)
`
        names.push(ss);
    });
    let res = names.join("");
    fs.writeFile(result_file, res, function (err) {
        if (err) {
            return console.log(colors.red(err));
        }

        console.log(colors.cyan("html для картинок-ресурсов сгенерирован!"));
    });
});

fs.readdir(usersFolder, (err, files) => {

    let users = []
    let neededWidth = 128;

    let rr = path.resolve(usersFolder, neededWidth.toString())
    console.log(colors.red(rr))


    if (!fs.existsSync(rr)) {
        fs.mkdirSync(rr);
    }

    for (let file of files) {
        let r = file.replace(/\.[^/.]+$/, "")
        let ss = `
\.right-side-chat__user(data-toggle="tooltip" title="Твой друг" data-placement="left")
\timg(srcSet=require('../img/users/${neededWidth}/${neededWidth}x-${file}')).right-side-chat__userpic`
        let random_boolean = Math.random() >= 0.5;
        if (random_boolean) {
            let rand = Math.random() * 14 + 1;
            let unread_count_n = Math.floor(rand);
            let unread_count = `\.unread-count ${unread_count_n}`
            ss = ss + "\n\t" + unread_count
        }
        let statusicon = `\.status-icon`
        let randomStatus = Math.floor(Math.random() * 4)
        switch (randomStatus){
            case 0:
                statusicon+=`\.offline`
                break;
            case 1:
                statusicon+=`\.do-not-disturb`
                break;
            case 2:
                statusicon+=`\.online`
                break;
            case 3:
                statusicon+=`\.away`
                break;
        }
        ss = ss + "\n\t" + statusicon

        let pathToFile = path.resolve(usersFolder, file);
        try {
            var stats = fs.statSync(pathToFile);
            if (stats.isDirectory()) {
                console.log(colors.gray(`${file} не является файлом`))
            }
            if (stats.isFile()) {
                users.push(ss);
                im.resize({
                    srcData: fs.readFileSync(pathToFile, 'binary'),
                    width: neededWidth

                }, function (err, stdout, stderr) {
                    let rr = path.resolve(usersFolder, neededWidth.toString())
                    let rt = path.resolve(rr, `${neededWidth}x-${file}`)
                    if (err) throw err
                    fs.writeFileSync(rt, stdout, 'binary');
                    console.log(colors.cyan(`Изображение ${file} сжато до ${neededWidth}px`));
                });
            }
        } catch (err) {
            console.log(colors.red(err));
        }
    }
    let res = users.join("");
    res = res.substr(1);
    fs.writeFile(right_sidebar_users_template, res, function (err) {
        if (err) {
            return console.log(colors.red(err));
        }

        console.log(colors.cyan("html для картинок-пользователей сгенерирован!"));
    });
});