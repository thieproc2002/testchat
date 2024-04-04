const jwt = require("jsonwebtoken");
const Account = require("../models/account");
const User = require("../models/user");
const AppError = require("../utils/appError");
const bcrypt = require("bcrypt");

//OKe
const createToken = (_id) => {
  return jwt.sign(
    {
      _id,
    },
    process.env.JWT_SECRET||'defaultSecret',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '2m',
    }
  );
};
//OKe
exports.login = async (req, res, next) => {
  try {
    const { phoneNumber, passWord } = req.body;
    if (!phoneNumber || !passWord) {
      return next(
        new AppError(401, "fail", "Please provide numberPhone or passWord"),
        req,
        res,
        next
      );
    }

    const _account = await Account.findOne({
      phoneNumber: phoneNumber,
    });

    if (!_account) {
      return next(
        new AppError(402, "fail", "Account does not exist "),
        req,
        res,
        next
      );
    }

    if (!(await _account.correctPassword(passWord, _account.passWord))) {
      return next(
        new AppError(403, "fail", "Password is wrong"),
        req,
        res,
        next
      );
    }

    const _user = await User.findOne({ accountID: _account });
    const _token = createToken(_user.id);

    let _data = {
      _id: _user.id,
      name: _user.fullName,
      avartar: _user.avatarLink,
      background: _user.backgroundLink,
    };
    res.status(200).json({
      status: "success",
      _token,
      data: _data,
    });
  } catch (err) {
    next(err);
  }
};
//Oke
exports.signup = async (req, res, next) => {
  try {
    const { phoneNumber, passWord, fullName, gender , role } =
      req.body;
    let _pathAvatar ;
    const _accountFind = await Account.findOne({
      phoneNumber: phoneNumber,
    });
    let _role = false;
    if(role == true){
      _role = true
    }
    if (_accountFind) {
      return next(
        new AppError(403, "fail", "PhoneNumber already exists "),
        req,
        res,
        next
      );
    }
    var vnf_regex = /((09|03|07|08|06|05)+([0-9]{8})\b)/g;
    if (vnf_regex.test(phoneNumber) == false) {
      return next(
        new AppError(404, "fail", "Please check your phone number!"),
        req,
        res,
        next
      );
    }
    const _account = await Account.create({
      phoneNumber: phoneNumber.trim(),
      passWord: await bcrypt.hash(passWord, 10),
    });
    const _user = await User.create({
      fullName: fullName,
      gender: gender,
      avatarLink: "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg",
      backgroundLink:"https://farm3.staticflickr.com/2936/14765026726_b8a02d3989.jpg",
      birthday: Date.now(),
      accountID: _account.id,
      role:_role
    });

    const _token = createToken(_user.id);

    _account.passWord = undefined;
    req.headers.authorization = _token;
    const _data = {
      _id: _user.id,
      fullName: _user.fullName,
      bio: _user.bio,
      gender: _user.gender,
      birthday: _user.birthday,
      status: _user.status,
      avatarLink: _user.avatarLink,
      backgroundLink: _user.backgroundLink,
      friends: _user.friends,
      phoneNumber: _account.phoneNumber,
      role:_user.role
    };
    res.status(201).json({
      status: "success",
      _token,
      data: _data,
    });
  } catch (err) {
    next(err);
  }
};
//Oke
exports.protect = async (req, res, next) => {
  try {
    let _token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      _token = req.headers.authorization.split(" ")[1];
    }

    if (!_token) {
      return next(
        new AppError(
          401,
          "fail",
          "You are not logged in! Please login in to continue"
        ),
        req,
        res,
        next
      );
    }
    const _decode = await jwt.verify(_token, process.env.JWT_SECRET);

    const _account = await Account.findById(_decode.id);
    if (!_account) {
      return next(
        new AppError(401, "fail", "This user is no longer exist"),
        req,
        res,
        next
      );
    }

    req.account = _account;
    next();
  } catch (err) {
    next(err);
  }
};

