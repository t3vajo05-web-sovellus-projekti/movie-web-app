import { describe, it } from 'mocha';
import { expect } from 'chai';

describe('Testing user management', function () {
  this.timeout(10000);

  const randomSuffix = Math.floor(Math.random() * 100000000000);
  const randomSuffix2 = Math.floor(Math.random() * 100000000000);
  const timestamp = Date.now();
  const newUser = {
      username: `tester${randomSuffix}`,
      email: `test${randomSuffix}@testing.com`,
      password: `Password${randomSuffix2}-${timestamp}`
  };

  console.log('Testing user management with user:', newUser);

  let createdUserId;
  let authToken;

  it('should sign up', async () => {
    const response = await fetch('http://localhost:3001/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: newUser }),
    });
    const data = await response.json();

    expect(response.status).to.equal(201);
    expect(data).to.include.all.keys(['id', 'email', 'username']);
    expect(data.email).to.equal(newUser.email);

    createdUserId = data.id;
  });

  it('should not sign up w/o username', async () => {
    const { username, ...withoutUsername } = newUser;
    const response = await fetch('http://localhost:3001/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: withoutUsername }),
    });
    const data = await response.json();

    expect(response.status).to.equal(400);
    expect(data).to.have.property('error');
    expect(data.error).to.include('username');
  })

  it('should not sign up w/o password', async () => {
    const { password, ...withoutPassword } = newUser;
    const response = await fetch('http://localhost:3001/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: withoutPassword }),
    });
    const data = await response.json();
    expect(response.status).to.equal(400);
    expect(data).to.have.property('error');
    expect(data.error).to.include('password');
  })

  it('should not sign up, too long password', async () => {
    const longPasswordUser = { ...newUser, password: '1P'.repeat(256) };
    const response = await fetch('http://localhost:3001/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: longPasswordUser }),
    });
    const data = await response.json();
    expect(response.status).to.equal(400);
    expect(data).to.have.property('error');
    expect(data.error).to.include('Password must be less than 255 characters');
  })

  it('should sign in', async () => {
    const response = await fetch('http://localhost:3001/users/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: { identifier: newUser.email, password: newUser.password } }),
    });
    const data = await response.json();

    expect(response.status).to.equal(200);
    expect(data).to.include.all.keys(['token', 'id', 'email', 'username']);
    expect(data.token).to.be.a('string').and.have.length.greaterThan(20);
    expect(data.email).to.equal(newUser.email);
    expect(data.username).to.equal(newUser.username);
    expect(data.id).to.be.a('number');

    authToken = data.token;
  });

  it('should not sign in, wrong username', async () => {
    const response = await fetch('http://localhost:3001/users/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: { identifier: 'wrong'+newUser.username, password: newUser.password } }),
    });
    const data = await response.json();
    expect(response.status).to.equal(404);
    expect(data).to.have.property('error');
    expect(data.error).to.include('User not found');
  })

  it('should delete user', async () => {
    const response = await fetch('http://localhost:3001/users/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ password: newUser.password }),
    });
    const data = await response.json();

    expect(response.status).to.equal(200);
    expect(data).to.have.property('deletedUser');
    expect(data.deletedUser).to.have.property('id');
  });
});

describe('Testing Movie Reviews', function ()
{
  // Creates a test user, tests reviews and deletes the test user
    this.timeout(10000);

    const testReview = {
        movie_id: "268",
        review_text: 'This is a test review for movie 268'
    };

    const randomSuffix = Math.floor(Math.random() * 100000000000);
    const randomSuffix2 = Math.floor(Math.random() * 100000000000);
    const timestamp = Date.now();
    const newUser = {
        username: `tester${randomSuffix}`,
        email: `test${randomSuffix}@testing.com`,
        password: `Password${randomSuffix2}-${timestamp}`
    };
  
    console.log('Testing Movie Reviews with user:', newUser);

    let createdReviewId;

    let createdUserId;
    let authToken;

    it('should sign up', async () => {
      const response = await fetch('http://localhost:3001/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: newUser }),
      });
      const data = await response.json();
  
      expect(response.status).to.equal(201);
      expect(data).to.include.all.keys(['id', 'email', 'username']);
      expect(data.email).to.equal(newUser.email);
  
      createdUserId = data.id;
    });

    it('should sign in', async () => {
      const response = await fetch('http://localhost:3001/users/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: { identifier: newUser.email, password: newUser.password } }),
      });
      const data = await response.json();
  
      expect(response.status).to.equal(200);
      expect(data).to.include.all.keys(['token', 'id', 'email', 'username']);
      expect(data.token).to.be.a('string').and.have.length.greaterThan(20);
      expect(data.email).to.equal(newUser.email);
      expect(data.username).to.equal(newUser.username);
      expect(data.id).to.be.a('number');
  
      authToken = data.token;
    });

    it('should return all reviews', async () =>
      {
          const response = await fetch('http://localhost:3001/reviews/');
          const data = await response.json();
  
          expect(response.status).to.equal(200);
          expect(data).to.be.an('array');
      });
  
      it('should create a review for Batman (Movie ID 268)', async () =>
      {
          const response = await fetch('http://localhost:3001/reviews/review', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${authToken}`
              },
              body: JSON.stringify(testReview)
          });
  
          const data = await response.json();
  
          expect(response.status).to.equal(201);
          expect(data).to.include.all.keys(['id', 'user_id', 'movie_id', 'review_text', 'created']);
          expect(data.movie_id).to.equal(testReview.movie_id);
          expect(data.review_text).to.equal(testReview.review_text);
  
          createdReviewId = data.id;
      });
  
      it('should return reviews by movie id 268', async () =>
      {
          const response = await fetch(`http://localhost:3001/reviews/movie/${testReview.movie_id}`);
          const data = await response.json();
  
          expect(response.status).to.equal(200);
          expect(data).to.be.an('array');
          expect(data.some(r => r.id === createdReviewId)).to.be.true;
      });
  
      it('should return 200 but empty array for invalid movie id', async () =>
      {
          const response = await fetch('http://localhost:3001/reviews/movie/99999999999999999999');
          const data = await response.json();
  
          expect(response.status).to.equal(200);
          expect(data).to.be.an('array').that.is.empty;
      });
  
      it('should return reviews by test user id', async () =>
      {
          const response = await fetch(`http://localhost:3001/reviews/user/${createdUserId}`);
          const data = await response.json();
  
          expect(response.status).to.equal(200);
          expect(data).to.be.an('array');
          expect(data.some(r => r.id === createdReviewId)).to.be.true;
      });
  
      it('should return latest reviews by movie id 268 with limit 5', async () =>
      {
          const response = await fetch(`http://localhost:3001/reviews/movie/${testReview.movie_id}/latest?limit=5`);
          const data = await response.json();
  
          expect(response.status).to.equal(200);
          expect(data).to.be.an('array');
          expect(data.length).to.be.at.most(5);
      });
  
      it('should delete the test review', async () =>
      {
          const response = await fetch(`http://localhost:3001/reviews/${createdReviewId}`, {
              method: 'DELETE',
              headers: {
                  'Authorization': `Bearer ${authToken}`
              }
          });
  
          const data = await response.json();
  
          expect(response.status).to.equal(200);
          expect(data).to.have.property('message', 'Review deleted successfully');
      });

      it('should delete user', async () => {
        const response = await fetch('http://localhost:3001/users/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ password: newUser.password }),
        });
        const data = await response.json();
    
        expect(response.status).to.equal(200);
        expect(data).to.have.property('deletedUser');
        expect(data.deletedUser).to.have.property('id');
      });
  });