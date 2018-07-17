'use strict';

var got = require('got');
var registryUrl = require('registry-url');
var Promise = require('pinkie-promise');

function get(keyword, level) {
    if (typeof keyword !== 'string') {
        return Promise.reject(new TypeError('Keyword must be a string'));
    }

    keyword = encodeURIComponent(keyword);

    var url = "https://api.npms.io/v2/search?q=keywords:" + keyword;

    return got(url, {json: true}).then(function (res) {
        return res.body.results;
    });
}

module.exports = function (keyword) {
    return get(keyword, 3).then(function (data) {
        return data.map(function (el) {
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
