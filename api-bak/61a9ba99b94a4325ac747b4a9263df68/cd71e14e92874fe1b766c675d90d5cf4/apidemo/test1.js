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

var year = 2021;
var month = 5;
var day = 31;
var tid = 1;
var hour = 10;
var min = 1;
var sec = 1;

var mongodb = require('mongodb');
var client = mongodb.connect("mongodb://mongo-x");

var coll = client.db('tasc_eth_data_'+ year).collection('m'+ month +'d'+ day);
var r = coll.find({
  _id : 'h'+ hour +'m'+ min +'s'+ sec +'t'+ tid,
})

if (r && r[0]) {
  var v = r[0].val;
  
  sys.put('data', {
    '列车号': v[2],
    '网压' : v[688], // HMLineVoltageU16rx
    '速度' : v[1106], // HMTrainSpeedU16rx
    '运行模式' : v[669], // HMRumModeU8rx
  //'站点信息'
    '当前站' : v[658], // HMCSCodeU16rx
    '终点站' : v[659], // HMDSCodeU16rx
    '起始站' : v[660], // HMSSCodeU16rx
    '下一站' : v[661], // HMNSCodeU16rx
  //'客流量信息'
    'TC1乘车率' : v[1111], // HMBCTc1LoadPercU8rx
    'M1乘车率' : v[1112], // HMBCM1LoadPercU8rx
    'M2乘车率' : v[1113], // HMBCM2LoadPercU8rx
    'M3乘车率' : v[1114], // HMBCM3LoadPercU8rx
    'M4乘车率' : v[1115], // HMBCM4LoadPercU8rx
    'TC2乘车率' : v[1116], // HMBCTc2LoadPercU8rx
  // OBC状态
    'TC1车ATO通信中断' : v[7054], // HMTc1ATOOfflineB1rx
    'TC2车ATO通信中断' : v[7055], // HMTc2ATOOfflineB1rx
  });
  
  sys.setRetData(0, 'ok');
} else {
  sys.setRetData(1, '没有数据');
}