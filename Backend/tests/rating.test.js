import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';

describe('Testing Movie Ratings', function ()
{
    this.timeout(15000);

    // Randomized test user
    const randomSuffix = Math.floor(Math.random() * 100000000000);
    const randomSuffix2 = Math.floor(Math.random() * 100000000000);
    const timestamp = Date.now();
    const testUser = {
        username: `tester${randomSuffix}`,
        email: `test${randomSuffix}@testing.com`,
        password: `Password${randomSuffix2}-${timestamp}`
    };

    let authToken;
    let createdUserId;
    let ratingId;
    const testMovieId = "286";


    it('should sign up', async () =>
    {
        const response = await fetch('http://localhost:3001/users/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: testUser })
        });
        const data = await response.json();

        expect(response.status).to.equal(201);
        expect(data).to.include.all.keys(['id', 'email', 'username']);
        expect(data.email).to.equal(testUser.email);

        createdUserId = data.id;
    });

    it('should sign in', async () =>
    {
        const response = await fetch('http://localhost:3001/users/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: { identifier: testUser.email, password: testUser.password } })
        });
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.include.all.keys(['token', 'id', 'email', 'username']);
        expect(data.token).to.be.a('string').and.have.length.greaterThan(20);

        authToken = data.token;
    });

    it('should return all ratings (array)', async () =>
    {
        const response = await fetch('http://localhost:3001/ratings/');
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('array');
    });

    it('should return 404 for ratings by new user', async () =>
    {
        const response = await fetch(`http://localhost:3001/ratings/user/${createdUserId}`);
        const data = await response.json();

        expect(response.status).to.equal(404);
        expect(data).to.have.property('error').that.includes('Ratings not found');
    });

    it('should return 404 for ratings by movie id with no ratings', async () =>
    {
        const response = await fetch(`http://localhost:3001/ratings/movie/${testMovieId}`);
        const data = await response.json();

        expect(response.status).to.equal(404);
        expect(data).to.have.property('error').that.includes('Ratings not found');
    });

    it('should return null for rating by user and movie id', async () =>
    {
        const response = await fetch(`http://localhost:3001/ratings/user/${createdUserId}/movie/${testMovieId}`);
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.null;
    });

    it('should create a new rating', async () =>
    {
        const response = await fetch('http://localhost:3001/ratings/rate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify({ movie_id: testMovieId, rating: 5 })
        });
        const data = await response.json();

        expect(response.status).to.equal(201);
        expect(data).to.include.all.keys(['id', 'user_id', 'movie_id', 'rating']);
        expect(data.movie_id).to.equal(testMovieId);
        expect(data.rating).to.equal(5);

        ratingId = data.id;
    });

    it('should fail to rate movie with invalid rating', async () =>
    {
        const response = await fetch('http://localhost:3001/ratings/rate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify({ movie_id: testMovieId, rating: 20 })
        });
        const data = await response.json();

        expect(response.status).to.equal(400);
        expect(data).to.have.property('error').that.includes('Rating cannot be under 0 or over 5');
    });

    it('should update existing rating', async () =>
    {
        const response = await fetch('http://localhost:3001/ratings/rate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify({ movie_id: testMovieId, rating: 4 })
        });
        const data = await response.json();

        expect(response.status).to.equal(201);
        expect(data.rating).to.equal(4);
    });

    it('should fetch rating by user and movie id', async () =>
    {
        const response = await fetch(`http://localhost:3001/ratings/user/${createdUserId}/movie/${testMovieId}`);
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data.rating).to.equal(4);
    });

    it('should fetch ratings by movie id', async () =>
    {
        const response = await fetch(`http://localhost:3001/ratings/movie/${testMovieId}`);
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('array');
        expect(data.some(r => r.id === ratingId)).to.be.true;
    });

    it('should fetch ratings by user id', async () =>
    {
        const response = await fetch(`http://localhost:3001/ratings/user/${createdUserId}`);
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data.some(r => r.id === ratingId)).to.be.true;
    });

    it('should fetch movie rating stats', async () =>
    {
        const response = await fetch(`http://localhost:3001/ratings/movie/stats/${testMovieId}`);
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.have.property('average_rating');
        expect(data).to.have.property('rating_count');
    });

    it('should delete rating', async () =>
    {
        const response = await fetch(`http://localhost:3001/ratings/${ratingId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.have.property('message', 'Rating deleted successfully');
    });

    it('should return null for rating after deletion', async () =>
    {
        const response = await fetch(`http://localhost:3001/ratings/user/${createdUserId}/movie/${testMovieId}`);
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.null;
    });

    it('should delete test user', async () =>
    {
        const response = await fetch('http://localhost:3001/users/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ password: testUser.password })
        });
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.have.property('deletedUser');
        expect(data.deletedUser).to.have.property('id');
    });
});
