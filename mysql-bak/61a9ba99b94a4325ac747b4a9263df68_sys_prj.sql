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
USE `61a9ba99b94a4325ac747b4a9263df68`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: 61a9ba99b94a4325ac747b4a9263df68
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='项目信息';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_prj`
--

LOCK TABLES `sys_prj` WRITE;
/*!40000 ALTER TABLE `sys_prj` DISABLE KEYS */;
INSERT INTO `sys_prj` VALUES ('29d10c1d0a1540618ef1d2df3c14dd12','大数据商城','datashop','191633ca89964701b44083aa5edec627','大数据商城','1','2018-05-30 15:25:25','2018-05-30 15:25:25'),('8a9354b06b9140c191829323adb96c5f','示例项目','demo-project','3c8ec83a701f483599813583a4935fb1','随意修改','1','2018-12-08 10:33:12','2018-12-08 10:33:12'),('f3190431946a42338a0bfa7c33bf4640','数据服务','datas','9d74d167504d46c68e72234a9f63af68','开发本地数据共享服务','1','2018-07-03 13:42:40','2018-07-03 13:42:40'),('f911b988584247daa94bf6ccf29adc98','SaaS云应用','/','407699b3a40c4177886ddeec293b5d17','SaaS应用：\n1、任务助手（日程管理）；\n2、健康筛查（健康评估：心理、体质、慢病、中医）；\n3、健康干预（咨询、康复）；\n4、客户关系（客户挖掘、客户管理）；\n5、运营管理（SaaS应用服务管理）;\n……','1','2021-06-27 21:42:21','2021-06-27 21:42:21');
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

-- Dump completed on 2023-02-15 15:34:37
