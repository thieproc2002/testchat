const AppError = require("../utils/appError");
const Conversation = require("../models/conversation");
const User = require("../models/user");
const Message = require("../models/message");
const { v4: uuidv4 } = require('uuid');
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.ID,
  secretAccessKey: process.env.SECRET,
  region: process.env.region,
});
const s3 = new AWS.S3();
//Oke
exports.getAllConversationByUserID = async (req, res, next) => {
  try {
    let _datas = [];
    const _conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    if (!_conversation) {
      return next(
        new AppError(404, "fail", "No document found with that id"),
        req,
        res,
        next
      );
    }
    for (let i of _conversation) {
      let _names;
      let _name = "";
      let _imageLinks = i.imageLink;
      let _imageLink = "";
      let _data;
      const _user = await User.findById(req.params.userId);

      const _lastMessage = await Message.findOne({ conversationID: i })
        .sort({ createdAt: -1 })
        .limit(1);
      if (i.isGroup == false) {
        _names = i.name.pull(_user.fullName);
        _name += _names[0].trim();
        _imageLinks.pull(_user.avatarLink.trim());
        _imageLink = _imageLinks[0];
      } else if (i.isGroup) {
        _name = i.name[0];
        _imageLink = i.imageLink[0];
      }
      if (_lastMessage.imageLink) {
        if (_lastMessage.imageLink[_lastMessage.imageLink.length - 1] != null) {
          var _confirmEnd = _lastMessage.imageLink[_lastMessage.imageLink.length - 1].split(".");
          if (
            _confirmEnd[_confirmEnd.length - 1] == "jpg" ||
            _confirmEnd[_confirmEnd.length - 1] == "jpeg" ||
            _confirmEnd[_confirmEnd.length - 1] == "png" ||
            _confirmEnd[_confirmEnd.length - 1] == "gif" ||
            _confirmEnd[_confirmEnd.length - 1] == "pdf"
          ) {
            _lastMessage.content = "[Hình ảnh]";
          } else if (
            _confirmEnd[_confirmEnd.length - 1] == "mp4" ||
            _confirmEnd[_confirmEnd.length - 1] == "mp3" ||
            _confirmEnd[_confirmEnd.length - 1] == "vma" ||
            _confirmEnd[_confirmEnd.length - 1] == "avi" ||
            _confirmEnd[_confirmEnd.length - 1] == "mkv" ||
            _confirmEnd[_confirmEnd.length - 1] == "wmv"
          ) {
            _lastMessage.content = "[Video]";
          }
        }
      }
      if (_lastMessage.fileLink) {
        _lastMessage.content = "[File]";
      }
      if (!i.isGroup) {
        i.createdBy = null;
      }
      if(i.deleteBy == null){
        i.deleteBy = []
      }
      _data = {
        id: i.id,
        name: _name,
        members: i.members,
        imageLinkOfConver: _imageLink,
        content: _lastMessage.content,
        lastMessage: _lastMessage.action,
        time: _lastMessage.createdAt,
        isGroup: i.isGroup,
        createdBy: i.createdBy,
        isCalling: i.isCalling,
        deleteBy: i.deleteBy,
        blockBy: i.blockBy
      };
      _datas.push(_data);
    }
    res.status(200).json({
      status: "success",
      data: _datas,
    });
  } catch (error) {
    next(error);
  }
};
//OKe
exports.createConversation = async (req, res, next) => {
  try {
    const { members, createdBy, name } = req.body;
    let _name = [];
    _name.push(name);
    let _imageLink = [];
    const _userCreate = await User.findById(createdBy);
    _imageLink.push(
      "https://mechat.s3.ap-southeast-1.amazonaws.com/avatar-group.png"
    );
    let _members = [];
    _members = members;
    _members.push(createdBy);
    const _newConversation = await Conversation.create({
      name: _name,
      imageLink: _imageLink,
      members: _members,
      createdBy: createdBy,
      isGroup: true,
    });
    const _message = await Message.create({
      content: null,
      conversationID: _newConversation.id,
      imageLink: null,
      senderID: _userCreate,
      action: _userCreate.fullName + " đã tạo nhóm",
    });
    const _updateConversation = await Conversation.findByIdAndUpdate(
      { _id: _newConversation.id },
      {
        lastMessage: _message,
      },
      { new: true }
    );
  
    let _data = {
      id: _updateConversation.id,
      name: _updateConversation.name[0],
      imageLinkOfConver: _updateConversation.imageLink[0],
      lastMessage: _message.action,
      time: _message.createdAt,
      members: _updateConversation.members,
      createdBy: _updateConversation.createdBy,
      deleteBy: _updateConversation.deleteBy,
      isGroup: _updateConversation.isGroup,
      isCalling: _updateConversation.isCalling,
      blockBy:_updateConversation.blockBy
    }
    res.status(200).json(_data);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
//OKe
exports.addMemberConversation = async (req, res) => {
  const { conversationId } = req.params;
  const _newMember = req.body.newMemberID;
  const _memberAdd = req.body.memberAddID;
  try {
    const _memberAddUser = await User.findById(_memberAdd);
    const _conversationNow = await Conversation.findById(conversationId);
    let _members = _conversationNow.members;
    let _confirm = true;
    let _dem = "";
    for (let i of _conversationNow.members) {
      for (let j of _newMember) {
        if (i == j) {
          _confirm = false;
        }
      }
    }

    for (let i = 0; i < _newMember.length; i++) {
      _members.push(_newMember[i]);
    }
    if (_newMember.length == 1) {
      let _demUser = await User.findById(_newMember[0]);
      _dem = _demUser.fullName + " vào nhóm!";
    }
    else if (_newMember.length > 1) {
      _dem = _newMember.length + " thành viên vào nhóm!";
    }
    if (_confirm) {
      const _message = await Message.create({
        content: null,
        imageLink: null,
        conversationID: conversationId,
        senderID: _memberAdd,
        action:
          _memberAddUser.fullName +
          " đã thêm " + _dem
      });
      const _updateConversation = await Conversation.findByIdAndUpdate(
        { _id: conversationId },
        {
          members: _members,
          lastMessage: _message,
        },
        { new: true }
      );
      let _data = {
        id: _updateConversation.id,
        name: _updateConversation.name[0],
        imageLink: _updateConversation.imageLink[0],
        time: _message.createdAt,
        members: _updateConversation.members,
        createdBy: _updateConversation.createdBy,
        deleteBy: _updateConversation.deleteBy,
        isGroup: _updateConversation.isGroup,
        isCalling: _updateConversation.isCalling,
        lastMessage: _message.action,
        newMember: _newMember
      }
      res.status(200).json(_data);
    } else {
      res.status(500).json({ msg: "Thành viên đã tồn tại!" });
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
//Oke
exports.deleteMemberConversation = async (req, res) => {
  try {
    let { conversationId } = req.params;
    let { memberId, mainId } = req.body;
    let _conversationNow = await Conversation.findById(conversationId);
    let _confirm1 = false;
    let _confirm2 = false;
    if (mainId == _conversationNow.createdBy) {
      _confirm1 = true;
    }
    if (mainId == memberId) {
      _confirm2 = true;
    }
    if (_confirm1 == true) {
      if (_confirm2 == false) {
        const _members = _conversationNow.members.pull(memberId);
        const _memberDelete = await User.findById(memberId);
        const _main = await User.findById(mainId);
        const _message = await Message.create({
          content: null,
          conversationID: _conversationNow,
          senderID: _main.id,
          action:
            _main.fullName +
            " đã xóa " +
            _memberDelete.fullName +
            " ra khỏi nhóm!",
        });
        const _updateConversation = await Conversation.findByIdAndUpdate(
          { _id: conversationId },
          {
            lastMessage: _message,
            members: _members,
          },
          { new: true }
        );
        let _data = {
          _id: _updateConversation.id,
          idMember: memberId,
          name: _updateConversation.name[0],
          imageLink: _updateConversation.imageLink[0],
          action: _message.action,
          time: _message.createdAt,
          members: _updateConversation.members,
          createdBy: _updateConversation.createdBy,
          deleteBy: _updateConversation.deleteBy,
          isGroup: _updateConversation.isGroup,
          isCalling: _updateConversation.isCalling
        }
        res.status(200).json(_data);
      } else {
        return res.status(500).json({ msg: "Admin can delete admin" });
      }
    } else {
      return res.status(500).json({ msg: "Only admin can delete members" });
    }
  } catch (error) {
    return res.status(500).json({ errorMessage: error });
  }
};
//Oke 
exports.outConversation = async (req, res) => {
  try {
    const _conversationId = req.params.conversationId;
    let { userId } = req.body;
    let _conversationNow = await Conversation.findById(_conversationId);
    const _memberOut = await User.findById(userId);
    let _members = _conversationNow.members.pull(userId);
    let _newCreateBy;
    if (userId == _conversationNow.createdBy) {
      _newCreateBy = _members[0];
    }
    const _message = await Message.create({
      content: null,
      conversationID: _conversationNow,
      senderID: _memberOut.id,
      action: _memberOut.fullName + " đã thoát khỏi nhóm",
    });
    let _updateConversation = await Conversation.findByIdAndUpdate(
      { _id: _conversationId },
      {
        createdBy: _newCreateBy,
        members: _members,
        lastMessage: _message
      },
      { new: true }
    );
    let _data = {
      _id: _updateConversation.id,
      idMember: userId,
      name: _updateConversation.name[0],
      imageLink: _updateConversation.imageLink[0],
      time: _message.createdAt,
      action: _message.action,
      members: _updateConversation.members,
      createdBy: _updateConversation.createdBy,
      deleteBy: _updateConversation.deleteBy,
      isGroup: _updateConversation.isGroup,
      isCalling: _updateConversation.isCalling
    }
    res.status(200).json(_data);
  } catch (error) {
    return res.status(500).json({ errorMessage: error });
  }
};
//Oke 
exports.changeName = async (req, res) => {
  try {
    const _userId = req.body.userId;
    const _newNameBody = req.body.newName;
    let _conversationId = req.params.conversationId;

    const _conversation = await Conversation.findById(_conversationId);
    const _user = await User.findById(_userId);

    let _newName = _newNameBody;
    const _conversationAfter = await Conversation.findByIdAndUpdate(
      { _id: _conversationId },
      {
        name: _newName,
      },
      { new: true }
    );
    const _message = await Message.create({
      content: null,
      conversationID: _conversation,
      senderID: _user,
      action: _user.fullName + " đã thay đổi tên nhóm thành: " + _newName,
    });
    let _data = {
      id: _conversationAfter.id,
      name: _conversationAfter.name[0],
      imageLink: _conversationAfter.imageLink[0],
      action: _message.action,
      time: _message.createdAt,
      members: _conversationAfter.members,
      createdBy: _conversationAfter.createdBy,
      deleteBy: _conversationAfter.deleteBy,
      isGroup: _conversationAfter.isGroup,
      isCalling: _conversationAfter.isCalling
    }
    res.status(200).json(_data);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
//Oke 
exports.changeAvatar = async (req, res) => {
  try {
    const _userId = req.body.userId;
    const _fileImage = req.files.imageLink;
    const _conversationId = req.params.conversationId;

    const _conversation = await Conversation.findById(_conversationId);
    const _user = await User.findById(_userId);

    const _fileContentImage = Buffer.from(_fileImage.data, "binary");
    const _paramAvatar = {
      Bucket: "mechat-v2",
      Key: uuidv4() + _fileImage.name,
      ContentType: 'image/png',
      Body: _fileContentImage,
    };
  
    let _paramLocation = await s3
      .upload(_paramAvatar, (err, data) => {
        if (err) {
          throw err;
        }
      })
      .promise();
    let _path = _paramLocation.Location

    const _message = await Message.create({
      content: null,
      conversationID: _conversation,
      senderID: _user,
      action: _user.fullName + " đã thay đổi ảnh đại diện nhóm!"
    });
    const _conversationAfter = await Conversation.findByIdAndUpdate(
      { _id: _conversationId },
      {
        imageLink: _path,
        lastMessage: _message
      },
      { new: true }
    );

    let _data = {
      id: _conversationAfter.id,
      name: _conversationAfter.name[0],
      imageLink: _conversationAfter.imageLink[0],
      action: _message.action,
      time: _message.createdAt,
      members: _conversationAfter.members,
      createdBy: _conversationAfter.createdBy,
      deleteBy: _conversationAfter.deleteBy,
      isGroup: _conversationAfter.isGroup,
      isCalling: _conversationAfter.isCalling
    }
    res.status(200).json(_data);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
//Oke
exports.deleteConversation = async (req, res) => {
  try {
    const _conversationId = req.params.conversationId;
    const _mainID = req.body.mainId;
    const _conversation = await Conversation.findById(_conversationId);
    let _confirm = true;
    if (_mainID == _conversation.createdBy) {
      _confirm = false;
    }
    if (_confirm == false) {
      let _data = {
        _id: _conversation.id,
        name: _conversation.name[0],
        imageLink: _conversation.imageLink[0],
        members: _conversation.members,
        createdBy: _conversation.createdBy,
        deleteBy: _conversation.deleteBy,
        isGroup: _conversation.isGroup,
      }
      await Conversation.findByIdAndDelete({ _id: _conversationId });
      res.status(200).json(_data);
    } else {
      res.status(500).json({ msg: "Only admin can delete group" });
    }
  } catch (error) {
    res.status(500).json({ errorMessage: error });
  }
};
// dang test
exports.removeDeleteBy = async (req, res, next) => {
  try {
    const _conversationId = req.params.conversationId;
    const _userId = req.body.userId;
    const _conversation = await Conversation.findById(_conversationId);
    let _deleteBy = _conversation.deleteBy;
    _deleteBy.pull(_userId);
    await Conversation.findByIdAndUpdate(_conversationId, {
      deleteBy: _deleteBy,
    });
    const _lastMessage = await Message.findById(_conversation.lastMessage)
    let _data = { 
      id: _conversationId,
      name: _conversation.name[0],
      members: _conversation.members,
      imageLinkOfConver: _conversation.imageLink[0],
      content: _lastMessage.content,
      lastMessage: _lastMessage.action,
      time: _lastMessage.createdAt,
      isGroup: _conversation.isGroup,
      createdBy: _conversation.createdBy,
      isCalling: _conversation.isCalling,
      deleteBy: _conversation.deleteBy,
      blockBy: _conversation.blockBy,
      userID:_userId 
    };
    res.status(200).json(_data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
//Oke
exports.deleteConversationForYou = async (req, res, next) => {
  try {
    const _conversationId = req.params.conversationId;
    const _userId = req.body.userId;
    const _conversation = await Conversation.findById(_conversationId);
    let _deleteBy = _conversation.deleteBy;
    _deleteBy.push(_userId);
    let _allMessages = await Message.find({
      conversationID: _conversationId
    })
    for (let i = 0; i < _allMessages.length; i++) {
      let _deleteByMessage = [];
      _deleteByMessage = _allMessages[i].deleteBy;
      _deleteByMessage.push(_userId);
      await Message.findByIdAndUpdate(_allMessages[i].id, {
        deleteBy: _deleteByMessage
      })
    }
    await Conversation.findByIdAndUpdate(_conversationId, {
      deleteBy: _deleteBy,
    });
    let _data = { id: _conversationId };
    res.status(200).json(_data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
//Oke
exports.blockConversation = async (req, res, next) => {
  try {
    const _conversationId = req.params.conversationId;
    const _userId = req.body.userId;
    if (_userId != null) {
      const _conversation = await Conversation.findById(_conversationId);
      let _blockBy = _conversation.blockBy;
      _blockBy.push(_userId);
      await Conversation.findByIdAndUpdate(_conversationId, {
        blockBy: _blockBy,
      });
      const _conversationAfterUpdate = await Conversation.findById(_conversationId);
      let _data = {
        id: _conversationId,
        userId: _userId,
        blockBy: _conversationAfterUpdate.blockBy
      };
      res.status(200).json(_data);
    }
    else{
      res.status(500).json({ msg: "userId null!" });
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
//Oke
exports.changeCreateByConversation = async (req, res, next) => {
  try {
    const _conversationId = req.params.conversationId;
    const _userId = req.body.userId;
    const _conversation = await Conversation.findById(_conversationId);
    const _user = await User.findById(_userId);
    const _message = await Message.create({
      content: null,
      conversationID: _conversation,
      senderID: _conversation.createdBy,
      action: _user.fullName + " đã trở thành trưởng nhóm!"
    });
    await Conversation.findByIdAndUpdate(_conversationId, {
      createdBy: _userId,
      lastMessage: _message,
    });
    const _conversationAfterUpdate = await Conversation.findById(_conversationId);
    let _data = { idConversation: _conversationId, createBy: _conversationAfterUpdate.createdBy, action: _message.action };
    res.status(200).json(_data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

//Oke
exports.removeBlockConversation = async (req, res, next) => {
  try {
    const _conversationId = req.params.conversationId;
    const _userId = req.body.userId;
    const _conversation = await Conversation.findById(_conversationId);
    let _blockBy = _conversation.blockBy;
    _blockBy.pull(_userId);
    await Conversation.findByIdAndUpdate(_conversationId, {
      blockBy: _blockBy,
    });
    const _conversationAfterUpdate = await Conversation.findById(_conversationId);
    let _data = { id: _conversationId,userId:_userId, blockBy: _conversationAfterUpdate.blockBy };
    res.status(200).json(_data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};