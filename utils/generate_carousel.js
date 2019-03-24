const colors = require('chalk')
const _ = require('lodash')
const request = require('request')
const im = require('imagemagick')
const fs = require('fs')
const path = require('path')
const template = require('./replace_template')

const tmpl_pattern = `
\.carousel-item
    img(src=require('../img/services/%width%/%width%x-%file%') alt='%fileNameWithoutExtention%')`;

function logmenow(
    outFilePug = "./src/pug_includes/_services_carousel.pug",
    imgTargetFolder = './src/img/services/',
    width = 120) {
    let result = []
    fs.readdir(imgTargetFolder, (err, files) => {

        let outDir = path.resolve(imgTargetFolder, width.toString())
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir);
        }
        for (let file of files) {
            let fileNameWithoutExtention = file.replace(/\.[^/.]+$/, "")
            let slimString = ''
            if (tmpl_pattern) {
                slimString = template(tmpl_pattern, {
                    width: width,
                    file: file,
                    fileNameWithoutExtention: fileNameWithoutExtention
                })
            } else {
                console.error(`нет шаблона для файла ${file}`)
            }
            let pathToFile = path.resolve(imgTargetFolder, file);
            try {
                var stats = fs.statSync(pathToFile);
                if (stats.isDirectory()) {
                    console.log(colors.gray(`${file} не является файлом`))
                }
                if (stats.isFile()) {
                    result.push(slimString);

                    im.resize({
                        srcData: fs.readFileSync(pathToFile, 'binary'),
                        width: width

                    }, (err, stdout, stderr)=> {
                        let newNameFile = path.resolve(outDir, `${width}x-${file}`)
                        if (err) throw err
                        fs.writeFileSync(newNameFile, stdout, 'binary');
                        console.log(colors.cyan(`Изображение ${file} сжато до ${width}px`));
                    });
                }
            } catch (err) {
                console.log(colors.red(err));
            }

        }
        if (outFilePug) {
            let res = result.join("");
            res = res.substr(1);
            fs.writeFile(outFilePug, res, function (err) {
                if (err) {
                    return console.log(colors.red(err));
                }

                console.log(colors.cyan("html для карусели сгенерирован!\nПодробности в " + outFilePug));
            });
        }
    })
}

module.exports = logmenow