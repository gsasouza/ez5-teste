const chai = require('chai')
const app = require('../../server')
const controller = require('./controller')
const testData = require('./mock.js')

chai.use(require('chai-http'))
chai.should()

describe('Order Books', () => {

  describe('Middlewares Tests', () => {

    it('Should not found a route', (done) => {
      chai.request(app).get('/api/error').end((err, res) => {
        res.status.should.be.eql(404)
        res.body.should.have.property('status').eql(404)
        done()
      })
    })
  })

  describe('Get Data -> /GET /api/order_book', () => {

    it('Should get some data', (done) => {
      chai.request(app).get('/api/order_book').end((err, res) => {
        res.status.should.be.eql(200)
        res.body.should.have.property('status').eql(200)
        res.body.should.have.property('data').to.be.an('object')
        res.body.data.should.have.property('bids')
        res.body.data.should.have.property('asks')
        done()
      })
    })

    it('Should get empty data', (done) => {
      chai.request(app).get('/api/order_book?type=err').end((err, res) => {
        res.status.should.be.eql(200)
        res.body.should.have.property('status').eql(200)
        res.body.should.have.property('data').to.be.an('object').eql({})
        done()
      })
    })

    it('Should get only asks data', (done) => {
      chai.request(app).get('/api/order_book?type=asks').end((err, res) => {
        res.status.should.be.eql(200)
        res.body.should.have.property('status').eql(200)
        res.body.should.have.property('data').to.be.an('object').to.have.property('asks')
        done()
      })
    })

    it('Should get only asks data and only one exchange values', (done) => {
      const exchanges = ['ARN', 'B2U', 'BAS', 'BIV', 'BSQ', 'FLW', 'FOX', 'LOC', 'MBT', 'NEG', 'PAX']
      const exchange = exchanges[Math.floor(Math.random() * 11) + 1]
      chai.request(app).get(`/api/order_book?type=asks&exchange=${exchange}`).end((err, res) => {
        res.status.should.be.eql(200)
        res.body.should.have.property('status').eql(200)
        res.body.should.have.property('data').to.be.an('object').to.have.property('asks')
        res.body.data['asks'].forEach((e) => e[0].should.be.eql(exchange))
        done()
      })
    })

    it('Should get only bids data', (done) => {
      chai.request(app).get('/api/order_book?type=bids').end((err, res) => {
        res.status.should.be.eql(200)
        res.body.should.have.property('status').eql(200)
        res.body.should.have.property('data').to.be.an('object').to.have.property('bids')
        done()
      })
    })

    it('Should get only bids data and only one exchange values', (done) => {
      const exchanges = ['ARN', 'B2U', 'BAS', 'BIV', 'BSQ', 'FLW', 'FOX', 'LOC', 'MBT', 'NEG', 'PAX']
      const exchange = exchanges[Math.floor(Math.random() * 11) + 1]
      chai.request(app).get(`/api/order_book?type=bids&exchange=${exchange}`).end((err, res) => {
        res.status.should.be.eql(200)
        res.body.should.have.property('status').eql(200)
        res.body.should.have.property('data').to.be.an('object').to.have.property('bids')
        res.body.data['bids'].forEach((e) => e[0].should.be.eql(exchange))
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
      const exchanges = ['ARN', 'B2U', 'BAS', 'BIV', 'BSQ', 'FLW', 'FOX', 'LOC', 'MBT', 'NEG', 'PAX']
      const exchange = exchanges[Math.floor(Math.random() * 11) + 1]
      testData['bids'].filter(controller.filterData({exchange})).forEach((value) => value[0].should.be.eql(exchange))
      done()
    })
  })
})
