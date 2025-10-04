import { describe, it, before } from "mocha";
import { expect } from "chai";

let authTokenOwner, authTokenMember;
let ownerId, memberId;
let groupId, inviteId, showtimeId;
let movieId; // optional for movie tests

// Helper function to create random test users
const createTestUser = () =>
{
    const randomSuffix = Math.floor(Math.random() * 100000000000);
    const randomSuffix2 = Math.floor(Math.random() * 100000000000);
    const timestamp = Date.now();
    return {
        username: `tester${randomSuffix}`,
        email: `test${randomSuffix}@testing.com`,
        password: `Password${randomSuffix2}-${timestamp}`
    };
};

describe("Testing Groups", function()
{
    this.timeout(20000);

    const ownerUser = createTestUser();
    const memberUser = createTestUser();


    it("should sign up Owner", async () =>
    {
        const response = await fetch('http://localhost:3001/users/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: ownerUser }),
        });
        const data = await response.json();

        expect(response.status).to.equal(201);
        expect(data).to.include.all.keys(['id', 'email', 'username']);
        ownerId = data.id;
    });

    it("should sign in Owner", async () =>
    {
        const response = await fetch('http://localhost:3001/users/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: { identifier: ownerUser.email, password: ownerUser.password } }),
        });
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.include.all.keys(['token', 'id', 'email', 'username']);
        authTokenOwner = data.token;
    });

    it("should sign up Member", async () =>
    {
        const response = await fetch('http://localhost:3001/users/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: memberUser }),
        });
        const data = await response.json();

        expect(response.status).to.equal(201);
        expect(data).to.include.all.keys(['id', 'email', 'username']);
        memberId = data.id;
    });

    it("should sign in Member", async () =>
    {
        const response = await fetch('http://localhost:3001/users/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: { identifier: memberUser.email, password: memberUser.password } }),
        });
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.include.all.keys(['token', 'id', 'email', 'username']);
        authTokenMember = data.token;
    });

    it("Owner should create a new group", async () =>
    {
        const randomSuffix = Math.floor(Math.random() * 100000000000);
        const groupName = `Test Group ${randomSuffix}`;
        
        const response = await fetch('http://localhost:3001/groups/create', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokenOwner}`
            },
            body: JSON.stringify({ group: { name: groupName, description: "Initial description" } })
        });
        const data = await response.json();

        expect(response.status).to.equal(201);
        expect(data).to.include.keys(['id', 'name', 'description', 'owner']);
        groupId = data.id;
    });

    it("Owner should modify group description", async () =>
    {
        const response = await fetch('http://localhost:3001/groups/modify-description', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokenOwner}`
            },
            body: JSON.stringify({ groupId, newDescription: "Updated description" })
        });
        const data = await response.json();
        expect(response.status).to.equal(200);
        expect(data.description).to.equal("Updated description");
    });

    it("Member should send join request", async () =>
    {
        const response = await fetch('http://localhost:3001/groups/invite/join', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokenMember}`
            },
            body: JSON.stringify({ id: groupId })
        });
        const data = await response.json();
        expect(response.status).to.equal(201);
        inviteId = data.id;
    });

    it("Owner should accept invite", async () =>
    {
        const response = await fetch('http://localhost:3001/groups/invite/accept', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokenOwner}`
            },
            body: JSON.stringify({ inviteId })
        });
        const data = await response.json();
        expect(response.status).to.equal(200);
        expect(data.message).to.include("Invite accepted");
    });

    it("Member should leave the group", async () =>
    {
        const response = await fetch('http://localhost:3001/groups/leave', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokenMember}`
            },
            body: JSON.stringify({ groupId })
        });
        const data = await response.json();
        expect(response.status).to.equal(200);
        expect(data.message).to.include("You have left the group");
    });

    it("Owner should delete the group", async () =>
    {
        const response = await fetch(`http://localhost:3001/groups/${groupId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokenOwner}`
            }
        });
        const data = await response.json();
        expect(response.status).to.equal(200);
        expect(data.message).to.include("Group deleted");
    });

    it('should delete Owner user', async () =>
    {
        const response = await fetch('http://localhost:3001/users/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authTokenOwner}`,
            },
            body: JSON.stringify({ password: ownerUser.password }),
        });
        const data = await response.json();
    
        expect(response.status).to.equal(200);
        expect(data).to.have.property('deletedUser');
        expect(data.deletedUser).to.have.property('id');
    });
        
    it('should delete Member user', async () =>
    {
        const response = await fetch('http://localhost:3001/users/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authTokenMember}`,
            },
            body: JSON.stringify({ password: memberUser.password }),
        });
        const data = await response.json();
    
        expect(response.status).to.equal(200);
        expect(data).to.have.property('deletedUser');
        expect(data.deletedUser).to.have.property('id');
    });
        
});
