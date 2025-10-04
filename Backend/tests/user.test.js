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