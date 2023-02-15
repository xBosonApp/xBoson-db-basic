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
-- Table structure for table `sys_pl_chain_witness`
--

DROP TABLE IF EXISTS `sys_pl_chain_witness`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_pl_chain_witness` (
  `wnid` varchar(45) NOT NULL,
  `host` varchar(128) NOT NULL,
  `port` int(11) NOT NULL,
  `publickey` varchar(999) NOT NULL,
  `urlperfix` varchar(128) DEFAULT NULL,
  `algorithm` varchar(45) NOT NULL,
  `createdt` datetime NOT NULL,
  `updatedt` datetime NOT NULL,
  `name` varchar(45) DEFAULT '匿名',
  PRIMARY KEY (`wnid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='区块链见证者';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_pl_chain_witness`
--

LOCK TABLES `sys_pl_chain_witness` WRITE;
/*!40000 ALTER TABLE `sys_pl_chain_witness` DISABLE KEYS */;
INSERT INTO `sys_pl_chain_witness` VALUES ('c94756c853064371bc07ef17da9cb12f','10.0.0.104',9000,'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEhEJFmbG2PlGiY22kL/j5dnxUEfvyigrIqSSL+UuaCePTZbE0W6MiRamnNJch3w0eKyjPPpG7YzCALwJMijbA8Q==','witness/','SHA256withECDSA','2018-08-04 17:28:15','2018-10-20 12:58:26','匿名'),('edcede767f9f4004942e9e861ae7da13','10.0.0.104',10080,'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE0naRlmkn+5nO9kpOexVe3RrRBcCIi7R6gWDv+smgC3FL4fbjSXPQ8GpQz6qcKqAl5ryTThxM1AmEOuJOu4y70g==','witness/','SHA256withECDSA','2018-08-14 18:03:08','2018-08-15 19:38:01','匿名');
/*!40000 ALTER TABLE `sys_pl_chain_witness` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:35:09
