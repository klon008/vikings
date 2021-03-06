const fs = require('fs')
const svgexport = require('svgexport')
const regexSVG = new RegExp(/\S+(\.svg)$/i)

function runModule(){
fs.readdir('./src/img/icons/', (err, files) => {
    for (file of files) {
        let matches = file.match(regexSVG)
        if (matches && matches.length == 2) {
            let justname = file.replace(matches[1], '')
            let datafile = {
                input: `./src/img/icons/${justname}.svg`,
                output: `./src/img/icons/${justname}.png`
            }
            svgexport.render(datafile, function (err, stdout, stderr) {
                if (err) throw err;
                console.log(`${justname}.svg скомпилирован в ${justname}.png`);
            });
        }
    }
})
}
module.exports = runModule