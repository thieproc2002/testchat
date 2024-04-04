const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

//models
const Account = require("./models/account");
const User = require("./models/user");

process.on("uncaughtException", (err) => {
  process.exit(1);
});


const app = require("./app");
const uri = 'mongodb+srv://trantrongthiep2002:thiepga123@zalo.tt4feul.mongodb.net/?retryWrites=true&w=majority&appName=zalo';
// Connect the database
mongoose.connect(
  uri,
  () => {
    console.log("Success");
  },
  (e) => console.error(e)
);

// Start the server
const _port = 8091;
app.listen(_port, () => {
  console.log(`Application is running on port ${_port}`);
});

process.on("unhandledRejection", (err) => {
  server.close(() => {
    process.exit(1);
  });
});

// run();
// async function run() {
//   ///User 1
//   const _ThiepAccount = await Account.create({
//     phoneNumber:"0968376202",
//     passWord:await bcrypt.hash("123456", 10),
//   });

//   const _ThiepUser = await User.create({
//     fullName:"Tran Trong Thiep",
//     bio:"abc",
//     birthday:Date.now(),
//     accountID:_ThiepAccount,
//     avatarLink:"https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223",
//     backgroundLink:"https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223",     
//   });

//   //User 2

//   const _Thiep2Account = await Account.create({
//     phoneNumber:"01699987346",
//     passWord:await bcrypt.hash("123456", 10),
//   });

//   const _Thiep2User = await User.create({
//     fullName:"thiep 2",
//     bio:"zxc",
//     birthday:Date.now(),
//     accountID:_Thiep2Account,
//     avatarLink:"https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223",
//     backgroundLink:"https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223",
//   });

  // await _ThiepAccount.save();
  // await _ThiepUser.save();

  // await _Thiep2Account.save();
  // await _Thiep2User.save();


  
//}
