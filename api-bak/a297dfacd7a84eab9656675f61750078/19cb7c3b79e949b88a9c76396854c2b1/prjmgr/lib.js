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

var mongodb = require('mongodb');
var cfg = require("config");
var uuid = require("uuid");
var plib = require("path");

var conf_name = "code-less-projects";
var defdbname = 'code-less-root';
var programConfig = cfg.get(conf_name);
var projectCache = map.weakSyncMap();
var fnamecheck = /[\/\\;\:\.\?#@!\*\^%]+/;
var varNameCheck = /^[_a-zA-z\$]+[_a-zA-z\$0-9]*$/;
var tagNameCheck = /^[_a-zA-z\$]+[_a-zA-z\$0-9\-]*$/;
var attrNameCheck = /^[_a-zA-z\$]+[_a-zA-z\$0-9\-]*$/;

// 当配置文件不存在, 创建默认的配置文件
if (!programConfig) {
  // 创建配置文件
  cfg.create({
    'mode': cfg.MODE_ORG,
    'name': conf_name,
    'desc': "低代码开发平台库",
    'create_time': new Date(),
  });
  // 创建配置内容
  cfg.putTemplate(conf_name, {
    'mongodb'  : cfg.TYPE_STRING,
    'dbname'   : cfg.TYPE_STRING,
  });
  // 配置项说明
  cfg.setDesc(conf_name, {
    'mongodb' : "Mongodb 数据库 URL",
    'dbname'  : "数据库DB名称",
  });
  programConfig = {
    mongodb : 'mongodb://mongo-x',
    dbname  : defdbname,
  };
  cfg.set(conf_name, programConfig);
}

module.exports = {
  opendb          : opendb,
  openprj         : openprj,
  getprj          : getprj,
  checkprj        : checkprj,
  uuid            : genid,
  normalize       : normalize,
  currentUserOrg  : currentUserOrg,
  getBasePath     : getBasePath,
  getfilepath     : getfilepath,
  encrypt         : encrypt,
  decrypt         : decrypt,
  checkFileName   : checkFileName,
  varNameCheck    : varNameCheck,
  tagNameCheck    : tagNameCheck,
  attrNameCheck   : attrNameCheck,
  checkArray      : checkArray,
  returnMgUpinfo  : returnMgUpinfo,
  returnMgDelinfo : returnMgDelinfo,
};


function checkFileName(name) {
  if (fnamecheck.test(name)) {
    return "文件名不能包含特殊字符 : ; / \ ? . # @ ! * ^ %";
  }
  return;
}


function normalize(p) {
  return plib.normalize(p);
}


function genid() {
  return uuid.zip();
}


function opendb() {
  var pc = cfg.get(conf_name);
  return mongodb.connect(pc.mongodb).db(pc.dbname || defdbname);
}


function getprj(prjid) {
  var prj = projectCache.get(prjid);
  if (!prj) {
    var ret = opendb().collection('_prj').find({_id: prjid});
    if (!ret[0]) throw new Error("项目不存在"+ prjid);
    prj = ret[0];
    projectCache.put(prjid, prj);
  }
  return prj;
}


function getfilepath(prj, filename) {
  return plib.join('/t', prj.basedir, filename);
}


function openprj(sys, prjid) {
  var prj = checkprj(sys, prjid);
  return mongodb.connect(prj.url).db(prj.db).collection(prj.coll);
}


function checkprj(sys, prjid) {
  var prj = getprj(prjid);
  
  if (prj.owner != sys.getUserIdByPID()) {
    var userRoles = sys.getUserRolesMap();
    var pr = prj.roles;
    var hasrole = false;
  
    for (var i=0; i<pr.length; ++i) {
      if (userRoles[pr[i]]) {
        hasrole = true;
        break;
      }
    }
    
    if (!hasrole) {
      throw new Error("用户无权操作该项目");
    }
  }
  return prj;
}


//
// 返回机构的 id 和名称, 当前用户必须有机构的访问权限, 
// 否则会抛出异常
//
function currentUserOrg(sys, org) {
  var orgs = sys.getUserOrgList();
  var name;
  
  for (var i=0; i<orgs.length; ++i) {
    if (orgs[i].orgid == org) {
      name = orgs[i].orgnm;
      break;
    }
  }
  if (!name) {
    throw new Error('无权限访问 ' + org + ' 机构.');
  }
  
  return {
    id   : org,
    name : name,
  };
}


//
// 通过判断当前用户权限, 打开不同的 ui 目录
// 不包含 ‘t/ui’ 前缀, 需要在处理最终文件时添加
// se - se 模块
// org - 机构 id
// path - 抽象目录
//
function getBasePath(se, org, path) {
  var basepath;
  if (se.isPlatformOrg()) {
    basepath = plib.join("/", path);
  } else {
    basepath = plib.join("/saas/", org, path);
  }
  return basepath;
}


function encrypt(prj, file) {
  return file.content;
}


function decrypt(prj, file) {
  return file.content;
}


//
// 数组中不能有无效项目和重复项目
//
function checkArray(arr) {
  var f = {};
  for (var i=0; i<arr.length; ++i) {
    if (!arr[i]) {
      return '项目不能为空';
    }
    if (f[arr[i]]) {
      return '有重复项 '+ arr[i];
    }
    f[arr[i]] = 1;
  }
}


//
// 接口返回, 根据 Mongo.DeleteResult 对象状态返回信息
//
function returnMgDelinfo(sys, dr) {
  if (dr.getDeletedCount()) {
    sys.setRetData(0, '删除成功');
  } else {
    sys.setRetData(1, '删除失败');
  }
}


//
// 接口返回, 根据 Mongo.UpdateResult 对象状态返回信息
//
function returnMgUpinfo(sys, up) {
  if (up.getModifiedCount()) {
    sys.setRetData(0, "更新成功");
  } else if (up.getMatchedCount()) {
    sys.setRetData(0, "没有更改");
  } else {
    sys.setRetData(1, "没有匹配的数据");
  }
}