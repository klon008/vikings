const generateCarousel = require('./generate_carousel')
const generatePNGfromSVG = require('./generatesvgtopng')
const generateUsers = require('./generate_users')
const generateMagazine = require('./generate_magazine_page')
var childProcess = require('child_process');


generateCarousel();

new Promise((resolve,r)=>{
    console.log('начинаю работу по генерации случайных пользователей')
    let users = generateUsers()
    resolve(users)
}).then(users=>{
    console.log('начинаю работу по генерации товаров магазина')
    generateMagazine(users)
}).then(resolved=>{
    console.log('начинаю работу по конвертации SVG в Иконочный шрифт')
    runScript(icontGenerator,args, (err)=> {
        if (err) throw err;
        console.log('finished running some-script.js')
    })
}).then(resolved=>{
    console.log('начинаю работу по конвертации SVG в PNG')
    generatePNGfromSVG()
})


function runScript(scriptPath, args, callback) {

    var invoked = false;
    var process = childProcess.fork(scriptPath, args);

    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });

}
const icontGenerator = './node_modules/icon-font-generator/bin/icon-font-generator'
args = ['./src/img/icons/*.svg', '-o', './src/img/icons']

