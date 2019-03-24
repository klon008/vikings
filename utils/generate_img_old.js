const resourcesFolder = './src/img/resources/';
const usersFolder = './src/img/users/';
const servicesFolder = './src/img/services/';
const colors = require('chalk');
const im = require('imagemagick');
const fs = require('fs');
const path = require('path');
let names = []

const result_file = "./src/pug_includes/_sidebar_resources.pug"
const right_sidebar_users_template = "./src/pug_includes/_right_sidebar_users.pug"
const services_carousel_template = "./src/pug_includes/_services_carousel.pug"
const services_magazine_item_template = "./src/pug_includes/_services_items.pug"
console.log(`Generate ${result_file}`.bgYellow);

function optimazeResources() {
    fs.readdir(resourcesFolder, (err, files) => {
        files.forEach(file => {
            let fileNameWithoutExtention = file.replace(/\.[^/.]+$/, "")
            let color = "#e4a62b"
            let slimString = `
div(data-toggle="tooltip" title="${fileNameWithoutExtention}").resources-grid__item
    img(src=require("../img/resources/${file}")).resources-grid__img
    div.resources-grid__title(style="color:${color}") 7.78(b)
`
            names.push(slimString);
        });
        let res = names.join("");
        fs.writeFile(result_file, res, function (err) {
            if (err) {
                return console.log(colors.red(err));
            }

            console.log(colors.cyan("html для картинок-ресурсов сгенерирован!"));
        });
    });
};
optimazeResources()

function optimizeUsers() {
    fs.readdir(usersFolder, (err, files) => {

        let resultet_string_to_pug = []
        let neededWidth = 128;

        let direcroryWidthPath = path.resolve(usersFolder, neededWidth.toString())
        console.log(colors.red(direcroryWidthPath))


        if (!fs.existsSync(direcroryWidthPath)) {
            fs.mkdirSync(direcroryWidthPath);
        }

        for (let file of files) {
            let fileNameWithoutExtention = file.replace(/\.[^/.]+$/, "")
            let slimString = `
\.right-side-chat__user(data-toggle="tooltip" title="Твой друг" data-placement="left")
\timg(srcSet=require('../img/users/${neededWidth}/${neededWidth}x-${file}')).right-side-chat__userpic`
            let random_boolean = Math.random() >= 0.5;
            if (random_boolean) {
                let rand = Math.random() * 14 + 1;
                let unread_count_n = Math.floor(rand);
                let unread_count = `\.unread-count ${unread_count_n}`
                slimString = slimString + "\n\t" + unread_count
            }
            let statusicon = `\.status-icon`
            let randomStatus = Math.floor(Math.random() * 4)
            switch (randomStatus) {
                case 0:
                    statusicon += `\.offline`
                    break;
                case 1:
                    statusicon += `\.do-not-disturb`
                    break;
                case 2:
                    statusicon += `\.online`
                    break;
                case 3:
                    statusicon += `\.away`
                    break;
            }
            slimString = slimString + "\n\t" + statusicon

            let pathToFile = path.resolve(usersFolder, file);
            try {
                var stats = fs.statSync(pathToFile);
                if (stats.isDirectory()) {
                    console.log(colors.gray(`${file} не является файлом`))
                }
                if (stats.isFile()) {
                    resultet_string_to_pug.push(slimString);
                    im.resize({
                        srcData: fs.readFileSync(pathToFile, 'binary'),
                        width: neededWidth

                    }, function (err, stdout, stderr) {
                        let direcroryWidthPath = path.resolve(usersFolder, neededWidth.toString())
                        let rt = path.resolve(direcroryWidthPath, `${neededWidth}x-${file}`)
                        if (err) throw err
                        fs.writeFileSync(rt, stdout, 'binary');
                        console.log(colors.cyan(`Изображение ${file} сжато до ${neededWidth}px`));
                    });
                }
            } catch (err) {
                console.log(colors.red(err));
            }
        }
        let res = resultet_string_to_pug.join("");
        res = res.substr(1);
        fs.writeFile(right_sidebar_users_template, res, function (err) {
            if (err) {
                return console.log(colors.red(err));
            }

            console.log(colors.cyan("html для картинок-пользователей сгенерирован!"));
        });
    });
};
//optimizeUsers()

const w120slimString = `
\.carousel-item
    img(src=require('../img/services/%cWidth%/%cWidth%x-%file%') alt='%fileNameWithoutExtention%')`;

const w480slimString = `
\.card
    img.card-img-top(src=require('../img/services/%cWidth%/%cWidth%x-%file%') alt='%fileNameWithoutExtention%')
    .card-body
        .card-title Card title
        .card-text Update! Experience the fury of Kingdoms Fight t...`;

function optimizeServices(inSizes = [{
    width: 120,
    sString: w120slimString
}]) {
    fs.readdir(servicesFolder, (err, files) => {
        
        for (let cSize of inSizes) {
            let resultet_string_to_pug = []
            if (cSize.width) {
                let cWidth = cSize.width
                let cHeight = (cSize.height) ? cSize.height : cWidth
                let direcroryWidthPath = path.resolve(servicesFolder, cWidth.toString())

                if (!fs.existsSync(direcroryWidthPath)) {
                    fs.mkdirSync(direcroryWidthPath);
                }
                for (let file of files) {
                    let fileNameWithoutExtention = file.replace(/\.[^/.]+$/, "")
                    let slimString = ''
                    if (cSize.sString) {
                        slimString = template(cSize.sString, {cWidth: cWidth, file: file, fileNameWithoutExtention: fileNameWithoutExtention})
                    }
                    let pathToFile = path.resolve(servicesFolder, file);
                    try {
                        var stats = fs.statSync(pathToFile);
                        if (stats.isDirectory()) {
                            console.log(colors.gray(`${file} не является файлом`))
                        }
                        if (stats.isFile()) {
                            resultet_string_to_pug.push(slimString);

                            im.resize({
                                srcData: fs.readFileSync(pathToFile, 'binary'),
                                width: cWidth,
                                height: cHeight

                            }, function (err, stdout, stderr) {
                                let direcroryWidthPath = path.resolve(servicesFolder, cWidth.toString())
                                let rt = path.resolve(direcroryWidthPath, `${cWidth}x-${file}`)
                                if (err) throw err
                                fs.writeFileSync(rt, stdout, 'binary');
                                console.log(colors.cyan(`Изображение ${file} сжато до ${cWidth}px`));
                            });
                        }
                    } catch (err) {
                        console.log(colors.red(err));
                    }
                }
                if (cSize.pth) {
                    let res = resultet_string_to_pug.join("");
                    res = res.substr(1);
                    fs.writeFile(cSize.pth, res, function (err) {
                        if (err) {
                            return console.log(colors.red(err));
                        }

                        console.log(colors.cyan("html для картинок-пользователей сгенерирован!"));
                    });
                }
            }
        }
    });
}
optimizeServices([{
    width: 120,
    sString: w120slimString,
    pth: services_carousel_template
}, {
    width: 480,
    height: 330,
    sString: w480slimString,
    pth: services_magazine_item_template
}]);

