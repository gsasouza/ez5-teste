const chai = require('chai')
const app = require('../../server')
const controller = require('./controller')
const testData = require('./mock.js')

chai.use(require('chai-http'))
chai.should()

describe('Order Books', () => {
  describe('Get Data -> /GET /api/order_book', () => {
    it('Should get some data', (done) => {
      chai.request(app).get('/api/order_book').end((err, res) => {
        res.status.should.be.eql(200)
        res.body.should.have.property('status').eql(200)
        res.body.should.have.property('data').to.be.an('object')
        done()
      })
    })
    it('Should get empty data', (done) => {
      chai.request(app).get('/api/order_book?type=err').end((err, res) => {
        res.status.should.be.eql(200)
        res.body.should.have.property('status').eql(200)
        res.body.should.have.property('data').to.be.an('array').to.have.lengthOf(0)
        done()
      })
    })
  })
  describe('Filter Functions', () => {
    it('Should know if a number is in between two others or not', (done) => {
      const testNumbers = [
        [5, 10, 8, true],
        [5, 10, 5, true],
        [5, 10, 10, true],
        [null, 10, 8, true],
        [5, null, 8, true],
        [null, null, 8, true],
        [5, null, 3, false],
        [null, 10, 11, false],
        [5, 10, 11, false],
        [5, 10, 4, false]
      ]
      testNumbers.forEach((value) => {
        controller.isInBetween(...value).should.be.eql(value[3])
      })
      done()
    })
    it('Should filter data by exchange name', (done) => {
      const testExchange = 'FOX'
      testData['bids'].filter(controller.filterData({exchange: testExchange})).forEach((value) => {
        value[0].should.be.eql(testExchange)
      })
      done()
    })
  })
})