'use strict';

var got = require('got');
var registryUrl = require('registry-url');
var Promise = require('pinkie-promise');

function get(keyword, level) {
    if (typeof keyword !== 'string') {
        return Promise.reject(new TypeError('Keyword must be a string'));
    }

    keyword = encodeURIComponent(keyword);

    var url = "https://api.npms.io/v2/search?q=" + keyword;

    console.log('got('+url+')');
    return got(url, {json: true}).then(function (res) {
        console.log(res);
        return res.body.results;
    });
}

module.exports = function (keyword) {
    console.log('npmKeyword('+keyword+')');
    return get(keyword, 3).then(function (data) {
        console.log('get().then(data)');
        console.log(data);
        return data.map(function (el) {
            console.log('data.map(el)');
            console.log(el);
            return {
                name: el.package.name,
                description: el.package.description
            };
        });
    });
};

module.exports.names = function (keyword) {
    return get(keyword, 2).then(function (data) {
        return data.map(function (el) {
            return el.package.name;
        });
    });
};

module.exports.count = function (keyword) {
    return get(keyword, 1).then(function (data) {
        return data[0] ? data[0].value : 0;
    });
};
