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
-- Table structure for table `sys_prj`
--

DROP TABLE IF EXISTS `sys_prj`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_prj` (
  `prjid` char(32) NOT NULL COMMENT '项目ID',
  `prjnm` varchar(100) NOT NULL COMMENT '项目名称',
  `prj_path` varchar(40) NOT NULL COMMENT '项目目录',
  `ugid` char(32) NOT NULL COMMENT '开发用户组ID',
  `mark` varchar(600) NOT NULL COMMENT '说明',
  `status` char(1) NOT NULL COMMENT '状态',
  `createdt` datetime NOT NULL COMMENT '创建时间',
  `updatedt` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`prjid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='项目信息表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_prj`
--

LOCK TABLES `sys_prj` WRITE;
/*!40000 ALTER TABLE `sys_prj` DISABLE KEYS */;
INSERT INTO `sys_prj` VALUES ('7dee96931dca4894a2723632bd229ce6','数据交换/公共服务','dataswitch','3c82e98af8d44c2dad0614ecd8639d8d','数据交换/转换, 公共服务, 互联网项目, 公司宣传相关应用, 统计分析.','1','2018-06-08 10:04:55','2018-12-13 13:14:12'),('96051d43bad94e06a2421cf807e158eb','应用示例(废弃,看描述)','/','4f1c7cf59ec14257bc5f2d6d8b6ae6c6','该项目已经废弃, 所有演示代码在 \'数据服务中心\' 机构中 \'示例项目\' 上进行; 不要在平台机构上创建用于给客户演示的项目.','0','2018-05-21 22:05:39','2018-12-12 11:43:29'),('a5bf236af3724812bc46ee30a64e6f9d','平台核心','/','fc3588ae39324ea6b75b48aef5db55b7','平台核心项目, 权限/用户/IDE/画面等管理','1','2016-07-07 09:15:57','2019-01-11 09:32:56'),('d9133fcc131345cfae76ccf52dc9910d','测试用例','alltest','d98730fdec2c464888e0c9e063fd179b','开发平台时的测试用例, 用于测试底层api有效性, 非DEMO','1','2017-11-16 15:36:46','2018-12-08 15:47:38'),('f065b4cf68e14acfbe6201755589590f','平台提供 API 列表','/','a50d620dfe7445768a67acc09d5abd19','平台向各机构提供的可调用的 API 列表','1','2016-07-18 14:24:48','2016-07-18 14:24:48');
/*!40000 ALTER TABLE `sys_prj` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:35:25
