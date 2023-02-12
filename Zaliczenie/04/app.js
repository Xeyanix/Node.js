// [5 punktów] Napisz aplikację która odczyta z pliku data.json liczbę oraz nazwę pliku, a następnie:

// pobierze z API informacje o danej liczbie (http://numbersapi.com/{number}, np http://numbersapi.com/42)
// informacje pobrane z API zapisze w pliku o pobranej wcześniej nazwie
// Przykład pliku: data.json

// {
//     "number": "588",
//     "filename": "file.json"
// }
// Pamiętaj o obsłudze błędów. Żądania do API oraz zapis do pliku wykonuj asynchronicznie.

const fs = require('fs');
const axios = require('axios');
const { writeFile } = require('fs').promises;

let data = fs.readFileSync("./data.json", (err, data) => {
    if (err) {
        console.log(err);
    }
})

let readData = JSON.parse(data);
let readThatNumber = readData.number;
let readFileName = readData.filename;

const getInfo = async (readThatNumber) => {
    const url = `http://numbersapi.com/${readThatNumber}`

    return axios.get(url)
        .then(response => response.data)
        .catch((error) => {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
        })
}

const saveFile = async (readFileName, data) => {
    return writeFile(readFileName, data)
        .then(() => console.log('file saved'));
}


(async () => {
    try {
        const data = await getInfo(readThatNumber);
        console.log(data);

        await saveFile(`${readFileName}`, data);

    } catch (error) {
        console.log(error);
    }
})()