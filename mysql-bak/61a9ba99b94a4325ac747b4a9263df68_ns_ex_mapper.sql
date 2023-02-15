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
-- Table structure for table `ns_ex_mapper`
--

DROP TABLE IF EXISTS `ns_ex_mapper`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ns_ex_mapper` (
  `mapid` varchar(32) NOT NULL,
  `createdt` datetime NOT NULL,
  `updatedt` datetime NOT NULL,
  `sql_str` varchar(5000) NOT NULL COMMENT 'SQl查询文',
  `map_json` varchar(5000) NOT NULL COMMENT '数据集>SQl列 映射',
  `status` int(11) NOT NULL DEFAULT '1',
  `criid` varchar(32) NOT NULL COMMENT '交换标准 ns_ex_cri',
  `source_did` varchar(32) NOT NULL COMMENT '数据源主键 sys_pl_drm_ds001',
  `wsid` varchar(32) NOT NULL COMMENT 'SOAP 调用定义 sys_webservice',
  `rtid` varchar(32) NOT NULL COMMENT 'SOAP 调用定义 ns_ex_remote',
  `route` varchar(50) DEFAULT NULL COMMENT '服务路由信息, scenecode:serviceename [/route]',
  `process` varchar(50) DEFAULT NULL COMMENT '服务流程编排相关信息',
  `sourceorgan` varchar(50) NOT NULL COMMENT '消费方所在机构编码',
  `sourcedomain` varchar(50) NOT NULL COMMENT '消费方所使用的接入系统编码',
  `servicecode` varchar(50) NOT NULL COMMENT '请求的服务在服务注册中心的唯一服务编码',
  `targetorgan` varchar(50) DEFAULT NULL COMMENT '服务提供方所在的机构编码',
  `targetdomain` varchar(50) NOT NULL COMMENT '服务提供方所在的接入系统编码',
  `map_name` varchar(45) NOT NULL,
  PRIMARY KEY (`mapid`),
  UNIQUE KEY `map_name_UNIQUE` (`map_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='DB映射配置';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ns_ex_mapper`
--

LOCK TABLES `ns_ex_mapper` WRITE;
/*!40000 ALTER TABLE `ns_ex_mapper` DISABLE KEYS */;
/*!40000 ALTER TABLE `ns_ex_mapper` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:34:23
