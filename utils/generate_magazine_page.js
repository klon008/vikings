const servicesFolder = './src/img/services/';
const colors = require('chalk');
const im = require('imagemagick');
const fs = require('fs');
const path = require('path');
const _ = require('lodash')
const outFile = "./src/pug_includes/_services_items.pug"
const template = require('./replace_template')

const tmpl_pattern = `
\.card
    img.card-img-top(src=require('../img/services/%cWidth%/%cWidth%x-%file%') alt='%fileNameWithoutExtention%')
    .card-body
        .card-title Card title
        .card-text Update! Experience the fury of Kingdoms Fight t...
        .card-footer
            span.card-footer__nickname
                i.status-icon%status%
                span.status-name %USERNAME%
            span.cart-footer__right
                i.%staricon%.star
                span.orange %star%
                span (%order%)`;

const img_options = {
    width: 480,
    height: 330
}

function runModule(users) {
    fs.readdir(servicesFolder, (err, files) => {

        let result = []
        if (img_options.width) {
            let cWidth = img_options.width
            let cHeight = (img_options.height) ? img_options.height : cWidth
            let outDir = path.resolve(servicesFolder, cWidth.toString())

            if (!fs.existsSync(outDir)) {
                fs.mkdirSync(outDir);
            }
            for (let file of files) {
                let fileNameWithoutExtention = file.replace(/\.[^/.]+$/, "")
                let slimString = ''
                user = _.sample(users['results'])
                
                if (tmpl_pattern) {
                    let star = _.random(1,5);
                    let staricon = 'icon-star_outline';
                    if (star>=(5/2)) staricon='icon-star'
                    else if(star>1) staricon='icon-star_half'
                    slimString = template(tmpl_pattern, {
                        cWidth: cWidth,
                        file: file,
                        fileNameWithoutExtention: fileNameWithoutExtention,
                        USERNAME: `${user['name']['first']} ${user['name']['last']}`,
                        star: star,
                        staricon: staricon,
                        order: _.random(200),
                        status: user['status']
                    })
                } else { throw new Error(`нет шаблона для ${file}`)}
                let pathToFile = path.resolve(servicesFolder, file);
                try {
                    var stats = fs.statSync(pathToFile);
                    if (stats.isDirectory()) {
                        console.log(colors.gray(`${file} не является файлом`))
                    }
                    if (stats.isFile()) {
                        result.push(slimString);

                        im.resize({
                            srcData: fs.readFileSync(pathToFile, 'binary'),
                            width: cWidth,
                            height: cHeight

                        }, function (err, stdout, stderr) {
                            let outDir = path.resolve(servicesFolder, cWidth.toString())
                            let rt = path.resolve(outDir, `${cWidth}x-${file}`)
                            if (err) throw err
                            fs.writeFileSync(rt, stdout, 'binary');
                            console.log(colors.cyan(`Изображение ${file} сжато до ${cWidth}px`));
                        });
                    }
                } catch (err) {
                    throw new Error(err)
                }
            }
            if (result) {
                let res = result.join("");
                res = res.substr(1);
                fs.writeFile(outFile, res, function (err) {
                    if (err) {
                        return console.log(colors.red(err));
                    }

                    console.log(colors.cyan("html для Товаров сгенерирован!"));
                });
            }
        }

    });
}
module.exports = runModule