const request = require('supertest');
const app = require('../server');
const newProduct = require('./data/new-product.json');

let firstProduct;

describe("회원가입: POST /signin", () => {
    it("회원가입 테스트", async () => {
        const response = await request(app)
            .post("/signin")
            .send({id:"aogagdofibaodag", pw:"1234"})
        expect(response.text).toBe("<script>alert('회원가입 완료'); window.location.replace('/');</script>")
    })
    it("중복id 에러 테스트", async () => {
        const response = await request(app)
            .post("/signin")
            .send({id:"minha", pw:"1234"})
        expect(response.statusCode).toBe(403);
        expect(response.text).toBe("<script>alert('중복 id입니다'); javascript:history.back();</script>")
    })
    it("id를 입력하지 않은 경우", async () => {
        const response = await request(app)
            .post('/signin')
            .send({ pw: "1234" })
        expect(response.statusCode).toBe(500);
        expect(response.body).toStrictEqual({ message: "User validation failed: id: Path `id` is required.", })
    })
})

describe("게시물조회: GET /", () => {
    it("메인페이지", async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    })

    it("상세페이지", async () => {
        const response = await request(app).get('/detail/1')
        expect(response.statusCode).toBe(200)
    })

    it("없는 게시물을 조회했을 때", async () => {
        const response = await request(app).get('/detail/94565151654886')
        expect(response.statusCode).toBe(500);
    })
})