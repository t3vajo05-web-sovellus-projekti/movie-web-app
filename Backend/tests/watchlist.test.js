import { describe, it } from 'mocha';
import { expect } from 'chai';

describe('Testing User Watchlist', function ()
{
    this.timeout(10000);

    const randomSuffix = Math.floor(Math.random() * 100000000000);
    const randomSuffix2 = Math.floor(Math.random() * 100000000000);
    const timestamp = Date.now();
    const newUser = {
        username: `tester${randomSuffix}`,
        email: `test${randomSuffix}@testing.com`,
        password: `Password${randomSuffix2}-${timestamp}`
    };

    let createdUserId;
    let authToken;
    let watchlistItemId;
    const testMovieId = "286";

    it('should sign up', async () =>
    {
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

    it('should sign in', async () =>
    {
        const response = await fetch('http://localhost:3001/users/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: { identifier: newUser.email, password: newUser.password } }),
        });
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.include.all.keys(['token', 'id', 'email', 'username']);
        authToken = data.token;
    });

    it('should return an empty array for a new user', async () =>
    {
        const response = await fetch('http://localhost:3001/watchlist/', {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('array').that.is.empty;
    });

    it('should add movie id 286 with status Plan to watch', async () =>
    {
        const response = await fetch(`http://localhost:3001/watchlist/${testMovieId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ status: 'Plan to watch' })
        });
        const data = await response.json();

        expect(response.status).to.equal(201);
        expect(data).to.include.all.keys(['id', 'user_id', 'movie_id', 'status']);
        expect(data.movie_id).to.equal(testMovieId);
        expect(data.status).to.equal('Plan to watch');

        watchlistItemId = data.id;
    });

    it('should find the movie 286 in the user’s own Watchlist', async () =>
    {
        const response = await fetch('http://localhost:3001/watchlist/', {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data.some(i => i.movie_id === testMovieId)).to.be.true;
    });

    it('should favorite the movie 286', async () =>
    {
        const response = await fetch(`http://localhost:3001/watchlist/item/${testMovieId}/favorite`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data.favorite).to.equal(true);
    });

    it('should modify the status to Watched', async () =>
    {
        const response = await fetch(`http://localhost:3001/watchlist/item/${watchlistItemId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ status: 'Watched' })
        });
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data.status).to.equal('Watched');
    });

    it('should remove the movie from Watchlist but keep it as favorited', async () =>
    {
        const response = await fetch(`http://localhost:3001/watchlist/${testMovieId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        const data = await response.json();
    
        expect(response.status).to.equal(201);
    });      

    it('should get the user’s Watchlist and confirm movie 286 is still found with status Favorited only', async () =>
    {
        const response = await fetch('http://localhost:3001/watchlist/', {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();

        expect(response.status).to.equal(200);
        const item = data.find(i => i.movie_id === testMovieId);
        expect(item).to.exist;
        expect(item.favorite).to.be.true;
        expect(item.status).to.equal('Favorited only');
    });

    it('should unfavorite the movie 286, removing it from the Watchlist', async () =>
    {
        const response = await fetch(`http://localhost:3001/watchlist/item/${testMovieId}/favorite`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();

        expect(response.status).to.equal(200);
    });

    it('should get the Watchlist and confirm movie 286 is removed', async () =>
    {
        const response = await fetch('http://localhost:3001/watchlist/', {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data.some(i => i.movie_id === testMovieId)).to.be.false;
    });

    it('should try to delete a non-existing movie and handle gracefully', async () =>
    {
        const response = await fetch(`http://localhost:3001/watchlist/999999`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();

        expect([200,201,404]).to.include(response.status);
    });

    it('should delete the test user', async () =>
    {
        const response = await fetch('http://localhost:3001/users/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({ password: newUser.password }),
        });
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.have.property('deletedUser');
    });
});
