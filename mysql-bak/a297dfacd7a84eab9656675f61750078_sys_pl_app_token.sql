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
-- Table structure for table `sys_pl_app_token`
--

DROP TABLE IF EXISTS `sys_pl_app_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_pl_app_token` (
  `client_id` varchar(32) NOT NULL,
  `token` varchar(90) NOT NULL,
  `userid` varchar(45) NOT NULL,
  `birth_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_in` int(11) NOT NULL COMMENT '生命长度, 秒',
  `enable` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`token`),
  UNIQUE KEY `token_UNIQUE` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='第三方应用登录令牌';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_pl_app_token`
--

LOCK TABLES `sys_pl_app_token` WRITE;
/*!40000 ALTER TABLE `sys_pl_app_token` DISABLE KEYS */;
INSERT INTO `sys_pl_app_token` VALUES ('d8016ba77dc345dfa8681eeee7814d7f','8wG6n3zqsyak2AFI4J07vaCgno4IjD92TG58XK4w38KJ5t54QP94PX5594S7O3g4IYLv8Hm8x8d4B9Vd1l69PKu9gD','admin-pl','2018-03-15 13:39:57',7776000,1),('d8016ba77dc345dfa8681eeee7814d7f','EleiXZZdP5XNe7bkIr4Psp7HNa4EgFyf44QmX2u3z3pOsyS11x9wD4iBA8FB9n0yCCa3X5l72mD10gGs4fmUUV6PDy','admin-pl','2018-03-15 13:38:20',7776000,1);
/*!40000 ALTER TABLE `sys_pl_app_token` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:35:05
