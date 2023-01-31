//KOd wywołania: node 02.js text 
const colors = require('colors');

const name = process.argv[2];

let Message;

if (process.argv.length < 3) {
    console.log('zbyt mało parametrów!');
} else if (process.argv.length > 3) {
    console.log('zbyt dużo parametrów!');
} else {
    Message = name;
    console.log(colors.rainbow(Message));
}


