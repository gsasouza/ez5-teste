const chai = require('chai')
const app = require('../../server')

chai.use(require('chai-http'))
chai.should()

// /**
//  * An helper to reeuse the code for asks and bids filter tests
//  * @param {String} type Order type
//  */
// const filterTests = (type) => {


//   it('Should get only asks data and only values between the search criterias', (done) => {
//     chai.request(app).get('/api/order_book?type=asks&minValue=5000&maxValue=12000').end((err, res) => {
      
//     })
//   })

// }

describe('Order Books', () => {
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

    it('Should get only asks data', (done) => {
      chai.request(app).get('/api/order_book?type=asks').end((err, res) => {
        res.status.should.be.eql(200)
        res.body.should.have.property('status').eql(200)
        res.body.should.have.property('data').to.be.an('object').to.have.property('asks')
        done()
      })
    })

    it('Should get only asks data and only one exchage values', (done) => {
      const exchanges = ['ARN', 'B2U', 'BAS', 'BIV', 'BSQ', 'FLW', 'FOX', 'LOC', 'MBT', 'NEG', 'PAX']
      exchanges.forEach((exchange) => {
        chai.request(app).get(`/api/order_book?type=asks&exchange=${exchange}`).end((err, res) => {
          res.status.should.be.eql(200)
          res.body.should.have.property('status').eql(200)
          res.body.should.have.property('data').to.be.an('object').to.have.property('asks')
          res.body.asks.should.be.an('string')
          res.body.asks.forEach((e) => e[0].should.be.eql(exchange))
        })
      })
      done()
    })

    it('Should get only bids data', (done) => {
      chai.request(app).get('/api/order_book?type=bids').end((err, res) => {
        res.status.should.be.eql(200)
        res.body.should.have.property('status').eql(200)
        res.body.should.have.property('data').to.be.an('object').to.have.property('bids')
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
    it('Should get only bids data and only one exchage values', (done) => {
      const exchanges = ['ARN', 'B2U', 'BAS', 'BIV', 'BSQ', 'FLW', 'FOX', 'LOC', 'MBT', 'NEG', 'PAX']
      exchanges.forEach((exchange) => {
        chai.request(app).get(`/api/order_book?type=bids&exchange=${exchange}`).end((err, res) => {
          res.status.should.be.eql(200)
          res.body.should.have.property('status').eql(200)
          res.body.should.have.property('data').to.be.an('string').to.have.property('bids')
          res.body.data.bids.should.be.an('string')
          res.body.data.bids.forEach((e) => e[0].should.be.eql(exchange))
        })
      })
      done()
    })

  })
})
