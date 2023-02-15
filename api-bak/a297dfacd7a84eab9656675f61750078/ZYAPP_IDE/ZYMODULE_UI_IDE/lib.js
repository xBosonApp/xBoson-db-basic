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

var plib = require('path');

//
// css 压缩选项
//
var cleanCSSOption = { 
  fetch: function (uri, inlineRequest, inlineTimeout, callback) {
    console.log('css fetch', uri);
    callback(new Error("unsupport"));
  },
  inline: false,
};

//
// 允许上传文件类型扩展名列表
//
var fileTypes = {
  png:1,   jpg:1,  jpeg:1, gif:1, ico:1, htm:1, html:1, js:1,  css:1,
  woff2:1, woff:1, ttf:1,  svg:1, eot:1, zip:1, rar:1,  psd:1, ai:1,
  mp4:1,   m4v:1,  pdf:1,  txt:1, md:1,  swf:1, doc:1,  ppt:1, xls:1,
  git:1,   less:1, vue:1,  jsx:1, ts:1,  tsx:1, sass:1, pug:1, styl:1,
  json:1,
};

//
// 上传文件类型黑明单
//
var blockFileTypes = {
  exe:1, dmg:1, cmd:1, sh:1,
};

//
// 虚拟根目录列表, 在 UI 文件树中显示, {文件根目录:虚拟目录}
//
var virtualDir = {
  '/web'        : 'WEB',
  '/masquerade' : 'Masquerade-Tempate',
  '/docx'       : 'Product-Documentation',
};

module.exports = {
  getBasePath    : getBasePath,
  currentUserOrg : currentUserOrg,
  getFileType    : getFileType,
  formatPath     : formatPath,
  setSpecialDir  : setSpecialDir,
  cleanCSSOption : cleanCSSOption,
  fileTypes      : fileTypes,
  blockFileTypes : blockFileTypes,
  jsmin          : jsmin,
  cssmin         : cssmin,
  normalize      : normalize,
  isSpecial      : isSpecial,
};

for (var n in fileTypes) {
  fileTypes['.'+ n] = fileTypes[n];
}


function normalize(s) {
  return plib.normalize(s);
}


//
// 通过判断当前用户权限, 打开不同的 ui 目录
// se - se 模块
// org - 机构 id
// path - 抽象目录
//
function getBasePath(se, org, path) {
  var basepath;
  if (se.isPlatformOrg()) {
    if (isSpecial(path)) {
      basepath = path;
    } else {
      basepath = "/t/" + path;
    }
  } else {
    basepath = "/t/saas/" + org +'/'+ path;
  }
  return basepath;
}


//
// 与 getBasePath 不同, 可以返回 'ui/' 和 't/' 目录.
//
function formatPath(se, branch, org, path) {
  var basepath;
  if (se.isPlatformOrg()) {
    if (isSpecial(path)) {
      basepath = path;
    } else {
      basepath = branch + "/" + path;
    }
  } else {
    basepath = branch + "/saas/" + org +'/'+ path;
  }
  return basepath;
}


function isSpecial(_path) {
  if (virtualDir[_path]) return true;
  var a = _path.substr(0, _path.indexOf('/', 1));
  if (virtualDir[a]) return true;
  return false;
}


function setSpecialDir(files) {
  for (var n in virtualDir) {
    files.push({
      children : [],
      name     : virtualDir[n],
      path     : n,
      isParent : true,
      virtual  : true,
    });
  }
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
// 返回文件类型名称, 用于给 ace editor 加载代码解释器.
//
function getFileType(path) {
  var i = path.lastIndexOf('.');
  if (i > 0) {
    var ext = path.substring(i+1);
    switch (ext) {
      case "js": 
        return "javascript";
      case "md": 
        return "markdown";
    }
    return ext;
  }
  return 'txt';
}


function jsmin(code) {
  var UglifyJS = require("uglify-js-min");
  return UglifyJS.minify(code);
}


function cssmin(code) {
  var CleanCSS = require('clean-css');
  var ccs_clean = new CleanCSS(cleanCSSOption);
  return ccs_clean.minify(code);
}