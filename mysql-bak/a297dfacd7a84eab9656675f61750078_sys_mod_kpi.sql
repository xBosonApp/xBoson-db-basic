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
-- Table structure for table `sys_mod_kpi`
--

DROP TABLE IF EXISTS `sys_mod_kpi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_mod_kpi` (
  `pid` varchar(100) NOT NULL,
  `modid` varchar(100) NOT NULL DEFAULT '' COMMENT '模块ID',
  `modnm` varchar(100) NOT NULL,
  `modtype` varchar(100) DEFAULT NULL COMMENT '模块分类',
  `shareable` char(1) DEFAULT '0',
  `fileid` varchar(50) DEFAULT NULL,
  `typecd` varchar(100) DEFAULT NULL COMMENT '业务模型ID',
  `apiid` varchar(50) DEFAULT NULL COMMENT '业务模型 API ID',
  `jsondata` longtext COMMENT 'jsondata',
  `createdt` datetime DEFAULT NULL,
  `updatedt` datetime DEFAULT NULL,
  `formhtml` longtext COMMENT '可变超大文本内容',
  PRIMARY KEY (`pid`,`modid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_mod_kpi`
--

LOCK TABLES `sys_mod_kpi` WRITE;
/*!40000 ALTER TABLE `sys_mod_kpi` DISABLE KEYS */;
INSERT INTO `sys_mod_kpi` VALUES ('1f33f752805443e59bfe5f8f77481443','ef1eaa61ac4449ad8cc3b16b7ad2d14f','qq','图表目录','1',NULL,'static2','exc_select','{\"type\":[{\"datalength\":\"\",\"view\":\"1\",\"search\":\"\",\"unit\":\"\",\"datatype\":\"\",\"format\":\"\",\"en\":\"en1\",\"dict\":\"\",\"must\":\"\",\"cn\":\"分类名\",\"ro\":\"0\",\"elemtype\":\"\"},{\"datalength\":\"\",\"format\":\"\",\"en\":\"en2\",\"cn\":\"统计A\",\"elemtype\":\"\",\"view\":\"1\",\"search\":\"\",\"unit\":\"\",\"datatype\":\"\",\"dict\":\"\",\"must\":\"\",\"ro\":\"0\",\"chart\":\"line,stagebar,stagecolumn,bar,pie,arealine,column,radar\"},{\"datalength\":\"\",\"format\":\"\",\"en\":\"en3\",\"cn\":\"统计B\",\"elemtype\":\"\",\"view\":\"0\",\"search\":\"\",\"unit\":\"2\",\"datatype\":\"\",\"dict\":\"\",\"must\":\"\",\"ro\":\"0\",\"chart\":\"bar,stagebar,stagecolumn,line,pie,arealine,column,radar\"},{\"datalength\":\"\",\"format\":\"\",\"en\":\"en4\",\"cn\":\"统计C\",\"elemtype\":\"\",\"view\":\"1\",\"search\":\"\",\"unit\":\"1\",\"datatype\":\"\",\"dict\":\"\",\"must\":\"\",\"ro\":\"0\",\"chart\":\"pie,stagebar,stagecolumn,line,bar,arealine,column,radar\"}],\"searchparam\":{}}','2016-12-08 19:41:06','2017-02-09 11:11:26','<center><h4>[title]</h4></center>\n\n<form class=\"smart-form chart-search-form\" onsubmit=\"return false;\">\n  <section class=\"col col-md-4 col-lg-4\">\n    <label class=\"label\">名称1</label>\n    <label class=\"input\">\n    <input name=\"enName1\" dict=\"\" type=\"text\"/>\n    </label>\n  </section>\n  \n  <section class=\"col col-md-4 col-lg-4\">\n    <label class=\"label\">名称2</label>\n    <label class=\"input\">\n    <input name=\"enName2\" dict=\"ZR.0001\" type=\"select2_radio\"/>\n    </label>\n  </section>\n  \n  <section class=\"col col-md-4 col-lg-4\">\n    <label class=\"label\">&nbsp;</label>\n    <label class=\"input\">\n    <button id=\"bubble_search\" class=\"btn btn-info btn-sm\" type=\"submit\">\n    <i class=\"fa fa-search fa-1\"></i> 查 询  </button>\n    </label>\n  </section>\n  \n  <script>\n  $(function() {\n    var jroot = $(\'.chart-search-form\');\n    console.log(\'chart form success\', jroot);\n  });\n  </script>\n</form>\n'),('1f33f752805443e59bfe5f8f77481443','f4fc515d8bda4513bddb4238baa5b5b8','散点图','图表目录','1',NULL,'t7','exc_select','{\"type\":[{\"format\":\"\",\"en\":\"idname\",\"cn\":\"idname\",\"elemtype\":\"text\",\"unit\":\"\",\"search\":\"0\",\"view\":\"1\",\"datatype\":\"VARCHAR\",\"dict\":\"\",\"numrange\":\"47\",\"must\":\"1\",\"ro\":\"0\",\"chart\":\"scatter\"}],\"searchparam\":{}}','2016-12-08 18:23:56','2017-02-09 11:11:09',NULL),('eb143244ef5745f1b92669f7c4ff9769','a96218e21981458ea5d5ddde4dc62232','散点图2','图表目录','1',NULL,'static1','exc_select','{\"type\":[{\"unit\":\"\",\"ro\":\"0\",\"dict\":\"\",\"cn\":\"统计A\",\"search\":\"\",\"datalength\":\"\",\"chart\":\"scatter,line,stagebar,stagecolumn,bar,pie,arealine,column\",\"en\":\"en2\",\"format\":\"\",\"view\":\"1\",\"datatype\":\"\",\"must\":\"\",\"elemtype\":\"\"},{\"unit\":\"2\",\"ro\":\"0\",\"dict\":\"\",\"cn\":\"统计B\",\"search\":\"\",\"datalength\":\"\",\"chart\":\"scatter,bar,stagebar,stagecolumn,line,pie,arealine,column\",\"en\":\"en3\",\"format\":\"\",\"view\":\"0\",\"datatype\":\"\",\"must\":\"\",\"elemtype\":\"\"},{\"unit\":\"1\",\"ro\":\"0\",\"dict\":\"\",\"cn\":\"统计C\",\"search\":\"\",\"datalength\":\"\",\"chart\":\"scatter,pie,stagebar,stagecolumn,line,bar,arealine,column\",\"en\":\"en4\",\"format\":\"\",\"view\":\"1\",\"datatype\":\"\",\"must\":\"\",\"elemtype\":\"\"}],\"searchparam\":{}}','2017-02-04 10:18:53','2017-02-09 11:11:56','<center><h4>11</h4></center>\n\n<form class=\"smart-form chart-search-form\" onsubmit=\"return false;\">\n  <section class=\"col col-md-4 col-lg-4\">\n    <label class=\"label\">名称1</label>\n    <label class=\"input\">\n    <input name=\"enName1\" dict=\"\" type=\"text\"/>\n    </label>\n  </section>\n  \n  <section class=\"col col-md-4 col-lg-4\">\n    <label class=\"label\">名称2</label>\n    <label class=\"input\">\n    <input name=\"enName2\" dict=\"ZR.0001\" type=\"select2_radio\"/>\n    </label>\n  </section>\n  \n  <section class=\"col col-md-4 col-lg-4\">\n    <label class=\"label\">&nbsp;</label>\n    <label class=\"input\">\n    <button id=\"bubble_search\" class=\"btn btn-info btn-sm\" type=\"submit\">\n    <i class=\"fa fa-search fa-1\"></i> 查 询  </button>\n    </label>\n  </section>\n  \n  <script>\n  $(function() {\n    var jroot = $(\'.chart-search-form\');\n    console.log(\'chart form success\', jroot);\n  });\n  </script>\n</form>\n'),('eb143244ef5745f1b92669f7c4ff9769','c2731cb3194047118cfebce5b4b0369d','qqs','a6343c5e191046dcb67d9735b68b31c7','0',NULL,'static2','exc_select','{\"type\":[{\"datalength\":\"\",\"view\":\"1\",\"search\":\"\",\"unit\":\"\",\"datatype\":\"\",\"format\":\"\",\"en\":\"en1\",\"dict\":\"\",\"must\":\"\",\"cn\":\"分类名\",\"ro\":\"0\",\"elemtype\":\"\"},{\"datalength\":\"\",\"format\":\"\",\"en\":\"en2\",\"cn\":\"统计A\",\"elemtype\":\"\",\"view\":\"1\",\"search\":\"\",\"unit\":\"\",\"datatype\":\"\",\"dict\":\"\",\"must\":\"\",\"ro\":\"0\",\"chart\":\"line,stagebar,stagecolumn,bar,pie,arealine,column,radar\"},{\"datalength\":\"\",\"format\":\"\",\"en\":\"en3\",\"cn\":\"统计B\",\"elemtype\":\"\",\"view\":\"0\",\"search\":\"\",\"unit\":\"2\",\"datatype\":\"\",\"dict\":\"\",\"must\":\"\",\"ro\":\"0\",\"chart\":\"bar,stagebar,stagecolumn,line,pie,arealine,column,radar\"},{\"datalength\":\"\",\"format\":\"\",\"en\":\"en4\",\"cn\":\"统计C\",\"elemtype\":\"\",\"view\":\"1\",\"search\":\"\",\"unit\":\"1\",\"datatype\":\"\",\"dict\":\"\",\"must\":\"\",\"ro\":\"0\",\"chart\":\"pie,stagebar,stagecolumn,line,bar,arealine,column,radar\"}],\"searchparam\":{}}','2017-03-03 17:28:34','2017-03-03 17:28:34','<center><h4>[title]</h4></center>\n\n<form class=\"smart-form chart-search-form\" onsubmit=\"return false;\">\n  <section class=\"col col-md-4 col-lg-4\">\n    <label class=\"label\">名称1</label>\n    <label class=\"input\">\n    <input name=\"enName1\" dict=\"\" type=\"text\"/>\n    </label>\n  </section>\n  \n  <section class=\"col col-md-4 col-lg-4\">\n    <label class=\"label\">名称2</label>\n    <label class=\"input\">\n    <input name=\"enName2\" dict=\"ZR.0001\" type=\"select2_radio\"/>\n    </label>\n  </section>\n  \n  <section class=\"col col-md-4 col-lg-4\">\n    <label class=\"label\">&nbsp;</label>\n    <label class=\"input\">\n    <button id=\"bubble_search\" class=\"btn btn-info btn-sm\" type=\"submit\">\n    <i class=\"fa fa-search fa-1\"></i> 查 询  </button>\n    </label>\n  </section>\n  \n  <script>\n  $(function() {\n    var jroot = $(\'.chart-search-form\');\n    console.log(\'chart form success\', jroot);\n  });\n  </script>\n</form>\n');
/*!40000 ALTER TABLE `sys_mod_kpi` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:35:02
