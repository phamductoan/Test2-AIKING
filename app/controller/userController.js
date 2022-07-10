const bcrypt = require("bcrypt");
const userModel= require("../models/userModel");
const mongoose = require("mongoose");
const { request } = require("express");
const { response } = require("express");
const validatePasword = (password) => {
    return password.match(
        // Tối thiểu tám ký tự, ít nhất một chữ cái, một số và một ký tự đặc biệt
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    );
  };

const createUser = async (request, response) => {
    // B1: Thu thập dữ liệu
    let bodyRequest = request.body;

    // B2: Kiểm tra dữ liệu
    if(!bodyRequest.username) {
        return response.status(400).json({
            status: "Error 400: Bad Request",
            message: "username is required"
        })
    }
    if(!bodyRequest.email) {
        return response.status(400).json({
            status: "Error 400: Bad Request",
            message: "email is required"
        })
    }
 
    if(!bodyRequest.password) {
        return response.status(400).json({
            status: "Error 400: Bad Request",
            message: "password is required"
        })
    }
    if (!validatePasword(bodyRequest.password)) {
        return response.status(400).json({
            status: "Error 400: Bad Request",
            message: "password is not valid"
        })
    }

    // B3: Thao tác với cơ sở dữ liệu
    let user = new userModel(bodyRequest);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.save((error, doc) => {
        if(error) {
            response.status(500).json({
                status: "Error 500: Email đã được đăng ký",
                message: error.message
            })
        } else {
            response.status(201).send({
                status: "Success 201: Đăng ký thành công",
                doc: doc
            })
        }
    })
}

const logInUser = async (request, response) => {
    let bodyRequest = request.body;
    const user = await userModel.findOne({ email: bodyRequest.email });
    if (user) {
      const validPassword = await bcrypt.compare(bodyRequest.password, user.password);
      if (validPassword) {
        response.status(200).json({ status: "ok" });
      } else {
        response.status(400).json({ error: "Password không đúng!!!" });
      }
    } else {
        response.status(401).json({ error: "Email không đúng!!!" });
    }
}


module.exports = {
    createUser,
    logInUser
}