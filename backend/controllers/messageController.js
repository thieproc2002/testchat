const Message = require("../models/message");
const Conversation = require("../models/conversation");
const AppError = require("../utils/appError");
const AWS = require("aws-sdk");
const User = require("../models/user");
const { v4: uuidv4 } = require('uuid');
AWS.config.update({
  accessKeyId: process.env.ID,
  secretAccessKey: process.env.SECRET,
  region: process.env.region,
});
const s3 = new AWS.S3();
//Oke
exports.getTenLastMessageInConversationID = async (req, res, next) => {
  try {
    let _conversationId = req.params.conversationId;
    let _count = req.body.count;
    if (!_count) {
      _count = 0;
    }
    let _allMessages = await Message.find({
      conversationID: _conversationId,
    }).sort({ createdAt: -1 });
    if (_count < _allMessages.length) {
      res.status(200).json(_allMessages.slice(_count, _count + 10));
    } else if (_count == _allMessages.length) {
      res.status(200).json(null);
    }
  } catch (err) {
    next(err);
  }
};

//OK
exports.getAllMessageInConversationID = async (req, res, next) => {
  try {
    let _conversationId = req.params.conversationId;
    let _messages = await Message.find({ conversationID: _conversationId });
    let _datas = [];

    for (let i of _messages) {
      const _user = await User.findById(i.senderID);
      let _data = {
        _id: i.id,
        content: i.content,
        imageLink: i.imageLink,
        fileLink: i.fileLink,
        senderID: _user.id,
        createdAt: i.createdAt,
        action: i.action,
        deleteBy: i.deleteBy,
      };
      _datas.push(_data);
    }
    res.status(200).json(_datas);
  } catch (err) {
    next(err);
  }
};

