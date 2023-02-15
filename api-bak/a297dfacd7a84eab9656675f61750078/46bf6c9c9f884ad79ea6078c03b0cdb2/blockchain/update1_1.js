/**
 *  Copyright 2023 Jing Yanming
 * 
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
"use strict";

var fabric = require('fabric');
var key = require('./key');

var channel = fabric.newChannel({
  name : 'ch0',
  peer : ['grpc://10.0.0.104:7051'],
  orderer : ['grpc://10.0.0.104:7050'],
  enrollment : {
    name : 'admin',
    mspid : 'Org1MSP',
    roles : [],
    affiliation : '',
    account : '',
    privateKey : key.user2.privateKey,
    certificate : key.user2.certificate,
  }
});

var queryResp = channel.queryByChaincode({
  chaincodeId : 'cc0',
  fcn : 'queryCar',
  args : ['CAR1'],
});

var tranResp = channel.sendTransactionProposal({
  chaincodeId : 'cc0',
  fcn : 'changeCarOwner',
  args : ['CAR1', "Yanming-1"],
});

var event = channel.sendTransaction(tranResp);

sys.addRetData("tranResp", reformatResponseArr(tranResp));
sys.addRetData('queryResp', reformatResponseArr(queryResp));
sys.addRetData('block0', channel.queryBlockByNumber(0));
sys.addRetData('blockchainInfo', channel.queryBlockchainInfo());
sys.setRetData(0, 'Do nothing.', "queryResp", "blockchainInfo", "block0", "tranResp");


function reformatResponseArr(arr) {
  for (var i=0; i<arr.length; ++i) {
    arr[i].payload = arr[i].payload.toString("utf8");
  }
  return arr;
}