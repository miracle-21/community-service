## 📎 목차
1. [Service(수정: 2023.02.02)](#-service수정-20230202)
2. [개발 기간](#-개발-기간)
3. [개발 인원](#-개발-인원1명)
4. [구현사항](#-구현사항수정-20221222)
5. [추가 구현사항(수정: 2023.01.17)](#-추가-구현사항수정-20230117)
6. [기술 스택](#-기술-스택)
7. [API Endpoints](#-api-endpoints)
8. [유닛/통합테스트](#-유닛통합테스트20230117-진행과정)
9. [배포(2022.11.24)](#-배포20221124)
10. [결과(수정: 2022.11.25)](#-결과수정-20221125)

## 🚀 Service(수정: 2023.02.02)
- 커뮤니티 서비스

![](https://velog.velcdn.com/images/miracle-21/post/445391f8-6a6b-4f9f-88c4-b303986c48d4/image.png)

## 📆 개발 기간
- 기본 CRUD: 2022.11.17 ~ 2022.11.23
- 리팩토링 및 기능 추가: ~2023.02.02

## 🧑🏻‍💻 개발 인원(1명)
- 박민하

## 📝 구현사항(수정: 2022.12.22)
1. 로그인/회원가입
- 회원가입 시 비밀번호 암호화: bcrypt
- 아이디/비밀번호 오류 시 팝업
- 🚫로그인이 이미 된 회원은 로그인 버튼이 로그아웃으로 바뀌는 기능 필요
- 회원가입 완료 시 팝업
- 🚫비밀번호 제한을 위한 유효성검사 필요

2. home
- 읽기는 비회원/회원 모두 가능하다.

3. mypage
- 로그인 해야 사용 가능, 비로그인 시 팝업
- '사용자의 id'님의 페이지 라는 텍스트 출력
- 비동기 방식 삭제

4. write
- 🚫제목만 쓰고 엔터치면 글 등록이 됨 -> 수정 필요

5. 수정/삭제
- 작성자만 가능하며, 작성자가 아닌 경우에 팝업

6. 페이징
- 한 페이지에 게시물 10개씩 보이며, 수정 가능
- 페이지 번호도 전체 게시물 개수와 한 페이지에 보이는 게시물 수에 따라 바뀜

7. 검색
- 🚫 만약 '광고 글이다', '광고글이다' 라는 제목의 글이 있다고 하고, '광고'라고 검색했을 때 '광고글이다'는 제외된다 -> 수정 필요
- 🚫검색 결과창은 페이징 기능이 없다

## 🛠 추가 구현사항(수정: 2023.01.17)
| 날짜 | 내용 |
-- | --
2022.11.24 | 배포
2022.12.22 | server.js 라우터 분리
2023.01.07 | 조회수 기능 추가
2023.01.14 | mongoose 적용
2023.01.15 | 에러핸들링(try... catch), response.status 추가 
2023.01.17 | 유닛테스트, 통합테스트(진행중)

#### 1. 조회수 기능
- ip주소로 조회수 측정
- 게시물 조회 시 ip 주소와 게시물 id가 view collecion에 저장되고, 조회수가 1 증가.
- view collection에 저장된 ip 주소는 24시간이 지나면 삭제된다.
- 같은 ip를 사용하는 사용자는 게시물 하나 당 조회수 한 회만 증가시킬 수 있다.


## ✍ 기술 스택
Language | Platform | Framework | Database | Deloy
| :----------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------: 
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white"> | <img src="https://img.shields.io/badge/Node.js-10.19.0-339933?style=for-the-badge&logo=Node.js&logoColor=white"> | <img src="https://img.shields.io/badge/express-4.18.2-000000?style=for-the-badge&logo=express&logoColor=white"> </br> <img src="https://img.shields.io/badge/Bootstrap-5.2.2-7952B3?style=for-the-badge&logo=Bootstrap&logoColor=white"> | <img src="https://img.shields.io/badge/MongoDB-5.0.14-47A248?style=for-the-badge&logo=MongoDB&logoColor=white"> | <img src="https://img.shields.io/badge/navercloud-03C75A?style=for-the-badge&logo=naver&logoColor=white"> </br> <img src="https://img.shields.io/badge/nginx-1.18.0-009639?style=for-the-badge&logo=nginx&logoColor=white">


## 🎯 API Endpoints
| endpoint | HTTP Method | 기능 | 기타
|----------|-------------| ---  | --
|/ | GET | 메인페이지 | 
|/detail/:id | GET | 상세 페이지
|/search | GET | 작성글 제목 검색 
|/login | POST | 로그인
|/signin | POST | 회원가입
|/mypage | POST | 개인 회원 작성글 확인 페이지
|/write | POST | 게시물 작성 | 회원만 작성 가능
|/edit/:id | UPDATE | 게시물 수정 | 본인만 수정 가능
|/delete/:id | GET | 게시물 삭제 | 본인만 삭제 가능

## 🧪 유닛/통합테스트(2023.01.17 진행과정)
![](https://velog.velcdn.com/images/miracle-21/post/03d30f2f-fd74-4652-ad10-ad8f7291bf18/image.png)


## 🔖 배포(2022.11.24)
~~주소: http://223.130.134.185/~~(2023.2.2 서비스 종료)

![](https://velog.velcdn.com/images/miracle-21/post/81fc918c-a505-4235-8d0e-37bb93d5f3b8/image.png)


## 🔖 결과(수정: 2022.11.25)
![](https://velog.velcdn.com/images/miracle-21/post/f851da54-7ffe-4681-8e2b-6e3f005fd7e8/image.gif)
