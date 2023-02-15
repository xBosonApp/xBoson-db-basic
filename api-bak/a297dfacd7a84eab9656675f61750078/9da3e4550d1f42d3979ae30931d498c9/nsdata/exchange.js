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

var mapid = sys.request.getString('mapid', 1, 32);
var formatXml = true;

var mapper = getMapper(mapid);
  if (!mapper) return;
var cri = getCri(mapper.criid);
  if (!cri) return;
var remote = getRemote(mapper.rtid);
  if (!remote) return;

var daqtaskid_str = getCurrentTimeToID();
var totalcnt      = 0;
var begin_time    = Date.now();
var NULSTR        = '';

var ws       = require('ws');
var xml      = require('xml');
var stream   = require('streamutil');
var wsconn   = ws.connection(mapper.wsid);
var wsoutput = wsconn.connect();
var functag  = wsconn.buildFunctionCall();

var map_config = JSON.parse(mapper.map_json);

// 切换数据源, 并打开查询
sql.connection(mapper.source_did);
// 这里需要给 sql 提供一些参数 !!
var sqlstream = sql.queryStream(mapper.sql_str, []);
// !! 未完成, 值的字典映射
// k[字典id] : { k[数据库值]: v[最终值] }
var vdict_mapper = buildDictMapper();

// var xmlData = functag.tag('xmlData'); // 不确定有没有 !!
// var textWrite = xmlData.textWriter();
// functag.xml(''); // hack
var textWrite = functag.textWriter();
var innerXml = xml.build(textWrite, formatXml);
innerXml.writeHead();
// ------------------------------------------------------------------------------------------------
// 内部数据 xml, 缩进表示 xml 标签层级
var xmlns = 'http://www.neusoft.com/hit/rhin';
var messages = innerXml.tag('messages').attr('xmlns', xmlns);
  var heartbeat = messages.tag('heartbeat').text('0');

  var switchset = messages.tag('switchset');
    var authority = switchset.tag('authority');
      authority.tag('authoritytype').text(remote.authoritytype);
      authority.tag('username').text(remote.username);
      authority.tag('userpwd').text(remote.userpwd);
      authority.tag('license').text(remote.license);
    
    var visitor = switchset.tag('visitor');
      visitor.tag('sourceorgan').text(mapper.sourceorgan); 
      visitor.tag('sourcedomain').text(mapper.sourcedomain);
      
    var serviceinf = switchset.tag('serviceinf');
      serviceinf.tag('servicecode').text(mapper.servicecode);
      
    var provider = switchset.tag('provider');
      provider.tag('targetorgan').text(mapper.targetorgan);
      provider.tag('targetdomain').text(mapper.targetdomain);
      
    var route = switchset.tag('route');
    if (mapper.route) route.text(mapper.route)
    var process = switchset.tag('process');
    if (mapper.process) process.text(mapper.process);
    
  var business = messages.tag('business');
    var standardcode = business.tag('standardcode').text(cri.standardcode);
    var requestset = business.tag('requestset');
      requestset.tag('reqcondition');
      requestset.tag('reqpaging').text('0');
      requestset.tag('reqpageindex').text('-1');
      requestset.tag('reqpageset').text('0');
    
    var datacompress = business.tag('datacompress').text('1');
    var daqtaskid = business.tag('daqtaskid').text(daqtaskid_str);
    var businessdata = business.tag('businessdata');
    businessdata.xml(''); // hack: xml 闭合标签
    
      var b64 = stream.openBase64OutputStream(textWrite);
      var gzip = stream.openGzipOutputStream(b64);
      var dataXml = xml.build(gzip, formatXml);
      // ==============================================================================
      // 数据 xml
      var dmp = dataXml.tag('dmp');
      var datasets = dmp.tag('datasets');
        datasets.tag('setcode').text(cri.setcode);
        datasets.tag('settype');
      
      while (sqlstream.hasNext()) {
        var row = sqlstream.next();
        var setdetails = datasets.tag('setdetails');
        
        for (var outname in map_config) {
          var mc    = map_config[outname];
          var tname = mc.dbfield;
          var v     = row[tname];
          if (mc.usedict) {
            v = vdict_mapper[mc.typecd][v] || mc.default || v;
          }
          setdetails.tag(outname).text(v || NULSTR);
        }
        // console.log(totalcnt)
        ++totalcnt;
      }
      sqlstream.close()
      // ==============================================================================
      dataXml.end();
      gzip.flush();
      gzip.finish();
      b64.flush();
