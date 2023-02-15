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

var config = require("config");
var crypto = require('crypto');
var pp = "xboson:";

// state 参数有效时间
var STATE_TIMEOUT = 3 * 60e3;


if (config.get("wx-login") == null) {
  config.create({
    'mode': config.MODE_ORG,
    'name': "wx-login",
    'desc': "微信QR登录配置",
    'create_time': new Date(),
  });
}


config.putTemplate("wx-login", {
  'appid'             : config.TYPE_STRING,
  'appsecret'         : config.TYPE_STRING,
  'redirect_uri'      : config.TYPE_STRING,
  'mongodb'           : config.TYPE_STRING,
  'dbname'            : config.TYPE_STRING,
  'roles'             : config.TYPE_STRING,
  'orgid'             : config.TYPE_STRING,
  'project_ugid'      : config.TYPE_STRING,
  'redirect_bind_uri' : config.TYPE_STRING,
});


config.setDesc("wx-login", {
  'appid'             : '微信应用 ID',
  'appsecret'         : '微信密钥',
  'redirect_uri'      : '登录/注册回调页面地址 URL',
  'mongodb'           : 'Mongo 数据库连接 URL',
  'dbname'            : 'Mongo 数据库名称',
  'roles'             : '新建用户组 ID 列表,逗号分隔',
  'orgid'             : '新建用户默认机构 ID',
  'project_ugid'      : '默认项目组 ID',
  'redirect_bind_uri' : '绑定用户回调页面地址 URL',
});


module.exports = {
  genState          : genState,
  checkState        : checkState,
  qrUrl             : qrUrl,
  bindQrUrl         : bindQrUrl,
  openTable         : openTable,
  access_token_url  : access_token_url,
  access_token_parm : access_token_parm,
  user_info_url     : user_info_url,
  user_info_parm    : user_info_parm,
  getUser           : getUser,
  saveUser          : saveUser,
  updateUser        : updateUser,
  deleteUser        : deleteUser,
  roles             : roles,
  orgid             : orgid,
  projectGroupid    : projectGroupid,
  encrypt           : encrypt,
  decode            : decode,
};


function roles() {
  var r = getConfig().roles;
  if (!r) throw new Error("配置 roles 无效");
  r = r.split(',');
  if (r.length < 1) throw new Error("至少需要一个角色组");
  return r;
}


function orgid() {
  var ret = getConfig().orgid
  if (!ret) {
    throw new Error("配置 orgid 无效");
  }
  return ret;
}


function projectGroupid() {
  return getConfig().project_ugid;
}


function getUser(openid) {
  var t = openTable("user_mapper");
  var d = t.find({ _id : openid });
  if (d.length < 1) return null;
  d = d[0];
  d.getToken = function() {
    return decode(d.token);
  };
  d.getInfo = function() {
    return decode(d.info);
  };
  return d;
}


function saveUser(openid, token, info) {
  var t = openTable("user_mapper");
  t.insertOne({
    _id   : openid,
    token : encrypt(token),
    info  : encrypt(info),
  });
}


function updateUser(openid, token, info) {
  var t = openTable("user_mapper");
  t.updateOne({ _id: openid }, {
    $set: {
      token : encrypt(token),
      info  : encrypt(info),
    },
  });
}


function deleteUser(openid) {
  var t = openTable("user_mapper");
  t.deleteOne({ _id: openid });
}


function encrypt(data) {
  var cfg = getConfig();
  var cc = crypto.createCipher("AES", pp + cfg.appsecret);
  var cdata = cc.update(JSON.stringify(data)).concat(cc.end());
  return cdata.toString();
}


function decode(b64) {
  var cfg = getConfig();
  var buf = crypto.toBytes(b64, 'base64url');
  var cd = crypto.createDecipher("AES", pp + cfg.appsecret);
  var data = cd.update(buf).concat(cd.end());
  return JSON.parse(data.toJavaString());
}


function genState(sys) {
  var cfg = getConfig();
  return sys.encrypt(pp + sys.randomString(16) +':'+ Date.now(), cfg.appsecret);
}


function checkState(sys, state) {
  var cfg = getConfig();
  var msg = sys.decrypt(state, cfg.appsecret);
  if (! msg.startsWith(pp)) {
    throw new Error("state 错误");
  }
  
  var d = msg.split(":");
  d = parseInt(d[d.length-1]);
  if (Date.now() - d > STATE_TIMEOUT) {
    throw new Error("state 已经超时, 请重新登录");
  }
}


function qrUrl(sys) {
  var cfg = getConfig();
  return [
    "https://open.weixin.qq.com/connect/qrconnect?appid=", cfg.appid,
    "&redirect_uri=", encodeURIComponent(cfg.redirect_uri),
    "&response_type=code&scope=snsapi_login&state=",
    encodeURIComponent(genState(sys)),
    "#wechat_redirect",
  ].join('');
}


function bindQrUrl(state) {
  var cfg = getConfig();
  return [
    "https://open.weixin.qq.com/connect/qrconnect?appid=", cfg.appid,
    "&redirect_uri=", encodeURIComponent(cfg.redirect_bind_uri),
    "&response_type=code&scope=snsapi_login&state=",
    encodeURIComponent(state),
    "&self_redirect=true",
    "#wechat_redirect",
  ].join('');
}


function access_token_url() {
  return 'https://api.weixin.qq.com/sns/oauth2/access_token';
}


function access_token_parm(code) {
  var cfg = getConfig();
  return {
    appid       : cfg.appid,
    secret      : cfg.appsecret,
    code        : code,
    grant_type  : 'authorization_code',
  };
}


function user_info_url() {
  return 'https://api.weixin.qq.com/sns/userinfo';
}


function user_info_parm(access_token, openid) {
  return {
    access_token : access_token,
    openid : openid,
  };
}


function openTable(tableName) {
  var cfg = getConfig();
  var mongodb = require('mongodb');
  var client  = mongodb.connect(cfg.mongodb);
  return client.db(cfg.dbname).collection(tableName);
}


function getConfig() {
  var cfg = config.get("wx-login");
  if (!cfg) {
    throw "'wx-login' 配置文件不存在";
  }
  return cfg;
}