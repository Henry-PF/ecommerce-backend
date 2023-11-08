const {usuarios,personas} = require("../db");
const { Op } = require("sequelize");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");