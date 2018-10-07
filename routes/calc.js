const express = require('express');
const router = express.Router();

const operations = {
    add: (fst, snd) => fst + snd,
    sub: (fst, snd) => fst - snd,
    div: (fst, snd) => fst / snd,
    mul: (fst, snd) => fst * snd
};

function isNumeric(num){
    return !isNaN(num)
}

Object.keys(operations)
    .forEach(fn => {
        router.get(`/${fn}`, (req, res, next) => {
            const op = req.path.substring(1);
            const param1 = req.query.first;
            const param2 = req.query.second;

            if(typeof param1 === 'undefined' && typeof param2 === 'undefined') {
                res.status(400).json({message: 'Missing both parameters'});
                return;
            }

            if(typeof param1 === 'undefined') {
                res.status(400).json({message: 'Missing first required parameter'});
                return;
            }

            if(typeof param2 === 'undefined') {
                res.status(400).json({message: 'Missing second required parameter'});
                return;
            }

            if(!isNumeric(param1) && !isNumeric(param2)) {
                res.status(400).json({message: 'Both parameters are not numbers'});
                return;
            }

            if(!isNumeric(param1)) {
                res.status(400).json({message: 'The first parameter is not a number'});
                return;
            }

            if(!isNumeric(param2)) {
                res.status(400).json({message: 'The second parameter is not a number'});
                return;
            }

            const fst = parseFloat(param1);
            const snd = parseFloat(param2);

            if(op === 'div' && snd === 0) {
                res.status(400).json({message: 'Division by zero is not allowed'});
                return;
            }

            const result = operations[op](fst, snd);
            const resp = {
                result: result.toFixed(3)
            };
            res.json(resp);
        });
    });

module.exports = router;