// ------------------------------------------------------------------------------------------------
innerXml.end();
textWrite.flush();
wsconn.end();

var input  = wsconn.openInput();
var outXml = xml.parse(input);
var rcode  = getDataFromPath(outXml, 'Envelope Body messages switchset switchmessage messagecode');
var rmsg;

if (parseInt(rcode && rcode.text) == -1) {
  rmsg  = getDataFromPath(outXml, 'Envelope Body messages switchset switchmessage messagetext');
} else {
  rcode = getDataFromPath(outXml, 'Envelope Body messages business returnmessage retcode');
  rmsg  = getDataFromPath(outXml, 'Envelope Body messages business returnmessage rettext');
}
rcode = parseInt(rcode && rcode.text) || 999;
rmsg  = (rmsg && rmsg.text)+'';

input.close();
sql.connection();
// 写日志
var bindp = [mapper.mapid, daqtaskid_str, rcode, rmsg, totalcnt, Date.now()-begin_time];
sql.update(`Insert Into ns_ex_req_log (
    logid, createdt, updatedt, mapid, daqtaskid, reqcode, reqmsg, totalcnt, use_time) 
    Values (uuid_short(), now(), now(), ?,?,?,?,?,?)`, bindp);

sys.addRetData(outXml, 'outputXml');
sys.setRetData(rcode || 1, rmsg, outXml);


function getDataFromPath(root, path) {
  var tag = root;
  path = path.split(' ');
  
  if (tag.name == path[0]) {
    var find = false;
    var arr  = tag.childrenNode;
    
    for (var i=1; i<path.length; ++i) {
      find = false;
      
      for (var t=0; t<arr.length; ++t) {
        if (path[i] == arr[t].name) {
          tag = arr[t];
          arr = tag.childrenNode;
          find = true;
          break;
        }
      }
      if (!find)return null;
    }
    return tag;
  }
  return null;
}


function getMapper(mapid) {
  sql.query('Select * From ns_ex_mapper Where mapid = ?', [mapid], 'mp');
  var mapper = sys.result.mp[0];
  if (!mapper) {
    sys.setRetData(1, '找不到映射: '+ mapid);
    return;
  }
  if (!mapper.status) {
    sys.setRetData(1, '映射被禁用: '+ mapid);
    return;
  }
  return mapper;
}


function getCri(criid) {
  sql.query('Select * From ns_ex_cri Where criid = ?', [criid], 'cri');
  var cri = sys.result.cri[0];
  if (!cri) {
    sys.setRetData(1, '找不到交换标准: '+ criid);
    return;
  }
  return cri;
}


function getRemote(rtid) {
  sql.query('Select * From ns_ex_remote Where rtid = ?', [rtid], 'rt');
  var remote = sys.result.rt[0];
  if (!remote) {
    sys.setRetData(1, '找不到远程配置: '+ rtid);
    return;
  }
  return remote;
}


function getCurrentTimeToID() {
  var d = new Date();
  return [ d.getFullYear(),    a2(d.getMonth()+1), a2(d.getDate()),
           a2(d.getHours()),   a2(d.getMinutes()), 
           a2(d.getSeconds()), a3(d.getMilliseconds())].join('');
  
  function a2(a) {
    if (a < 10) return '0'+a;
    return a+'';
  }
  
  function a3(a) {
    if (a < 10) return '00'+a;
    if (a < 100) return '0'+a;
    return a+'';
  }
}


function buildDictMapper() {
  var dict = {};
  for (var k in map_config) {
    var cf = map_config[k];
    if (cf.usedict) {
      dict[cf.typecd] = buildDict(cf.typecd);
    }
  }
  return dict;
}


function buildDict(typecd) {
  var map = {};
  var s = 'Select dictcd, dictnm From sys_mdm002 Where typecd = ?';
  sql.query(s, [typecd]);
  var r = sys.result.result;
  
  for (var i=0; i<r.length; ++i) {
    map[r.dictcd] = r.dictnm;
  }
  return map;
}