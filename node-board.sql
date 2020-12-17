/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE IF NOT EXISTS `eeong` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `eeong`;

CREATE TABLE IF NOT EXISTS `books` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `writer` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `wdate` datetime DEFAULT CURRENT_TIMESTAMP,
  `savefile` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `realfile` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filesize` int DEFAULT NULL,
  `uid` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_books_users` (`uid`),
  CONSTRAINT `FK_books_users` FOREIGN KEY (`uid`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `books` DISABLE KEYS */;


INSERT INTO `books` (`id`, `title`, `writer`, `content`, `wdate`, `savefile`, `realfile`, `filesize`, `uid`) VALUES
	(1, '흥보전', '작자미상', '흥부전(興夫傳)은 조선 시대의 작자 미상의 고전소설로 빈부격차에 대한 비판 내용을 담고 있으며, 한국에서 널리 알려진 이야기이다. 유래는 국문본으로 ‘흥보전(興甫傳)’ 또는 ‘놀부전’이라고도 한다. 춘향전이나 심청전과 같이 판소리 계열에 속하는 소설이다. 불합리한 당시 세태를 비판하고 비꼬는 내용과 권선징악의 테마를 가지고 있다. 흥부전을 바탕으로 만들어진 판소리 ‘흥보가’도 있다.', '1833-01-01 00:00:00', '201116-b23e8f66-c3e5-48ff-a48a-a05ce1f5764d.jpg', '흥부전.jpg', 45444, 1),
	(2, '심청전', '작자미상', '이 작품의 주인공 심청은 가난한 봉사 심학규의 딸로 태어나서 일찍 어머니를 여의고, 눈먼 아버지의 보살핌으로 자란 뒤에 아버지를 지성으로 모셨다. 심청은 공양미 300석을 부처님께 바치면 아버지가 눈을 뜰 수 있다는 말을 듣고, 항해의 안전을 기원하는 제의의 제물로 자기 몸을 팔았다. 심청은 인당수(印塘水)에서 물에 빠졌는데, 병을 앓던 용왕은 심청의 간을 빼서 병을 치료하고 심청은 연꽃에 태워 다시 인당수로 보냈다. 그때 마침 이곳을 지나던 뱃사람들이 이 연꽃을 임금님께 바쳤다. 연꽃에서 나온 심청은 왕과 혼인하였다. 왕비가 된 심청은 고향을 떠나 떠도는 아버지를 찾기 위해 맹인 잔치를 열었는데, 맹인 잔치에 온 아버지는 딸을 만나자 반가움과 놀라움에 눈을 떴다.', '1111-11-11 00:00:00', '201116-b60141c1-e349-4593-bbfb-74e2a4391e87.jpg', '심청전.jpg', 14572, 2),
	(3, '허생전', '박지원', '주인공인 허생은 10년 계획을 세우고 글공부에 몰두하지만 7년째 되는 어느 날 가난한 살림에 지친 아내가 허생에게 장인 노릇도 못하고 장사도 못 한다면 도둑질이라도 해서 돈을 벌어 오라고 눈물로 호소한다. 이에 허생은 글공부를 중단하고 장안의 갑부인 변씨를 찾아가서 1만 냥의 돈을 빌린다. 허생은 1만 냥으로 시장에 나가서 과일, 말총 등 생필품을 독점하여 가격이 오를 때에 파는 매점매석으로 독점시장을 형성하여 큰돈을 벌었다. 그는 무역이 잘 되지 않는 조선 땅의 현실에 한탄을 한다. 그 뒤 허생이 한 뱃사공을 만나 살기 좋은 섬으로 사슴과 노루가 뛰노는 남쪽의 어느 작은 무인도를 소개받게 되는데, 마침 그때 조선 땅에 수천의 도둑떼가 들끓어, 허생이 그들을 회유하여 뱃사공이 소개해 준 무인도로 데려가서 새로운 섬나라를 세우고, 그 곳에서 난 작물들을 흉년이 든 일본의 한 지방인 나가사키에 팔아 큰돈을 벌고는 허생 혼자서 다시 조선 땅으로 돌아오게 된다. 조선에 돌아와서는 가난한 사람들을 도와 주고 남은 10만 냥의 돈은 변씨에게 갚는다. 이에 변씨는 놀라서 원금에 1할의 이자만 쳐서 받으려 했지만 허생은 거절했고, 오히려 이를 계기로 허생과 변씨는 친해지게 된다. 그러던 어느 날 변씨는 허생과 이야기를 주고 받다가 조선 땅의 현실과 허생의 비범한 인품을 알게 되고, 허생에게 어영청 대장 이완을 소개시켜 북벌론에 관한 이야기를 주선하였는데, 허생이 이완에게 3가지 문제를 내었지만 이완은 3가지 모두 해결할 수 없다고 답하였다. 이에 허생은 이완을 크게 꾸짖으며 칼로 이완을 찔러 죽이려 하자 이완은 허생의 집을 도망쳐 나온다. 그 다음날 이완이 다시 허생의 집을 찾아갔으나 허생은 사라지고 없었다.', '1788-01-01 00:00:00', '201116-2a77db39-1e84-4e42-acca-bd104f533358.jpg', '허생전.jpg', 40042, 1),
	(4, '별주부전', '작자미상', '별주부는 수궁 지배층의 일원이다. 그러나 별주부는 여타 수궁 인물들과는 전혀 다른 면모를 보인다. 육지에 나가 토끼 간을 구해오라는 용왕의 호소에 대해 모든 신하는 자신들의 안위만을 생각하며 용왕의 안위는 뒷전이다. 이때 별주부는 말석에서 기어나와 목숨을 건 육지행을 자청한다. 별주부의 목숨을 건 자원에는 자신의 한미한 상황을 극복하려는 계산이 깔려 있음직도 하다. 그러나 별주부의 자원은 자신의 안위만을 위해 육지행을 꺼리는 여타 신하들과 대비되면서 충을 실현하려는 그의 의지를 확연히 보여 준다. 토끼를 놓친 후에도 별주부는 자신의 충성이 부족함을 원망하고, 자신의 안위보다는 용왕과 사직의 안위를 걱정한다. 이처럼 별주부는 유교 사회의 전통 규범인 충을 드러내고 정당화하는 존재로서 유교적 규범의 운반체와 같은 존재다. 즉 별주부는 용왕으로 표상되는 봉건 체제를 신봉하고 이를 고수하려는 보수적인 이념을 현시하고 있는 것이다.', '1111-11-11 00:00:00', '201116-e7f4f309-02fe-4263-97b9-e24d01d4d5e2.jpg', '별주부전.jpg', 13358, 2),
	(5, '구운몽', '김만중', '유교, 도교, 불교 등 한국인의 사상적 기반이 총체적으로 반영되어 있으며 불교의 공(空)사상이 중심을 이루고 있다. 성진이라는 불제자가 하룻밤의 꿈 속에서 온갖 부귀 영화를 맛보고 깨어나, 인간의 부귀 영화는 일장 춘몽에 불과하다는 것을 느껴 불법에 귀의하게 된다는 내용이다. <옥루몽>, <옥련몽>과 같은 조선시대 몽자류 소설의 효시에 해당한다. 중국으로 소개되어 청대에 구운루라는 소설로 다시 등장하기도 하였다. 현재 고등학교 국어(하) 교과서에는 그 내용이 옛 한글을 지금 한글로 옮긴 해석본으로 일부 등재되어 있으며, 한국방송통신대학교 국어국문학과 3학년 1학기 《고전소설강독》교과서에는 옛 한글로 쓴 소설이 전부 실려 있다. 잔치의 옛 말인 모꼬지라는 말이 나오는 등 옛 한글을 이해할 수 있는 사료이기도 하다.', '1687-01-01 00:00:00', '201116-17542025-53c9-49ae-a441-39c9939ba826.jpg', '구운몽전.jpg', 12721, 1),
	(6, '난중일기', '이순신', '조선 중기의 무신으로서 임진왜란에서 조선의 수군을 지휘해 한산도, 명량 등지에서 왜병을 격퇴하고 전란의 전세를 조선의 승리로 이끌어, 사후 조선 조정으로부터 충무공(忠武公)의 시호를 받았던 여해(汝諧) 이순신이 임진왜란이 발발하는 조선 선조 25년(1592년) 음력 1월 1일(양력 2월 13일)부터 노량해전(露梁海戦)에서 전사하기 이틀 전인 선조 31년(1598년) 음력 9월 17일(양력 10월 16일)까지의 2,539일간의 군중에서의 생활과 전란의 정세에 대해 보고 들은 내용을 적은 일기이다.', '1592-01-01 00:00:00', '201116-5fa4d3db-b6b4-48e1-98be-394b591aac90.jpg', '난중일기.jpg', 553775, 2),
	(7, '삼국유사', '일연', '삼국유사에는 삼국과 가락국(駕洛國 : 가야)의 왕대와 연대, 고조선 이하 여러 고대 국가의 흥망·신화·전설·신앙 및 역사, 불교에 관한 기록, 고승들에 대한 설화, 밀교 승려들에 대한 행적, 고승들의 행정, 효행을 남긴 사람들의 이야기 등이 수록되어 있다. 삼국유사에 실려있는 모든 설화는 삼국 시대의 것이지만, 유동하던 이야기가 고려 시대에 와서 문자로 정착된 것이다. 따라서 흘러 다니던 설화의 내용이 일연이라는 개인에 의해 작품화된 셈이므로 고려의 설화문학으로 취급될 수 있다. 삼국유사에 수록된 설화의 주제는 주로 신라와 불교를 중심으로 편찬되어 있다. 고대사 연구에서 《삼국사기》와 더불어 쌍벽을 이루고 있다. 특히 단군 신화를 비롯하여 이두로 쓰인 향가 14수가 기록되어 있어 국어 국문학 연구에 좋은 자료가 된다. 특히, 향가는 《균여전》에만 11수(首)가 수록되어 있을 뿐, 다른 전적에는 전혀 전하지 않기 때문에 향가 연구에서 삼국유사는 특히 중요한 역할을 한다. 또한 《제왕운기》와 더불어 단군 신화를 전하는 유일한 기록으로 고려 후기, 대몽항쟁 과정에서 급부상한 단군 신앙과 동족 의식을 반영한다.', '1281-01-01 00:00:00', '201116-99e5b14c-23e5-4a69-9691-cdb84f6862f6.jpg', '삼국유사.jpg', 35310, 2),
	(8, '옹고집전', '작자미상', '옛날 황해도(黃海道) 옹정, 옹연(雍井, 雍淵)에 위치한 마을인 옹진(雍眞)골 옹당촌(雍堂村)에 옹고집(壅固執)이라는 남자가 살고 있었다. 옹고집은 인색한 성격, 고약한 성격을 가진 욕심쟁이로서 고집이 세고 심술이 사나운 부자였다. 이 때문에 옹고집은 자신의 늙은 어머니를 차가운 골방에 가두고, 머슴하고 일꾼을 한시도 쉬지 못하게 들볶기만 했다. 그리고 중이나 거지가 구걸을 하러 오면 온갖 횡포를 부려 얼씬도 못하게 했다.\r\n\r\n어느날 월출봉 비치암에 사는 도사가 학대사(鶴大師)라는 승려에게 옹고집을 질책하라는 명령을 내리고 학대사를 옹고집이 사는 집으로 보낸다. 그렇지만 학대사는 옹고집의 하인한테 매를 맞고 사찰로 돌아오게 된다. 이에 분노한 도사는 짚을 이용해서 허수아비를 만들게 된다. 도사가 허수아비에 부적을 붙였더니 허수아비가 가짜 옹고집으로 변하게 된다.', '1111-11-11 00:00:00', '201116-c1e03444-9ce4-43ef-a957-cc24f54bcecb.jpg', '옹고집전.jpg', 16627, 1),
	(9, '임꺽정전', '홍명희', '일제강점기 때 제작된 가장 방대한 규모의 대하장편역사소설로 봉단편·피장편·양반편·의형제편·화적편 등 5편으로 구성되었다. 봉단편·피장편·양반편에서는 화적패가 출몰하지 않을 수 없는 당시의 혼란상을 폭넓게 그려나가면서, 임꺽정의 일생을 중심으로 하여 그와 연관된 이봉학·박유복·배돌석·황천왕동이·곽오주·길막동이·서림 등 여러 인물들의 이력이 꼬리에 꼬리를 물고 이어진다. 그리고 의형제편은 여러 지역에 흩어져 살던 사람들이 특정한 계기를 통해 마침내 의형제가 되어 청석골에서 조직을 이루기까지의 과정을 담고 있다. 화적편은 그 후 이 집단이 벌이는 일련의 활동상이 그려져 있다.', '1940-10-01 00:00:00', '201116-8b0aae6f-f62c-47ba-a934-12caa07fb607.jpg', '임꺽정전.jpg', 86419, 1),
	(10, '홍길동전', '허균', '조선 세종 때 좌의정 홍상직(洪尙直)의 얼자로 태어난 홍길동(洪吉童)은 무예와 예의를 익혔으나 얼자로 태어나 자신의 뜻을 다 펴지 못함을 한탄한다. 홍길동은 홍상직과 시비(侍婢) 사이에 출생한 서얼이다. 한편, 홍 대감의 또 다른 첩이 보낸 자객에게 살해당할 위기를 모면한 길동은 집을 떠나 도적의 소굴로 가 재주를 보이고 우두머리가 된다. 무리의 이름을 활빈당이라 자칭하고 탐관오리와 패악하고 타락한 승려를 징치하여 전국에 이름이 알려지자 조정은 홍길동을 잡기 위해 군사를 동원한다.\r\n\r\n나라에서는 홍길동의 신기한 재주로 인해 도저히 잡을 수 없자, 아버지인 홍 대감을 회유하여 길동을 병조판서에 제수하려 하니 불러들이라 한다. 이에 임금 앞에 나타난 길동은 병조판서 제수를 사양하고 무리를 이끌고 나라를 떠날 것을 알리고 공중으로 몸을 띄워 홀연히 사라진다. 이후 길동은 어머니와 수하들을 이끌고 율도국으로 건너가 나라를 세운다.', '1800-01-01 00:00:00', '201116-a01cb2df-190d-4dfb-93b9-1c9f50655b15.jpg', '홍길동전.jpg', 31038, 2),
	(11, '사씨남정기', '김만중', '소설은 한림학사 유연수의 처 사씨의 바른 품행과 그녀를 시기하는 악한 첩 교씨가 그녀를 음해하기 위해 꾸미는 악행들, 그리고 소설 끝에 누명을 썼던 사씨가 귀양지에서 돌아오고 악행이 들통난 교씨는 처형당하는 권선징악 구조의 내용을 다루고 있다. 이 내용은 재미를 위해 만들어진 구성이라기보다는 당시 인현왕후를 내쫓고 희빈 장씨를 총애했던 숙종의 잘못을 지적하려는 목적을 가진 것으로 보이며, 궁녀가 이 소설을 숙종에게 읽어 준 뒤 숙종이 인현왕후를 복위하게 했다는 일화가 이를 뒷받침한다. 본래 한글로 지어진 사씨남정기를 김춘택은 한문으로 번역했으며 이를 궁궐에 들어갈 기회가 생기자 궁녀들에게 공짜로 나눠주었다.', '1111-11-11 00:00:00', '201116-44f7e4aa-a85d-4834-a987-27b89a7a4ad7.jpg', '사씨남정기.jpg', 217614, 1);
/*!40000 ALTER TABLE `books` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
	('TM88iQq35NwLDoJdk47gUTxJQtWG0xTA', 1605946579, '{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"}}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `userid` varchar(24) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userpw` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usermail` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `level` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `userid`, `userpw`, `username`, `usermail`, `wdate`, `level`) VALUES
	(1, '12345678', '$2b$08$sQtKR1eTc.WCBRipnq4yFOP6ibhfaEj3gOfqcKFZjpjQYcFwXA7lO', '이지홍', '123456@naver.com', '2020-11-20 09:47:58', 1),
	(2, '123456789', '$2b$08$16z6EjO3aEaWBsgRbiH0zO.v4EXXomwKUgbvZ8WOGv.KezbnOyfaC', '123456789', '123456789@naver.com', '2020-11-20 12:40:33', 1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;