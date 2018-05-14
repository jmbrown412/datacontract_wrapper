'use strict';
var express = require('express');
var router = express.Router();

const path = require('path');
const artifacts = require(path.resolve(__dirname, "../contracts/DataRecords.json"));
const contract = require('truffle-contract');
const Web3 = require('web3');
const url = require("url");
let dataContract = contract(artifacts);
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
dataContract.setProvider(web3.currentProvider);

router.get("/",
    async function (req, res) {
        var parts = url.parse(req.url, true);
        var query = parts.query;
        let key = query.key;
        let index = parseInt(query.index);
        await dataContract.deployed().then(function (instance) {
            return instance.GetRecord(key, index);
        }).then(function (result) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        }).catch(function (err) {
            console.log(err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(err));
        });
    });

router.post("/",
    async function (req, res) {
        var json = req.body;
        let key = json.key;
        let name = json.name;
        let description = json.description;
        await dataContract.deployed().then(function (instance) {
            return instance.StoreRecord(key, name, description, { from: web3.eth.accounts[0], gas:100000 });
        }).then(function (result) {
            console.log(result);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        }).catch(function (err) {
            console.log(err.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(err.message));
        });
    });

module.exports = router;
