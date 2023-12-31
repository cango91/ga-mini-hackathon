const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const seed = require('./seed-database');
const Profile = require('../models/profile');
const MenuItem = require('../models/menuItem');
const { configureApp } = require('../server');
const request = require('supertest');
let app, token;

beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true });
    await seed();
    const user = await User.findOne({});
    token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '24h' });
    app = configureApp(async (req, res, next) => {
        req.user = user;
        next();
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("MenuItem Controller", () => {
    it("should allow search of menu items by name", async () => {
        const response = await request(app).get("/menu/search/?q=burg");
        expect(response.status).toEqual(200);
        const hamburger = await MenuItem.findOne({ name: 'Burger' });
        expect(hamburger._id.equals(response.body[0]._id)).toBeTruthy();
    });

    it("should search menu items by decription", async () => {
        const response = await request(app).get("/menu/search/?q=beef");
        expect(response.status).toEqual(200);
        const hamburger = await MenuItem.findOne({ name: 'Burger' });
        expect(hamburger._id.equals(response.body[0]._id)).toBeTruthy();
    });
});

describe("Profile Controller", () => {
    it("should save a favorite food", async () => {
        const pizza = await MenuItem.findOne({ name: new RegExp('pizza', 'i') });
        const response = await request(app)
            .post(`/profile/favorites?token=${token}`)
            .send({ menuItem: pizza._id.toString() });
        expect(response.status).toEqual(200);
        const profile = await Profile.findOne({});
        expect(profile.favItems.includes(pizza._id.toString())).toBeTruthy();
    });

    it("should not save the same item twice in favorites", async () => {
        const pizza = await MenuItem.findOne({ name: new RegExp('pizza', 'i') });
        const response1 = await request(app)
            .post(`/profile/favorites?token=${token}`)
            .send({ menuItem: pizza._id.toString() });
        expect(response1.status).toEqual(200);
        const response2 = await request(app)
            .post(`/profile/favorites?token=${token}`)
            .send({ menuItem: pizza._id.toString() });
        expect(response2.status).toEqual(200);
        const profile = await Profile.findOne({});
        expect(profile.favItems.length).toEqual(1);
    });

    it("should remove a saved favItem successfully", async () => {
        const pizza = await MenuItem.findOne({ name: new RegExp('pizza', 'i') });
        const burger = await MenuItem.findOne({ name: new RegExp('burger', 'i') });
        const response1 = await request(app)
            .post(`/profile/favorites?token=${token}`)
            .send({ menuItem: pizza._id.toString() });
        const response2 = await request(app)
            .post(`/profile/favorites?token=${token}`)
            .send({ menuItem: burger._id.toString() });

        expect(response1.status).toEqual(200);
        expect(response2.status).toEqual(200);

        let profile = await Profile.findOne({});
        expect(profile.favItems.length).toEqual(2);

        const deleteResponse = await request(app).delete(`/profile/favorites/${burger._id.toString()}?token=${token}`);
        expect(deleteResponse.status).toEqual(200);

        profile = await Profile.findOne({}).exec();
        expect(profile.favItems.length).toEqual(1);

        expect(profile.favItems.includes(burger._id)).toBeFalsy();
        expect(profile.favItems.includes(pizza._id)).toBeTruthy();

    });
});