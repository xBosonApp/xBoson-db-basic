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
-- Table structure for table `sys_ug_user`
--

DROP TABLE IF EXISTS `sys_ug_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_ug_user` (
  `ugid` char(32) NOT NULL COMMENT '用户组ID',
  `pid` char(32) NOT NULL COMMENT '用户PID',
  `status` char(1) NOT NULL COMMENT '状态',
  `createdt` datetime NOT NULL COMMENT '创建时间',
  `updatedt` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`ugid`,`pid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户组用户关联表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_ug_user`
--

LOCK TABLES `sys_ug_user` WRITE;
/*!40000 ALTER TABLE `sys_ug_user` DISABLE KEYS */;
INSERT INTO `sys_ug_user` VALUES ('3c82e98af8d44c2dad0614ecd8639d8d','1f33f752805443e59bfe5f8f77481443','1','2018-06-08 10:04:55','2018-06-08 10:04:55'),('3c82e98af8d44c2dad0614ecd8639d8d','eb143244ef5745f1b92669f7c4ff9769','1','2022-03-04 22:41:23','2022-03-04 22:41:23'),('3ea03b424c7c43d7b612360d5bfc50b7','1f33f752805443e59bfe5f8f77481443','1','2018-05-21 22:06:36','2018-05-21 22:06:36'),('4f1c7cf59ec14257bc5f2d6d8b6ae6c6','1f33f752805443e59bfe5f8f77481443','1','2018-05-21 22:05:39','2018-05-21 22:05:39'),('4f1c7cf59ec14257bc5f2d6d8b6ae6c6','eb143244ef5745f1b92669f7c4ff9769','1','2022-03-04 22:41:33','2022-03-04 22:41:33'),('a50d620dfe7445768a67acc09d5abd19','1f33f752805443e59bfe5f8f77481443','1','2016-08-23 14:27:48','2016-08-23 14:27:48'),('a50d620dfe7445768a67acc09d5abd19','e3e5cf168dd24b44ba4b72775d5fb215','1','2017-11-21 20:03:35','2017-11-21 20:03:35'),('a50d620dfe7445768a67acc09d5abd19','eb143244ef5745f1b92669f7c4ff9769','1','2022-03-04 22:41:56','2022-03-04 22:41:56'),('d98730fdec2c464888e0c9e063fd179b','1f33f752805443e59bfe5f8f77481443','1','2017-11-16 15:36:46','2017-11-16 15:36:46'),('d98730fdec2c464888e0c9e063fd179b','e3e5cf168dd24b44ba4b72775d5fb215','1','2017-11-21 20:03:35','2017-11-21 20:03:35'),('d98730fdec2c464888e0c9e063fd179b','eb143244ef5745f1b92669f7c4ff9769','1','2022-03-04 22:41:44','2022-03-04 22:41:44'),('fc3588ae39324ea6b75b48aef5db55b7','1f33f752805443e59bfe5f8f77481443','1','2016-07-07 09:15:57','2016-07-07 09:15:57'),('fc3588ae39324ea6b75b48aef5db55b7','e3e5cf168dd24b44ba4b72775d5fb215','1','2017-11-21 20:03:35','2017-11-21 20:03:35'),('fc3588ae39324ea6b75b48aef5db55b7','eb143244ef5745f1b92669f7c4ff9769','1','2022-03-04 22:41:13','2022-03-04 22:41:13');
/*!40000 ALTER TABLE `sys_ug_user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:35:32
