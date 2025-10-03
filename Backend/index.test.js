import { describe, it } from 'mocha';
import { expect } from 'chai';

describe('Testing user management', function () {
  this.timeout(10000);

  const newUser = {
    username: 'tester',
    email: 'test1@testing.com',
    password: 'Password123',
  };

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