// Gửi nhiều file
exports.createMessageManyFile = async (req, res, next) => {
  try {
    let _imageLinks = [];
    let _fileLink = "";
    if (!req.files) {
      _imageLinks = null;
      _fileLink = null;
    }
    else {
      if(req.files.imageLinks){
        if (req.files.imageLinks.length) {
          const _imageLinksClient = req.files.imageLinks;
          for (let i = 0; i < _imageLinksClient.length; i++) {
            const _fileContent = Buffer.from(_imageLinksClient[i].data, "binary");
            const _param = {
              Bucket: "mechat-v2",
              Key: uuidv4() + _imageLinksClient[i].name,
              ContentType: 'image/png',
              Body: _fileContent,
            }
            const _paramLocation = await s3
              .upload(_param, (err, data) => {
                if (err) {
                  throw err;
                }
              })
              .promise();
            _imageLinks.push( _paramLocation.Location);
          };
        }else{
          let _fileContentImage = Buffer.from(req.files.imageLinks.data, "binary");
          let _paramImage = {
            Bucket: "mechat-v2",
            Key: uuidv4() + req.files.imageLinks.name,
            ContentType: 'image/png',
            Body: _fileContentImage,
          };
          let _paramLocation = await s3
            .upload(_paramImage, (err, data) => {
              if (err) {
                throw err;
              }
            })
            .promise();
  
            _imageLinks.push( _paramLocation.Location);
        }
      }
      if (req.files.fileLink) {
        const _fileLinkClient = req.files.fileLink;
        const _fileContent = Buffer.from(_fileLinkClient.data, "binary");
        const _param = {
          Bucket: "mechat-v2",
          Key: _fileLinkClient.name,
          Body: _fileContent,
        }
        const _paramFileLocation = await s3
          .upload(_param, (err, data) => {
            if (err) {
              throw err;
            }
          })
          .promise();
        _fileLink = _paramFileLocation.Location;
      }
    }
    const { content, conversationID, senderID } = req.body;
    let _seen = [];
    _seen.push(senderID);
    const _newMessage = await Message.create({
      content: content,
      conversationID: conversationID,
      senderID: senderID,
      seen:_seen,
      imageLink: _imageLinks,
      fileLink: _fileLink,
      action: null,
    });

    let _content = "";
    if(_imageLinks){
      if (_imageLinks[_imageLinks.length - 1] != null) {
        var _confirmEnd = _imageLinks[_imageLinks.length - 1].split(".");
        if (
          _confirmEnd[_confirmEnd.length - 1] == "jpg" ||
          _confirmEnd[_confirmEnd.length - 1] == "jpeg" ||
          _confirmEnd[_confirmEnd.length - 1] == "png" ||
          _confirmEnd[_confirmEnd.length - 1] == "gif" ||
          _confirmEnd[_confirmEnd.length - 1] == "pdf"
        ) {
          _content = "[Hình ảnh]";
        } else if (
          _confirmEnd[_confirmEnd.length - 1] == "mp4" ||
          _confirmEnd[_confirmEnd.length - 1] == "mp3" ||
          _confirmEnd[_confirmEnd.length - 1] == "vma" ||
          _confirmEnd[_confirmEnd.length - 1] == "avi" ||
          _confirmEnd[_confirmEnd.length - 1] == "mkv" ||
          _confirmEnd[_confirmEnd.length - 1] == "wmv"
          ) {
          _content = "[Video]";
        }
      }
     }
     if(_fileLink){
        _content = "[File]";
     }
     const _con = await Conversation.findById(conversationID)
     let _deleteBy = _con.deleteBy;
     _deleteBy.pull(senderID);
    const _conversation = await Conversation.findByIdAndUpdate(
      { _id: conversationID },
      {
        lastMessage: _newMessage,
        deleteBy:_deleteBy
      },
      { new: true }
    );

    let _data = {
      contentMessage:_content,
      _id:_newMessage.id,
      content:_newMessage.content,
      imageLink : _newMessage.imageLink,
      fileLink:_newMessage.fileLink,
      members:_conversation.members,
      conversationID:_newMessage.conversationID,
      senderID:_newMessage.senderID,
      action:_newMessage.action,
      deleteBy:_newMessage.deleteBy,
      createAt:_newMessage.createdAt,
    }
    res.status(200).json(_data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
//Oke
exports.deleteMessage = async (req, res, next) => {
  try {
    const _messageID = req.params.messageId;
    const _message = await Message.findById(_messageID);
    const _conversationID = req.body.conversationID;
    const _conversationNow = await Conversation.findById(_conversationID);

    if (_message.id == _conversationNow.lastMessage) {
      await Message.findByIdAndRemove(_messageID);
      let _messages = await Message.find({
        conversationID: _conversationID,
      });

      const _conversation = await Conversation.findByIdAndUpdate(
        { _id: _conversationID },
        {
          lastMessage: _messages[_messages.length - 1],
        },
        { new: true }
      );
    }
    await Message.findByIdAndRemove(_messageID);
    res.status(200).json({ idMessage: _messageID });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
//Oke
exports.recallMessage = async (req, res, next) => {
  try {
    const _messageID = req.params.messageId;
    await Message.findByIdAndUpdate(_messageID, {
      content: "Tin nhắn này đã được thu hồi",
      imageLink: null,
      fileLink: null,
    });
    const _message = await Message.findById(_messageID);
    res.status(200).json(_message);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

//Oke
exports.deleteMessageForYou = async (req, res, next) => {
  try {
    const _messageId = req.params.messageId;
    const _userId = req.body.userId;
    const _user = await User.findById(_userId);
    await Message.findByIdAndUpdate(_messageId, {
      deleteBy: _user.id,
    });
    const _message = await Message.findById(_messageId);
    let _data = { id: _messageId };
    res.status(200).json(_data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

//Oke
exports.updateSeen = async (req, res, next) => {
  try {
    const _messageId = req.params.messageId;
    const _userId = req.body.userId;
    const _message = await Message.findById(_messageId);
    let _seen = _message.seen;
    _seen.push(_userId)
    await Message.findByIdAndUpdate(_messageId, {
      seen:_seen
    });
    let _data = { id: _messageId , userId : _userId , seen : _seen };
    res.status(200).json(_data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

//Oke
exports.moveMessage = async (req, res, next) => {
  try {
    const _messageId = req.params.messageId;
    const _conversationId = req.body.conversationId;
    const _userId = req.body.userId;
    let _newMessages = [];
    let _content = "";
    
    const _message = await Message.findById(_messageId);
    for(let i of _conversationId){
      let _conversation = await Conversation.findById(i);
      let _member = _conversation.members;
      const _newMessage = await Message.create({
        content: _message.content,
        conversationID: i,
        senderID: _userId,
        imageLink: _message.imageLink,
        fileLink: _message.fileLink,
        action: null,
      });
      let _imageLinks = _newMessage.imageLink;
      let _fileLink = _newMessage.fileLink;
      if(_imageLinks){
        if (_imageLinks[_imageLinks.length - 1] != null) {
          var _confirmEnd = _imageLinks[_imageLinks.length - 1].split(".");
          if (
            _confirmEnd[_confirmEnd.length - 1] == "jpg" ||
            _confirmEnd[_confirmEnd.length - 1] == "jpeg" ||
            _confirmEnd[_confirmEnd.length - 1] == "png" ||
            _confirmEnd[_confirmEnd.length - 1] == "gif" ||
            _confirmEnd[_confirmEnd.length - 1] == "pdf"
          ) {
            _content = "[Hình ảnh]";
          } else if (
            _confirmEnd[_confirmEnd.length - 1] == "mp4" ||
            _confirmEnd[_confirmEnd.length - 1] == "mp3" ||
            _confirmEnd[_confirmEnd.length - 1] == "vma" ||
            _confirmEnd[_confirmEnd.length - 1] == "avi" ||
            _confirmEnd[_confirmEnd.length - 1] == "mkv" ||
            _confirmEnd[_confirmEnd.length - 1] == "wmv"
            ) {
            _content = "[Video]";
          }
        }
       }
       if(_fileLink){
          _content = "[File]";
       }
      let _data = {
        _id:_newMessage.id,
        content:_newMessage.content,
        contentMessage:_content,
        conversationID:_newMessage.conversationID,
        senderID:_newMessage.senderID,
        imageLink: _newMessage.imageLink,
        fileLink:_newMessage.fileLink,
        action: _newMessage.action,
        createdAt:_newMessage.createdAt,
        seen:_newMessage.seen,
        deleteBy:_newMessage.deleteBy,
        members:_member
      }
      _newMessages.push(_data);
      await Conversation.findByIdAndUpdate(i,{
        lastMessage:_newMessage
      })
    }
    let _data = { id: _messageId , conversationID:_conversationId, userId:_userId , newMessage:_newMessages };
    res.status(200).json(_data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
