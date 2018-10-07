const express = require('express');
const request = require('request');
const images = require('../images.json');

const baseApacheUrl = "http://localhost:80";


const router = express.Router();

/* GET home page. */
router.get('/vappu/gettime', function(req, res, next) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();

    let festival;

    if(currentMonth >= 5 && currentDay > 1) {
        festival = new Date(currentYear + 1, 4, 1);
    } else {
        festival = new Date(currentYear, 4, 1);
    }

    const secondsBetween = Math.ceil((festival - now) / 1000);

    const resp = {
        seconds: secondsBetween
    };

    res.json(resp);
});

router.get('/images', (req, res, next) => {
    let responses = [];
    [...images]
        .map(img => img.url)
        .forEach(url => {
            request
                .head(`${baseApacheUrl}${url}`)
                .on('response', (response) => {
                    const contentDisposition = response.headers['content-disposition'] || "filename=def.png";
                    const name = contentDisposition.match(/filename=(.+)/)[1];
                    const contentType = response.headers['content-type'] || "image/pngDef";
                    const type = contentType.split('/')[1].toUpperCase();
                    const size = `${parseFloat(response.headers['content-length']) / 1000} Kb`;
                    const obj = {name, type, size};
                    responses.push(obj);
                    if(responses.length === images.length) {
                        console.error("Responses length: ", responses.length);
                        console.error("Responses: ", responses);
                        res.json(responses);
                    }
                })
                .on("error", (err) => {
                    console.error(err);
                    res.sendStatus(500);
                })
        })
});

module.exports = router;
