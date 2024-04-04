const FriendRequest = require("../models/friendRequest");
const User = require("../models/user");
const Conversation = require("../models/conversation");
const Message = require("../models/message");
const Account = require("../models/account");

//Oke
exports.addFriendRequestController = async (req, res) => {
  try {
    const { senderID, receiverID, content } = req.body;
    const _senderUser = await User.findById(senderID);
    if (senderID == receiverID) {
      return res
        .status(400)
        .json({ msg: "SenderID and ReciverID cannot be the same!" });
    }
    const _findFriendRequest = await FriendRequest.findOne({
      senderID: senderID,
      receiverID: receiverID,
    });
    if (_findFriendRequest) {
      return res.status(400).json({ msg: "FriendRequest already exist!" });
    }
    const _newFriendRequest = await FriendRequest.create({
      senderID: senderID,
      receiverID: receiverID,
      content: "Hello! I'm " + _senderUser.fullName + "!" + " Nice to meet you!"
    });
    const _account = await Account.findById(_senderUser.accountID);
    const _data = {
      idFriendRequest: _newFriendRequest.id,
      senderId: senderID,
      phoneNumber: _account.phoneNumber,
      fullName: _senderUser.fullName,
      receiverId: receiverID,
      content: _newFriendRequest.content,
      imageLink: _senderUser.avatarLink,
    };
    res.status(200).json({
      data: _data,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
//Oke
// Minh gui cho nguoi ta
exports.getFriendRequestOfMe = async (req, res) => {
  try {
    let _datas = [];
    const _userID = req.params.userID;
    const _friendRequest = await FriendRequest.find({
      senderID: _userID,
    });

    const _senderUser = await User.findById(_userID);
    for (let i of _friendRequest) {
      let _userReceiver = await User.findById(i.receiverID);
      let _account = await Account.findById(_userReceiver.accountID)
      if (i.content == undefined) {
        i.content = "Hello! I'm " + _senderUser.fullName + "!" + " Nice to meet you!";
      }
      let _data = {
        idFriendRequest: i.id,
        receiverId: _userReceiver.id,
        phoneNumber: _account.phoneNumber,
        fullName: _userReceiver.fullName,
        content: i.content,
        imageLink: _userReceiver.avatarLink,
      };
      _datas.push(_data);
    }
    res.status(200).json(_datas);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
//Oke
// Ho gui den minh
exports.getRequestAddFriendOfMe = async (req, res) => {
  try {
    let _datas = [];
    const _userID = req.params.userID;
    const _friendRequest = await FriendRequest.find({
      receiverID: _userID,
    });
    for (let i of _friendRequest) {
      let _userSender = await User.findById(i.senderID);
      let _account = await Account.findById(_userSender.accountID);
      if (i.content == undefined) {
        i.content =
          "Hello! I'm " + _userSender.fullName + "!" + " Nice to meet you!";
      }
      let _data = {
        idFriendRequest: i.id,
        senderId: _userSender.id,
        phoneNumber: _account.phoneNumber,
        fullName: _userSender.fullName,
        receiverId: _userID,
        content: i.content,
        imageLink: _userSender.avatarLink,
      };
      _datas.push(_data);
    }
    res.status(200).json({
      data: _datas,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
//Oke
exports.friendRequest = async (req, res) => {
  const _status = req.body.status;
  const _friendRequestID = req.params.friendRequestID;
  const _senderID = req.body.senderID;
  const _receiverID = req.body.receiverID;
 
  const _friendRequest = await FriendRequest.findById(_friendRequestID);
  if (_friendRequest) {
    try {
      if (_status) {
        const _senderUser = await User.findById(_senderID);
        const _receiverUser = await User.findById(_receiverID);

        const _findConversation = await Conversation.find({
          members: { $in: [_senderID] },
        });
        let _conversation = await Conversation.create({
          name: [_senderUser.fullName, _receiverUser.fullName],
          imageLink: [_senderUser.avatarLink, _receiverUser.avatarLink],
          members: [_senderUser, _receiverUser],
          createdBy: _receiverUser,
        });
        const _message = await Message.create({
          content: null,
          imageLink: null,
          conversationID: _conversation.id,
          senderID: _receiverUser,
          action: "Hai bạn đã là bạn bè"
        });
        var _updateConversation = await Conversation.findByIdAndUpdate(
          { _id: _conversation.id },
          {
            lastMessage: _message.id,
          },
          { new: true }
        );
        //Xử lý thằng gửi
        let _friendsSenDer = _senderUser.friends;
        _friendsSenDer.push(_receiverUser);
        const _friendsSenDerUpdate = await User.findByIdAndUpdate(
          { _id: _senderUser.id },
          {
            friends: _friendsSenDer,
          },
          { new: true }
        );
        // Xử lý thằng nhận
        let _friendsReceiver = _receiverUser.friends;
        _friendsReceiver.push(_senderUser);
        const _friendsReceiverUpdate = await User.findByIdAndUpdate(
          { _id: _receiverUser.id },
          {
            friends: _friendsReceiver,
          },
          { new: true }
        );

        _updateConversation.lastMessage = "Hai bạn đã là bạn bè";
        await FriendRequest.findByIdAndRemove(_friendRequestID);
        return res.status(200).json({
          message: "Accept friend request",
          friendRequestID: _friendRequestID,
          listFriendsReceiver: _friendsReceiverUpdate.friends,
          listFriendsSender: _friendsSenDerUpdate.friends,
          sender:{
            id:_senderUser.id,
            name:_senderUser.fullName,
            avatar:_senderUser.avatarLink
          },
          receiver:{
            id:_receiverUser.id,
            name:_receiverUser.fullName,
            avatar:_receiverUser.avatarLink
          },
          idSender: _senderID,
          idReceiver: _receiverID,
          conversation: {
            id: _updateConversation.id,
            members: _updateConversation.members,
            isGroup: _updateConversation.isGroup,
            isCalling: _updateConversation.isCalling,
            createBy: _updateConversation.createdBy,
            deleteBy:[],
            blockBy:_updateConversation.blockBy,
            lastMessage:"Hai bạn đã là bạn bè",
            time:_message.createdAt,
          }      
        });
      } else {
        await FriendRequest.findByIdAndRemove(_friendRequestID);
        return res.status(200).json({
          message: "Don't accept friend request",
          friendRequestID: _friendRequestID,
          idSender: _senderID
        });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  } else {
    return res.status(200).json({
      status: 200,
      msg: "FriendRequest not exist ",
    });
  }
};

//Oke
exports.deleteFriendRequest = async (req, res) => {
  const _status = req.body.status;
  const _friendRequestID = req.params.friendRequestID;
  const _senderID = req.body.senderID;

  const _friendRequest = await FriendRequest.findById(_friendRequestID);
  if (_friendRequest) {
    try {
      if (_status) {
        if (_senderID == _friendRequest.senderID) {
          let data = [];
          let deleted = {
            id:_friendRequestID,
            deleted:_friendRequest.receiverID
          }
          await FriendRequest.findByIdAndRemove(_friendRequestID);
          const _fr = await FriendRequest.find({ senderID: _senderID });
          for(let i of _fr){
            let _data = {
              idFriendRequest:i.id,
              content : i.content,
              receiverId : i.receiverID,
              senderId:i.senderID,
              status:i.status
            }
            data.push(_data)
          }
          return res.status(200).json({
            deleted,
            data
        });
        } else {
          return res.status(200).json({
            message: "You don't",
          });
        }
      } else {
        return res.status(200).json({
          message: "Don't delete friend request",
        });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  } else {
    return res.status(200).json({
      status: 200,
      msg: "FriendRequest not exist ",
    });
  }
};
