## 📎 목차
1. [Service](#🚀-service)
2. [개발 기간](#📆-개발-기간)
3. [개발 인원](#🧑🏻‍💻-개발-인원1명)
4. [구현사항](#📝-구현사항)
5. [기술 스택](#🛠-기술-스택)
6. [API Endpoints](#🎯-api-endpoints)
7. [배포](#🔖-배포20221125)
8. [결과](#🔖-결과)


## 🚀 Service
- 커뮤니티 서비스

## 📆 개발 기간
- 2022.11.17 ~ 2022.11.23(5일)

## 🧑🏻‍💻 개발 인원(1명)
- 박민하

## 📝 구현사항
1. 로그인/회원가입
- 회원가입 시 비밀번호 암호화: bcrypt
- 아이디/비밀번호 오류 시 팝업
- 🚫로그아웃 버튼 없음 -> 로그인이 이미 된 회원은 로그아웃으로 버튼이 바뀌어야 한다 
- 회원가입 완료 시 팝업
- 🚫중복 아이디는 회원가입이 돼도 로그인이 안된다. 비밀번호 제한도 없다 -> 유효성검사 필요

2. home
- 읽기는 비회원/회원 모두 가능하다

3. mypage
- 로그인 해야 사용 가능, 비로그인 시 팝업
- '사용자의 id'님의 페이지 라는 텍스트 출력
- 🚫작성글이 한번에 보이고 바로 삭제하는 삭제 버튼 존재 -> 삭제하겠습니까? 라는 확인 팝업이 뜨면 좋을거같다

4. write
- 🚫제목만 쓰고 엔터치면 글 등록이 됨 -> 수정 필요

5. 수정/삭제
- 작성자만 가능하며, 작성자가 아닌 경우에 팝업

6. 페이징
- 한 페이지에 게시물 8개씩 보이며, 수정 가능
- 페이지 번호도 전체 게시물 개수와 한 페이지에 보이는 게시물 수에 따라 바뀜

7. 검색
- 🚫 만약 '광고 글이다', '광고글이다' 라는 제목의 글이 있다고 하고, '광고'라고 검색했을 때 '광고글이다'는 제외된다 -> 수정 필요
- 🚫검색 결과창은 페이징 기능이 없다

## 🛠 기술 스택
Language | Platform | Framework | Database |
| :----------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------: | 
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white"> | <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"> | <img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white"> </br> <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=Bootstrap&logoColor=white"> | <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white"> 


## 🎯 API Endpoints
| endpoint | HTTP Method | 기능 | 기타
|----------|-------------| ---  | --
|/ | GET | 메인페이지 | 
|/login | POST | 로그인
|/signin | POST | 회원가입
|/mypage | POST | 개인 회원 작성글 확인 페이지
|/write | POST | 게시물 등록
|/edit/:id | UPDATE | 게시물 수정 | 본인만 수정 가능
|/delete/:id | DELEETE | 게시물 삭제 | 본인만 삭제 가능

## 🔖 배포(2022.11.25)
주소: http://223.130.134.185/

![](https://velog.velcdn.com/images/miracle-21/post/81fc918c-a505-4235-8d0e-37bb93d5f3b8/image.png)


## 🔖 결과
![](https://velog.velcdn.com/images/miracle-21/post/2e8ab5ae-6266-40ad-8719-bf8fbfa756b8/image.gif)