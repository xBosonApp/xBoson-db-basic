-- Copyright 2023 Jing Yanming
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--     http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.
USE `a297dfacd7a84eab9656675f61750078`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: a297dfacd7a84eab9656675f61750078
-- ------------------------------------------------------
-- Server version	5.7.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `sys_pl_task_scheduler`
--

DROP TABLE IF EXISTS `sys_pl_task_scheduler`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_pl_task_scheduler` (
  `scheduleid` char(32) NOT NULL COMMENT '计划ID',
  `schedulenm` varchar(100) NOT NULL COMMENT '计划名称',
  `schedule_cycle` char(2) NOT NULL COMMENT '周期类型',
  `time_year` char(4) DEFAULT NULL COMMENT '计划指定时间-年',
  `time_month` char(2) DEFAULT NULL COMMENT '计划指定时间-月',
  `time_day` char(2) DEFAULT NULL COMMENT '计划指定时间-日期',
  `time_hour` char(2) DEFAULT NULL COMMENT '计划指定时间-小时',
  `time_min` char(2) DEFAULT NULL COMMENT '计划指定时间-分钟',
  `time_sec` char(2) DEFAULT NULL COMMENT '计划指定时间-秒',
  `time_dayofweek` char(1) DEFAULT NULL COMMENT '计划指定时间-星期',
  `schedule_interval` decimal(10,0) DEFAULT NULL COMMENT '周期间隔数',
  `run_end_time` datetime DEFAULT NULL COMMENT '终止时间',
  `run_times` decimal(10,0) DEFAULT NULL COMMENT '任务执行次数',
  `schedule_status` char(1) DEFAULT NULL COMMENT '计划执行状态',
  `task_api` varchar(500) DEFAULT NULL COMMENT '任务API',
  `inner_api` char(1) DEFAULT NULL COMMENT '是否平台API',
  `mark` varchar(600) DEFAULT NULL COMMENT '备注',
  `orgid` char(32) DEFAULT NULL COMMENT '计划所属机构ID',
  `pid` char(32) DEFAULT NULL COMMENT '计划创建者个人编号',
  `status` char(1) DEFAULT NULL COMMENT '状态',
  `createdt` datetime DEFAULT NULL COMMENT '创建时间',
  `updatedt` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`scheduleid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='计划任务';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_pl_task_scheduler`
--

LOCK TABLES `sys_pl_task_scheduler` WRITE;
/*!40000 ALTER TABLE `sys_pl_task_scheduler` DISABLE KEYS */;
INSERT INTO `sys_pl_task_scheduler` VALUES ('004101f181894cc18398750fb96d24c3','为第二天的提醒消息设置计划任务','50',NULL,NULL,NULL,'23','00','00',NULL,NULL,'2300-12-31 00:00:00',NULL,'2','https://prod.xboson.net/xboson/app/61a9ba99b94a4325ac747b4a9263df68/f1b4adf82ee54a1c8e18d31349988a4b/message/setMsg?app=f1b4adf82ee54a1c8e18d31349988a4b&mod=message&org=61a9ba99b94a4325ac747b4a9263df68','1',NULL,'61a9ba99b94a4325ac747b4a9263df68','7e212e0fdd784f459bb291f57b4f4945','1','2021-08-09 18:57:41','2021-08-09 18:57:41'),('2cf009a7c6414fe4918530ec90fc5df0','baidu','10',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2','http://baidu.com','0',NULL,'a297dfacd7a84eab9656675f61750078','1f33f752805443e59bfe5f8f77481443','1','2018-01-16 17:01:40','2018-01-16 17:01:40'),('3167aa7840aa478cbadfcd44aa7cf047','租户列表','10',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2','http://localhost:8080/xboson/app/a297dfacd7a84eab9656675f61750078/apils/tenant/names?app=apils&mod=tenant&org=a297dfacd7a84eab9656675f61750078','1',NULL,'a297dfacd7a84eab9656675f61750078','1f33f752805443e59bfe5f8f77481443','1','2018-01-16 17:14:27','2018-01-16 17:14:27'),('580fb470b66a493c820614e93da8da48','定时获取微信服务端AccessToken','70',NULL,NULL,NULL,NULL,'0','0',NULL,1,'2290-12-27 00:00:00',NULL,'2','http://192.168.222.155:8080/dev/app/61a9ba99b94a4325ac747b4a9263df68/5da44257329a48b0a4e5f4a5c5855d48/weixin/Access_Token?app=5da44257329a48b0a4e5f4a5c5855d48&mod=weixin&org=61a9ba99b94a4325ac747b4a9263df68','1','每1小时执行一次','61a9ba99b94a4325ac747b4a9263df68','7e212e0fdd784f459bb291f57b4f4945','1','2021-08-05 16:19:17','2021-08-05 16:19:17'),('a661395d1d3644089d58472f204cca1e','长期任务','31',NULL,NULL,'10','23',NULL,NULL,NULL,NULL,'2020-03-26 00:00:00',10,'2','http://baidu.com','0',NULL,'a297dfacd7a84eab9656675f61750078','1f33f752805443e59bfe5f8f77481443','1','2018-01-16 17:17:51','2018-01-16 17:17:51'),('dd9584d18aee45e4a2129ca34d03fafd','大连天气','50',NULL,NULL,NULL,'10','05','10',NULL,NULL,NULL,111,'3','http://www.sojson.com/open/api/weather/json.shtml?city=%E5%A4%A7%E8%BF%9E','0',NULL,'a297dfacd7a84eab9656675f61750078','1f33f752805443e59bfe5f8f77481443','1','2018-02-23 11:37:23','2018-02-23 11:37:23');
/*!40000 ALTER TABLE `sys_pl_task_scheduler` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:35:23
