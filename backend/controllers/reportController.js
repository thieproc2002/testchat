const Report = require('../models/report')
const Message = require('../models/message')
const User = require('../models/user')
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require('uuid');

AWS.config.update({
    accessKeyId: process.env.ID,
    secretAccessKey: process.env.SECRET,
    region: process.env.region,
});
const s3 = new AWS.S3();
//Oke
exports.getAllReports = async (req, res) => {
    try {
        let _datas = [];
        const _report = await Report.find();

        for (let i of _report) {
            const _message = await Message.findById(i.messageID);
            const _user = await User.findById(_message.senderID);
            const _data = {
                id: i.id,
                senderID:i.senderID,
                messageID: i.messageID,
                imageLink:_message.imageLink,
                content:_message.content,
                contentReport : i.content,
                image: i.image,
                idUser:_user.id,
                fullName:_user.fullName,
                createdAt:i.createdAt,
            };
            _datas.push(_data);
        }

        res.status(200).json({
            status: "success",
            results: _report.length,
            data: _datas,
        });
    } catch (error) {
        return res.status(500).json({ msg: error });
    }
}
//Oke
exports.addReport = async (req, res) => {
    try {
        const { messageId , content, senderID } = req.body;
        const _fileClient = req.files.fileImage;
        const _fileContent = Buffer.from(_fileClient.data, "binary");
        const _param = {
          Bucket: "mechat-v2",
          Key: uuidv4() + _fileClient.name,
          Body: _fileContent,
        }
        const _paramFileLocation = await s3
          .upload(_param, (err, data) => {
            if (err) {
              throw err;
            }
          })
          .promise();
        const _newReport = await Report.create({
            messageID:messageId,
            content:content,
            senderID:senderID,
            image:_paramFileLocation.Location
        })
        const _messageReport = await Message.findById(messageId);
        let _data={
            id:_newReport.id,
            messageID:_newReport.messageID,
            content:_messageReport.content,
            senderID:senderID,
            imageLink:_messageReport.imageLink,
            image:_newReport.image,
            createdAt:_newReport.createdAt
        }
        res.status(200).json(_data);
    } catch (error) {
        return res.status(500).json({ msg: error });
    }
}
//Oke
exports.getReportById = async (req,res) =>{
    try {
        const _id = req.params.reportId
        const _report = await Report.findById(_id);
        const _message = await Message.findById(_report.messageID);
        const _user = await User.findById(_message.senderID);
        const _sender = await User.findById(_report.senderID);
        let _data = {
            id:_report.id,
            image : _report.image,
            contentReport: _report.content,
            content : _message.content,
            imageLink : _message.imageLink,
            createdAt : _report.createdAt,
            idUser:_user.id,
            fullName:_user.fullName,
            fullNameSender : _sender.fullName,
        }
        res.status(200).json(_data);
    } catch (error) {
        return res.status(500).json({ msg: error });
    }
}
//Oke
exports.deleteReport = async (req,res) =>{
    try {
        const { status } = req.body;
        if(status){
            const _report = await Report.findById(req.params.reportId);
            const _message = await Message.findById(_report.messageID);
            let _listReport = await Report.find();

            for(let i of _listReport){
                let _messageItem = await Message.findById(i.messageID);
                if(_messageItem.id == _message.id){
                        await Report.findByIdAndDelete(i.id);
                }
            }

            let _listReportAfterUpdate = await Report.find();
            res.status(200).json(_listReportAfterUpdate);
        }
    } catch (error) {
        return res.status(500).json({ msg: error });
    }
}
//Oke
exports.acceptReport = async (req,res) =>{
    try {
        const { status } = req.body;
        if(status){
            const _rep = await Report.findById(req.params.reportId);
            const _message = await Message.findById(_rep.messageID);
            const _user =  await User.findById(_message.senderID);
            let _warning = _user.warning;
            let _status ;
            _warning ++;
            if(_warning > 3){
                _status = false
            }
            await User.findByIdAndUpdate(_user.id,{
                warning:_warning,
                status:_status
            })

            let _listReport = await Report.find();
            for(let i of _listReport){
                let _messageItem = await Message.findById(i.messageID);
                if(_messageItem.id == _message.id){
                        await Report.findByIdAndDelete(i.id);
                }
            }

            let _listReportAfterUpdate = await Report.find();
            res.status(200).json(_listReportAfterUpdate);
        }
    } catch (error) {
        return res.status(500).json({ msg: error });
    }
}
//Oke
exports.removeBlock = async (req,res) =>{
    try {
        const { status } = req.body;
        if(status){
            await User.findByIdAndUpdate(req.params.userId,{
                warning:0,
                status:true
            })
            let _user = await User.findById(req.params.userId)
            res.status(200).json(_user);
        }
    } catch (error) {
        return res.status(500).json({ msg: error });
    }
}