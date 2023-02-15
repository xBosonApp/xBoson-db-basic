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
console.log(">>>> ----------------- Test date Functions.", date);
var assert = require("assert");

var d = date.currentDate();
console.log("date.currentDate", d);
console.log("date.currentTimeString", date.currentTimeString());
console.log("date.currentTimeMillis", date.currentTimeMillis());

var unix = date.unixTimestampFromDate(d);
console.log("date.unixTimestampFromDate", unix);
var sd = date.dateFromUnixTimestamp(unix);
console.log("date.dateFromUnixTimestamp", sd);
assert(date.compare(sd, d)<=0, "data.dateFromUnixTimestamp");

var x = date.formattedTime(d, "yyyyMMddHHmmssSSS");
console.log("date.formattedTime()", x);
var y = date.parseDate(x, "yyyyMMddHHmmssSSS");
assert(y.equals(d), "date.parseDate");

var x = date.plusDate(d, 1, "d");
console.log("date.plusDate", x);

var x = date.plusString("2010-01-01","yyyy-MM-dd", 1,"d");
console.log('date.plusString', x);
assert.eq('2010-01-02', x);

var d = date.parseDate("2000-0102-030405-090", "yyyy-MMdd-HHmmss-SSS");
assert.eq(2000, date.getYear(d));
assert.eq(1, date.getMonth(d));
assert.eq(2, date.getDayOfMonth(d));
assert.eq(3, date.getHourOfDay(d));
assert.eq(4, date.getMinuteOfHour(d));
assert.eq(5, date.getSecond(d));
assert.eq(90, date.getMillisOfSecond(d));

console.log(
  date.getWeek(d), 
  date.getDayOfMonth(d), 
  date.getDayOfWeek(d),
  date.getMinuteOfDay(d),
  date.getMillisOfDay(d),
  date.getMillis(d)
  );