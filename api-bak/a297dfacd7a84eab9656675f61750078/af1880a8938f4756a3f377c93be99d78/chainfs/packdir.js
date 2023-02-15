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

var volid = sys.request.getString('v', 1, 99);
var path  = sys.request.getSafePath('p');
var lib   = require("./lib");
var plib  = require("path");
var pack  = require("pack");
var selfuser = sys.getUserIdByPID();

var v = lib.openVolumeRead(selfuser, volid);

var attr = lib.getAttr(volid, path);
if (attr == null || !attr.isDir()) {
  throw new Error("不是目录 "+ path);
}


var cmap = lib.openTable("chain-map");
var chain = lib.openChain(v);
var basename = plib.basename(path);
path = plib.dirname(path);

var zipfilename = basename +'-dir-pack.zip';
var z = pack.createZipWriter(sys.getResponseStream(zipfilename));
var filelist = [];

try {
  open_dir(basename);
} catch(err) {
  filelist.push(err.message);
}

z.add("filelist.txt", filelist.join('\n'));
z.close();


function open_dir(ipath) {
  var hddir = plib.join(path, ipath);
  var dirs = lib.openDir(plib.join(volid, hddir));
  var itr = dirs.iterator();
  
  while (itr.hasNext()) {
    var inf = itr.next();
    var relpath = plib.join(ipath, inf.name);
    
    if (inf.isDir()) {
      open_dir(relpath);
    } else {
      var hdpath = plib.join(hddir, inf.name);
      var zpath = relpath;
      if (zpath[0] == '/') {
        zpath = zpath.substr(1);
      }
      z.add(zpath, lib.openInput(volid, hdpath));
      
      var block = lib.getBlock(chain, cmap, volid, hdpath);
      var bdata = block.data;
      
      filelist.push(zpath);
      filelist.push("Key:    "+ block.key.toString());
      filelist.push('MD5:    '+ bdata.md5);
      filelist.push('SHA1:   '+ bdata.sha1);
      filelist.push('SHA512: '+ bdata.sha512);
      filelist.push('');
    }
  }
}