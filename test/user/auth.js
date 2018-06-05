const supertest = require('supertest');
const app = require('../../server');
const mongoose = require('mongoose');

require('dotenv').config();

const User = mongoose.model('User');

const { expect } = require('chai');

const request = supertest(app);

describe('User authenticator', () => {
  const userDetails = {
    email: 'jeremiaholufayo@gmail.com',
    password: 'olufayo'
  };

    // run once before tests
  before((done) => {
    mongoose.connect(process.env.CFH_TESTDB, () => {
      const user = new User(userDetails);
      user.save();
      done();
    });
  });

  // run once after tests
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });

  it('should not signin a user without email', (done) => {
    request
      .post('/api/auth/login')
      .send({
        password: 'olufayo'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body).to.have.property('error')
          .eql('Your Email Address is required');
        // expect(res.body[0].message).to.equal('Your Email Address is required');
        // expect(res.body[1].message).to.equal('Provide a valid Email Address');
        done();
      });
  });

  it('should not signin a user without password', (done) => {
    request
      .post('/api/auth/login')
      .send({
        email: 'jeremiaholufayo@gmail.com'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body).to.have.property('error')
          .eql('Your Password is required');
        // expect(res.body).to.be.an('array');
        // expect(res.body[0].message).to.equal('Your Password is required')
        done();
      });
  });

  it('should not signin a user with an invalid email', (done) => {
    request
      .post('/api/auth/login')
      .send({
        email: 'jeremiaholufayogmail.com'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body).to.have.property('error')
          .eql('Provide a valid Email Address');
        // expect(res.body).to.be.an('array');
        // expect(res.body).to.equal('Provide a valid Email Address')
        done();
      });
  });

  it('should not signin a user with wrong details', (done) => {
    request
      .post('/api/auth/login')
      .send({
        email: 'jeremiaholufayo@gmail.com',
        password: 'jerry'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.error).to.equal('Username or Password Incorrect');
        done();
      });
  });

  it('should signin a user with correct details', (done) => {
    request
      .post('/api/auth/login')
      .send({
        email: 'jeremiaholufayo@gmail.com',
        password: 'olufayo'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.message).to.equal('Successfully SignIn');
        expect(res.body.token).to.not.equal(null);
        done();
      });
  });

  it('should signup a user with correct details', (done) => {
    request
      .post('/api/auth/signup')
      .send({
        name: 'i sam',
        email: 'isam@gmail.com',
        password: 'olufayo'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.message).to.equal('User successfully registered');
        expect(res.body.token).to.not.equal(null);
        done();
      });
  });

  it('should not signup a user without name', (done) => {
    request
      .post('/api/auth/signup')
      .send({
        name: null,
        email: 'isam@gmail.com',
        password: 'olufayo'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.name).to.not.equal(null);
        done();
      });
  });

  it('should not signup a user without email', (done) => {
    request
      .post('/api/auth/signup')
      .send({
        name: 'hey there',
        email: null,
        password: 'olufayo'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.email).to.not.equal(null);
        done();
      });
  });

  it('should not signup a user without password', (done) => {
    request
      .post('/api/auth/signup')
      .send({
        name: 'i tech',
        email: 'isamt@gmail.com',
        password: null
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.password).to.not.equal(null);
        done();
      });
  });

  it('should not signup a user if user with email exists', (done) => {
    request
      .post('/api/auth/signup')
      .send({
        name: 'i tech',
        email: 'isam@gmail.com',
        password: 'theree'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(409);
        expect(res.body[0]).to.equal('Email is taken');
        done();
      });
  });

  it('should not signup a user if length of password is less than 6 characters', (done) => {
    request
      .post('/api/auth/signup')
      .send({
        name: 'i tech',
        email: 'isamh@gmail.com',
        password: 'the'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.password).to.not.equal(null);
        done();
      });
  });

  it('should not signup a user if email format is wrong', (done) => {
    request
      .post('/api/auth/signup')
      .send({
        name: 'i tech',
        email: 'isam@gmail',
        password: 'there'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        done();
      });
  });
});
