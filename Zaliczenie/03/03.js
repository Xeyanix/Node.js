
// Napisz program który wypisze szczegóły pliku z własnym kodem źródłowym.

// Wypisywane informacje:

// czas utworzenia
// czas modyfikacji
// rozmiar
// Program powinien działać poprawnie także po zmianie nazwy i lokalizacji pliku - bez zmiany kodu źródłowego!

// Przykłady wywołania
// > node app.js //wyświetla szczegóły pliku app.js
// po zmianie nazwy app.js na app2.js

// > node app2.js //wyświetla szczegóły pliku app2.js
// Podpowiedź: jest to możliwe przy użyciu wbudowanych modułów Node.js.

const fs = require("fs");

fs.stat("./03.js", function (err, stats) {

    //Checking for errors
    if (err) {
        console.log(err)
    }
    else {
        // console.log(stats)
        console.log("Modifed Time: " + stats.mtime)
        console.log("Birth Time: " + stats.birthtime)
        console.log("Size: " + stats.size)
    }
});

// --------------------------------------------------------

const fs = require('fs');

stats = fs.statSync("./03.js");

console.log("Modifed Time: " + stats.mtime)
console.log("Birth Time: " + stats.birthtime)
console.log("Size: " + stats.size)


