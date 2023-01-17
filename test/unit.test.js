const controller = require('../routes/controller');
const httpMocks = require('node-mocks-http');
const postModel = require('../models/post');
const counterModel = require('../models/counter');
const viewModel = require('../models/view');
const userModel = require('../models/user');
const newProduct = require('./data/new-product.json'); //가짜데이터: 데이터 1개

postModel.create = jest.fn();
postModel.find = jest.fn();
postModel.findById = jest.fn();
counterModel.updateOne = jest.fn();
counterModel.findOne = jest.fn();
viewModel.findOne = jest.fn();

const productId = "5diijfdsijdfhuehwufwe"; //임의ID 암거나

let req, res, next
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
})


describe("GET: 메인페이지", () => {
  it("getDetailPost 함수 테스트", () => {
    expect(typeof controller.getPosts).toBe("function")
  })

  it("postModel: 게시물 조회)", async () => {
    await controller.getPosts(req, res, next);
    expect(postModel.find).toHaveBeenCalledWith({})
  })
  it("정상 200 response", async () => {
    await controller.getPosts(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
  })
})

describe("GET: 상세페이지", () => {
  it("getDetailPost 함수 테스트", () => {
      expect(typeof controller.getDetailPost).toBe("function")
  })
})

describe("CREATE: 게시물 생성", () => {
  beforeEach(() => {
    req.body = newProduct;
  })
  it("createPost 함수 확인", () => {
    expect(typeof controller.createPost).toBe("function")
  })
})