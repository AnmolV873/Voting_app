const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User  = require('./../models/user');
const db = require('../db');
const ErrorResponse = require("../lib/error.res");
const SuccessResponse = require('../lib/success.res');

async function createAdmin() {
    try {
        // Check if an admin user already exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        
        if (existingAdmin) {
            return ErrorResponse.conflict('Admin user already exists.');
        }

        // Define admin user details
        const adminData = {
            name: 'Gloryr',
            age: 30,
            mobile: '1234567890',
            address: '123 Admin Street',
            aadhar: 1234567897642,
            password: 'adminpassword',  // This password will be hashed due to pre-save middleware
            role: 'admin',
            ward: 'ward1'
        };

        // Create new admin user
        const adminUser = new User(adminData);
        await adminUser.save();

    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        mongoose.connection.close();  // Close the connection after seeding
    }
}

// Connect to the database and run the seeder
db.on('connected', createAdmin);
