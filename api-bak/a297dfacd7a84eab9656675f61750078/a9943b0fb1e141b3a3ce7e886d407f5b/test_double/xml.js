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
var xmlstr = "<root><id>A001</id></root>";
var xmlobj = { a:1, b:2, c:3, d:[1,2,3], e:{a:'a', b:'b', c:[1,2,3]} };

//var xmlobj = sys.instanceFromXml(xmlstr);
var xmlstr2 = sys.xmlFromInstance(xmlobj);
var parsexml = sys.instanceFromXml(xmlstr2);

sys.printValue(xmlobj);
sys.printValue(xmlstr2);
sys.printValue(parsexml);