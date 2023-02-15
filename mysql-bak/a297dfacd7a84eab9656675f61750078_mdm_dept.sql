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
-- Table structure for table `mdm_dept`
--

DROP TABLE IF EXISTS `mdm_dept`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mdm_dept` (
  `deptid` char(32) NOT NULL COMMENT '部门ID',
  `deptcd` varchar(10) DEFAULT NULL COMMENT '部门代码',
  `deptnm` varchar(70) DEFAULT NULL COMMENT '部门名称',
  `orgid` char(32) DEFAULT NULL COMMENT '主管机构ID',
  `de0201039_pid` char(32) DEFAULT NULL COMMENT '部门负责人PID',
  `de0201039` varchar(50) DEFAULT NULL COMMENT '部门负责人姓名',
  `higher_deptid` char(32) DEFAULT NULL COMMENT '上级部门ID',
  `dept_level` int(2) DEFAULT NULL COMMENT '部门级别',
  `de020100905` varchar(70) DEFAULT NULL COMMENT '部门地址-村（街、路、弄等）',
  `de020100906` varchar(70) DEFAULT NULL COMMENT '地址-门牌号码',
  `de020100901` varchar(70) DEFAULT NULL COMMENT '地址-省（自治区、直辖市）',
  `de020100902` varchar(70) DEFAULT NULL COMMENT '地址-市（地区、州）',
  `de020100903` varchar(70) DEFAULT NULL COMMENT '地址-县（区）',
  `de020100904` varchar(70) DEFAULT NULL COMMENT '地址-乡（镇、街道办事处）',
  `de0201038` char(6) DEFAULT NULL COMMENT '行政区别代码',
  `de0201047` char(6) DEFAULT NULL COMMENT '邮政编码',
  `de0201010` varchar(20) DEFAULT NULL COMMENT '电话号码',
  `de0201008` varchar(18) DEFAULT NULL COMMENT '传真号码',
  `de0201012` varchar(70) DEFAULT NULL COMMENT '电子邮件地址',
  `de0201054` varchar(50) DEFAULT NULL COMMENT '中文域名',
  `de0201046` varchar(50) DEFAULT NULL COMMENT '英文域名',
  `de0810009` char(8) DEFAULT NULL COMMENT '部门成立日期',
  `de0810010` int(8) DEFAULT NULL COMMENT '部门从业人员数',
  `de0810046` int(8) DEFAULT NULL COMMENT '职工总数',
  `de0810001` decimal(8,0) DEFAULT NULL COMMENT '办公用房面积(m2)',
  `de0810005` decimal(8,0) DEFAULT NULL COMMENT '房屋建筑总面积(m2)',
  `de0810006` decimal(8,0) DEFAULT NULL COMMENT '房屋竣工面积(m2)',
  `de0810008` decimal(8,0) DEFAULT NULL COMMENT '后勤保障及其他用房面积(m2)',
  `de0810030` decimal(8,2) DEFAULT NULL COMMENT '批准基建项目建筑面积(m2)',
  `de0810031` decimal(8,2) DEFAULT NULL COMMENT '生产车间面积(m2)',
  `de0810032` decimal(8,2) DEFAULT NULL COMMENT '危房面积(m2)',
  `de0810041` decimal(8,2) DEFAULT NULL COMMENT '业务用房面积(m2)',
  `de0810044` decimal(8,2) DEFAULT NULL COMMENT '营业面积(m2)',
  `de0810050` decimal(8,2) DEFAULT NULL COMMENT '自有房屋面积(m2)',
  `de0810051` decimal(8,2) DEFAULT NULL COMMENT '租借房屋面积(m2)',
  `status` char(1) DEFAULT NULL COMMENT '状态',
  `create_orgid` varchar(32) DEFAULT NULL COMMENT '创建机构ID',
  `create_pid` varchar(32) DEFAULT NULL COMMENT '创建人PID',
  `createdt` datetime DEFAULT NULL COMMENT '创建时间',
  `update_orgid` varchar(32) DEFAULT NULL COMMENT '修改机构ID',
  `update_pid` varchar(32) DEFAULT NULL COMMENT '修改人PID',
  `updatedt` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`deptid`),
  KEY `mdm_dept_deptcd` (`deptcd`),
  KEY `mdm_dept_deptnm` (`deptnm`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='部门基本信息表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mdm_dept`
--

LOCK TABLES `mdm_dept` WRITE;
/*!40000 ALTER TABLE `mdm_dept` DISABLE KEYS */;
/*!40000 ALTER TABLE `mdm_dept` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:34:45
