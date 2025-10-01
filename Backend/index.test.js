import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import { initializeTestDB } from './helper/test.js';

describe('Testing user management', function () {
  this.timeout(10000);

  before(async () => {
    await initializeTestDB();
  });

  const newUser = {
    username: 'tester',
    email: 'test1@testing.com',
    password: 'Password123',
  };

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
  });

  it('should sign in', async () => {
    const response = await fetch('http://localhost:3001/users/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: { identifier: newUser.email, password: newUser.password },
      }),
    });
    const data = await response.json();

    expect(response.status).to.equal(200);
    expect(data).to.include.all.keys(['token', 'id', 'email', 'username']);
    expect(data.token).to.be.a('string').and.have.length.greaterThan(20);
    expect(data.email).to.equal(newUser.email);
    expect(data.username).to.equal(newUser.username);
    expect(data.id).to.be.a('number');
  });
});