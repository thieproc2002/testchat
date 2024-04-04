const AppError = require('../utils/appError');
const Account  = require("../models/account")
const bcrypt = require("bcrypt");
const User = require("../models/user")

//Oke
exports.forgetPassWord = async (req, res, next) => {
    try {
        const _newPass = req.body.newPassword;
        const _account = await Account.findOne({phoneNumber:req.body.phoneNumber});
        if(_account){
            const _newPassAcount = await Account.findByIdAndUpdate(_account.id,{
                passWord : await bcrypt.hash(_newPass, 10)
            });
            const _newAccount = await Account.findOne({phoneNumber:req.body.phoneNumber});
            res.status(200).json({
                status: 'success',
                data: _newAccount
            });
        }
        else{
            res.status(200).json({
                status: 'Số điện thoại không tồn tại',
        })
    }
    } catch (error) {
        return res.status(500).json({ msg: error });
    }
};
//Oke
exports.changePassWord = async (req, res, next) => {
    try {
        const _oldPass = req.body.oldPass
        const _newPass = req.body.newPassword
        const _id = req.params.userId
        const _hash = await bcrypt.hash(_newPass, 10);
        const _user  = await User.findById(_id)
        const _account = await Account.findById(_user.accountID);
        if(!(await _account.correctPassword(_oldPass, _account.passWord))){
            return res.status(500).json({ msg: "Vui lòng kiểm tra password" });
        }
        const _newPassAcount = await Account.findByIdAndUpdate(_user.accountID,{
            passWord : _hash
        });
        const _newAccount = await Account.findById(_user.accountID);
        res.status(200).json({
            status: 'success',
            data: _newAccount
        });
    } catch (error) {
        return res.status(500).json({ msg: error });
    }
};
//Oke
exports.getAccountByPhoneNumber = async (req, res, next) => {
    try {
        const _account = await Account.findOne({phoneNumber:req.params.phoneNumber});
        if (!_account) {
            return next(new AppError(404, 'fail', 'No account found with that id'), req, res, next);
        }
        let _data = {"id":_account.id,"phoneNumber":_account.phoneNumber,"passWord":_account.passWord}
        res.status(200).json({
            status: 'success',
            data: _data
        });
    } catch (error) {
        return res.status(500).json({ msg: error });
    }
};

//Oke
exports.getAccountById = async (req, res, next) => {
    try {
        const _account = await Account.findById(req.params.accountID);
        if (!_account) {
            return next(new AppError(404, 'fail', 'No account found with that id'), req, res, next);
        }
        let _data = {"id":_account.id,"phoneNumber":_account.phoneNumber,"passWord":_account.passWord}
        res.status(200).json({
            status: 'success',
            data: _data
        });
    } catch (error) {
        return res.status(500).json({ msg: error });
    }
};

//Oke
exports.getAllAccount = async (req, res, next) => {
    try {
        const _account = await Account.find();
        let _accounts = [];
        for(let i of _account){
            let _user = await User.findOne({accountID:i.id});
            if(!_user.role){
                _accounts.push(i);
            }
        }
        if (!_account) {
            return next(new AppError(404, 'fail', 'No account found with that id'), req, res, next);
        }
        res.status(200).json({
            status: 'success',
            data: _accounts
        });
    } catch (error) {
        return res.status(500).json({ msg: error });
    }
};
