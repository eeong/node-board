# Node.js, Express를 활용한 게시판 웹 어플리케이션

### [링크](https://www.eeong.be)

## 스택

 - 백엔드  
	- Node.js, Express, Nginx

 - 데이터베이스  
	- Mysql

 - 퍼블리싱  
	- PUG(JADE), SCSS(SASS), Bootstrap, JavaScript

 - 관리  
	- Git

 - 배포  
	- AWS EC2

## 구조

 1. 도서 정보를 열람, 작성 할 수있는 웹 어플리케이션. 

 2. express 프레임워크로 서버단 작성.

 3. /book 요청을 받으면 데이터 베이스에서 도서목록을 불러오는 라우터를 설정한다.

 4. 도서목록을 불러오는 함수는 mysql2 모듈을 사용한다. 함수로 쿼리문을 작성하면 Pool을 만들어 데이터베이스에 요청을 보낸다. 비동기로 응답을 받아오고 release 후 값을 리턴한다.

 5. 도서정보를 받아 page설정에 따라 Pagination한다.

 6. 회원가입은 정규표현식으로 아이디, 비밀번호 검증 후, user/idcheck 미들웨어를 통해 데이터베이스에서 중복 아이디 검사를 진행한다. 검증이 통과되면 암호화 후 데이터베이스에 인서트 한다. 

 7. 로그인 기능은 passport모듈을 통해 local과 카카오 api 로그인으로 나누어 관리한다. 
	- local: 요청된 아이디를 통해 데이터베이스에서 불러온 유저정보를 암호화 비교과정 후 통과하면 로그인 시킨다.
	- kakao: kakao api에 아이디 비밀번호를 보내 토큰을 받아오면 로그인 시킨다. 별도의 개인정보는 받아오지 않도록 설정 하였다.
 
 8. 로그인 한 사용자는 글을 쓰거나 자신이 쓴 글을 수정할 수 있다. express-session, espress-mysql-session을 통해 사용자 세선을 유지, 데이터베이스에 저장 한다. 

 9. 게시글을 쓸 때 파일을 업로드 할 수 있도록 하였다. multer 모듈을 사용하여 지정된 확장자의 파일을 저장소에 업로드한다.
 
 10. morgan, rotating-file-stream 모듈을 사용하여 로깅처리.

 11. AWS EC2인스턴스에 mariaDB 설치.
 
 12. pm2로 Node 어플리케이션 실행.

 12. letsencrypt에서 인증서 받아와 ssl 인증, https 프로토콜로 접속할 수 있게 한다.

 13. 내 도메인 접속 시 Nginx 프록시 서버에서 해당 어플리케이션으로 포트 포워딩하여 연결.
