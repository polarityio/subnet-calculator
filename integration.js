/*
 * Copyright (c) 2023, Polarity.io, Inc.
 */

'use strict';

const ip = require('ip');

let Logger;

function computeWildcardMaskFromSubnetMask(subnet) {
  const subnetMask = ip.toLong(subnet);
  const wildcardMask = ~subnetMask;
  return ip.fromLong(wildcardMask);
}

function doLookup(entities, options, cb) {
  const lookupResults = [];
  Logger.trace({ entities }, 'doLookup');

  entities.forEach((entity) => {
    let ipAttributes = ip.cidrSubnet(entity.value);
    lookupResults.push({
      entity,
      data: {
        summary: [`${ipAttributes.firstAddress} - ${ipAttributes.lastAddress}`],
        details: {
          ...ipAttributes,
          wildcardMask: computeWildcardMaskFromSubnetMask(ipAttributes.subnetMask)
        }
      }
    });
  });

  Logger.trace({ lookupResults }, 'doLookup Results');
  cb(null, lookupResults);
}

function startup(logger) {
  Logger = logger;
}

module.exports = {
  doLookup,
  startup
};
