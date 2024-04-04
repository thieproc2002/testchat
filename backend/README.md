# BackEnd-MeChat-Final-v3
## config.env
    NODE_ENVIROMMENT
    PORT
    DATABASE

    JWT_SECRET          
    JWT_EXPIRES_IN

    ID 
    SECRET 
    region  
# Path: http://localhost:3000/api/v3/authRouters
### Đăng nhập
```json
    - Method: POST: /login
    - Dữ liệu gửi đi
        {
        "phoneNumber":"0879276284",
        "passWord":"123456"
        }            
    - Dữ liệu trả về
        {
            "status": "success",
            "_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzM4NjU3ZTk5ZTM1MmIzOTRiNDliY2EiLCJpYXQiOjE2NjQ3Njg3MDIsImV4cCI6MTY2NDc2OTMwMn0.WbNzp-8OiPuQQ6jFM7HrBz3HFGePwFSVm8t27oiY_yc",
            "data": {
                "id": "6338657e99e352b394b49bca",
                "name": "\"Huy Update\"",
                "avartar": "https://mechat.s3.ap-southeast-1.amazonaws.com/trang2.jpg",
                "background": "https://mechat.s3.ap-southeast-1.amazonaws.com/nutrang.jpg"
            }
        }
```       
### Đăng ký
```Json
    - Method: POST: /signup
    - Dữ liệu gửi đi    
        {
            "phoneNumber":"0879276299",
            "passWord":"123456",
            "fullName":"signup",
        }
    - Dữ liệu trả về
        {
            "status": "success",
            "_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzM3MTZmYjUzZGFhNjUwMGNjYTk4ZTIiLCJpYXQiOjE2NjQ1NTQ3NDcsImV4cCI6MTY2NDU1NTM0N30.bRCu4-TYPxhmQ0z-DNM6jR_ttkAxH5JMu7vmrJdovbY",
            "data": {
                "_account": {
                    "phoneNumber": "0879276299",
                    "status": true,
                    "role": "User",
                    "_id": "633716fb53daa6500cca98e0",
                    "__v": 0
                }
            }
        }
```
# Path: http://localhost:3000/api/v3/users
### Lấy tất cả users 
```json
    - GET: no body
    - Dữ liệu gửi đi : không
    - Dữ liệu trả về : Tất cả user
        {
            "status": "success",
            "results": 5,
            "data": [
                {
                    "_id": "6338657e99e352b394b49bca",
                    "fullName": "\"Huy Update\"",
                    "bio": "Sông Lam",
                    "gender": 0,
                    "birthday": "2001-03-22T17:00:00.000Z",
                    "status": true,
                    "avatarLink": "https://mechat.s3.ap-southeast-1.amazonaws.com/logo.jpg",
                    "backgroundLink": "https://mechat.s3.ap-southeast-1.amazonaws.com/logoSLNA.png",
                    "friendID": null,
                    "phoneNumber": "0879276284"
                },
                {
                    "_id": "6338657e99e352b394b49bce",
                    "fullName": "Võ Minh Phương",
                    "bio": "Sông Lam",
                    "gender": 0,
                    "birthday": "2022-10-01T16:06:22.823Z",
                    "status": true,
                    "avatarLink": "https://mechat.s3.ap-southeast-1.amazonaws.com/phuongAvar.jpg",
                    "backgroundLink": "https://mechat.s3.ap-southeast-1.amazonaws.com/phuongBack.jpg",
                    "friendID": null,
                    "phoneNumber": "0879276284"
                },
            ]
        }
```
### Lấy user theo số điện thoại
```json
    - Method: GET:    /get-user-by-phone/:phoneNumber
    - Dữ liệu gửi đi
        http://localhost:3000/api/v3/users/get-user-by-phone/0879276284
    - Dữ liệu trả về
        {
            "_id": "63370d32e7a8a746c7842aa8",
            "fullName": "Nguyễn Đức Huy",
            "bio": "Sông Lam",
            "gender": 0,
            "birthday": "2022-09-30T15:37:22.741Z",
            "status": true,
            "avatarLink": "https://mechat.s3.ap-southeast-1.amazonaws.com/huyAvar.jpg",
            "backgroundLink": "https://mechat.s3.ap-southeast-1.amazonaws.com/huyBack.jpg",
            "accountID": {
                "_id": "63370d31e7a8a746c7842aa5",
                "phoneNumber": "0879276284",
                "passWord": "$2b$10$3DwWJ6pT2vcX8DpnZWgB9OCB4h/rVQMzhiX5YV46YDm//XNQWiMkC"
            },
            "friendID": null,
            "__v": 0
        }
```
### Lấy user theo id
```json 
    - Method: GET:    /:userID 
    - Dữ liệu gửi đi
        http://localhost:3000/api/v3/users/63370d32e7a8a746c7842aa8
    - Dữ liệu trả về
        {
            "status": "success",
            "data": {
                "user": {
                    "_id": "63370d32e7a8a746c7842aa8",
                    "fullName": "Nguyễn Đức Huy",
                    "bio": "Sông Lam",
                    "gender": 0,
                    "birthday": "2022-09-30T15:37:22.741Z",
                    "status": true,
                    "avatarLink": "https://mechat.s3.ap-southeast-1.amazonaws.com/huyAvar.jpg",
                    "backgroundLink": "https://mechat.s3.ap-southeast-1.amazonaws.com/huyBack.jpg",
                    "accountID": {
                        "_id": "63370d31e7a8a746c7842aa5",
                        "phoneNumber": "0879276284",
                        "passWord": "$2b$10$3DwWJ6pT2vcX8DpnZWgB9OCB4h/rVQMzhiX5YV46YDm//XNQWiMkC"
                    },
                    "friendID": null,
                    "__v": 0
                }
            }
        }
```
### Chỉnh sửa User (Text)
```json  
    - Method: put:    /:userID
    - Dữ liệu gửi đi
        http://localhost:3000/api/v3/users/634a58d1a85520274df8850e
        {
            "fullName":"fullName",
            "gender":1,
            "birthday":"1/1/2020",
            "bio":"bio"
        }
    - Dữ liệu trả về
        {
            "status": "success",
            "data": {
                "_user1": {
                    "_id": "634a58d1a85520274df8850e",
                    "fullName": "fullName",
                    "bio": "bio",
                    "gender": 1,
                    "birthday": "2019-12-31T17:00:00.000Z",
                    "status": true,
                    "avatarLink": "https://mechat.s3.ap-southeast-1.amazonaws.com/vanducaotrang.jpg",
                    "backgroundLink": "https://mechat.s3.ap-southeast-1.amazonaws.com/logo.jpg",
                    "accountID": "634a58d0a85520274df8850b",
                    "friends": [
                        "634a58d2a85520274df8851e",
                        "634a58d1a85520274df88512",
                        "634a58d2a85520274df88516"
                    ],
                    "__v": 0
                }
            }
        }   
```
### Chỉnh sửa avatar
```json  
    - Method: POST:   /update-avatar/:userId
    - Dữ liệu gửi đi
    http://localhost:3000/api/v3/users/update-avatar/634a58d1a85520274df8850e
    
    Dữ liệu đưa vào form-data: key(tên) = avatarLink (file)

    - Dữ liệu trả về
    {
        "status": "success",
        "data": {
            "_id": "634a58d1a85520274df8850e",
            "fullName": "Nguyễn Đức Huy",
            "bio": "Sông Lam",
            "gender": 0,
            "birthday": "2022-10-15T06:53:05.727Z",
            "status": true,
            "avatarLink": "https://mechat.s3.ap-southeast-1.amazonaws.com/huyAvar.jpg",
            "backgroundLink": "https://mechat.s3.ap-southeast-1.amazonaws.com/huyBack.jpg",
            "accountID": {
                "_id": "634a58d0a85520274df8850b",
                "phoneNumber": "0879276284",
                "passWord": "$2b$10$3ZgQWSouPe0kSu5aY3X31ORAkJueCiTQEMfsT1PLIECSiubuMyZam"
            },
            "friends": [
                "634a58d2a85520274df8851e",
                "634a58d1a85520274df88512",
                "634a58d2a85520274df88516"
            ],
            "__v": 0
        }
    }  
```
### Chỉnh sửa backGround

```json  
    - Method: POST:   /update-background/:userId
    - Dữ liệu gửi đi
    http://localhost:3000/api/v3/users/update-background/634a58d1a85520274df8850e
    
    Dữ liệu đưa vào form-data: key(tên) = backLink (file)

    - Dữ liệu trả về
    {
        "status": "success",
        "data": {
            "_id": "634a58d1a85520274df8850e",
            "fullName": "Nguyễn Đức Huy",
            "bio": "Sông Lam",
            "gender": 0,
            "birthday": "2022-10-15T06:53:05.727Z",
            "status": true,
            "avatarLink": "https://mechat.s3.ap-southeast-1.amazonaws.com/vanducaotrang.jpg",
            "backgroundLink": "https://mechat.s3.ap-southeast-1.amazonaws.com/logo.jpg",
            "accountID": "634a58d0a85520274df8850b",
            "friends": [
                "634a58d2a85520274df8851e",
                "634a58d1a85520274df88512",
                "634a58d2a85520274df88516"
            ],
            "__v": 0
        }
    }
```
### Lấy tất cả danh sách bạn bè
  
```json  
    - Method: get:    get-friends-user/:userId
    - Dữ liệu gửi đi
        http://localhost:3000/api/v3/users/get-friends-user/634277c306b139dc4c72a4ab
    - Dữ liệu trả về
       {
            "status": "success",
            "data": [
                {
                    "_id": "634277c406b139dc4c72a4b3",
                    "fullName": "Lê Tuấn",
                    "bio": "Sông Lam",
                    "gender": 0,
                    "birthday": "2022-10-09T07:27:00.061Z",
                    "status": true,
                    "avatarLink": "https://mechat.s3.ap-southeast-1.amazonaws.com/tuanAvar.jpg"
                },
                {
                    "_id": "634277c306b139dc4c72a4af",
                    "fullName": "Võ Minh Phương",
                    "bio": "Sông Lam",
                    "gender": 0,
                    "birthday": "2022-10-09T07:26:59.894Z",
                    "status": true,
                    "avatarLink": "https://mechat.s3.ap-southeast-1.amazonaws.com/phuongAvar.jpg"
                }
            ]
        }   
```
### Xóa 1 bạn bè
```json  
    - Method: post:    delete_friend/:userId
    - Dữ liệu gửi đi
        http://localhost:3000/api/v3/users/delete-friend/6379837d461339d862d84595
        {
            "status":true,
            "userDeleteId":"6379837d461339d862d84599"
        }
    - Dữ liệu trả về
        {
            "message": "Done!",
            "idSender": "6379837d461339d862d84595",
            "idReceiver": "6379837d461339d862d84599",
            "listFriendsUserDelete": [
                "6379837d461339d862d8459d",
                "6379837e461339d862d845a1"
            ],
            "listFriendsUser": [],
            "conversationDeleted": "6379f5a4a1db316d251da460"
        }
```
# Path: http://localhost:3000/api/v3/messages
### get 10 lastMessageInConversation
```json
    - Method: POST: /ten-last-messages/:conversationId
    - Dữ liệu gửi đi
        http://localhost:3000/api/v3/messages/ten-last-messages/635f43faead5a8774275361a
    (count là tổng số tin nhắn đang hiển thị trên UI)
        {
            "count":0
        }
    - Dữ liệu trả về
        {
            "lastMessage": "63673297c8e037c3ec334981",
            "messages": [
                {
                    "_id": "63673297c8e037c3ec334981",
                    "content": null,
                    "imageLink": [
                        "https://mechat-v2.s3.ap-southeast-1.amazonaws.com/0824e030-5902-41f7-bfb8-c940fabea09220083a33d54c3b12625d.jpg"
                    ],
                    "fileLink": "",
                    "conversationID": "6364c5422942d6d374b065ba",
                    "senderID": "6364c4a1704a90ce691c6853",
                    "action": null,
                    "deleteBy": [],
                    "createdAt": "2022-11-06T04:05:43.839Z",
                    "updatedAt": "2022-11-06T04:05:43.839Z",
                    "__v": 0
                },
                {
                    "_id": "63673287c8e037c3ec33497e",
                    "content": null,
                    "imageLink": [
                        "https://mechat-v2.s3.ap-southeast-1.amazonaws.com/de5afca2-3341-4270-a194-f08b3f4dea74f30010a8-f930-4231-a921-65b1e1a2cc08txtIcon.png"
                    ],
                    "fileLink": "",
                    "conversationID": "6364c5422942d6d374b065ba",
                    "senderID": "6364c4a1704a90ce691c6853",
                    "action": null,
                    "deleteBy": [],
                    "createdAt": "2022-11-06T04:05:27.029Z",
                    "updatedAt": "2022-11-06T04:05:27.029Z",
                    "__v": 0
                },
                {
                    "_id": "63673188c8e037c3ec33497b",
                    "content": null,
                    "imageLink": [],
                    "fileLink": "https://mechat-v2.s3.ap-southeast-1.amazonaws.com/Gi%E1%BB%9Bi%20thi%E1%BB%87u%20%C4%91%E1%BB%91i%20th%E1%BB%A7%20c%E1%BA%A1nh%20tranh.docx",
                    "conversationID": "6364c5422942d6d374b065ba",
                    "senderID": "6364c4a1704a90ce691c6853",
                    "action": null,
                    "deleteBy": [],
                    "createdAt": "2022-11-06T04:01:12.543Z",
                    "updatedAt": "2022-11-06T04:01:12.543Z",
                    "__v": 0
                },
                {
                    "_id": "63673179cd40ed6eac57db37",
                    "content": null,
                    "imageLink": [],
                    "fileLink": "https://mechat-v2.s3.ap-southeast-1.amazonaws.com/Gi%E1%BB%9Bi%20thi%E1%BB%87u%20%C4%91%E1%BB%91i%20th%E1%BB%A7%20c%E1%BA%A1nh%20tranh.docx",
                    "conversationID": "6364c5422942d6d374b065ba",
                    "senderID": "6364c4a1704a90ce691c6853",
                    "action": null,
                    "deleteBy": [],
                    "createdAt": "2022-11-06T04:00:57.484Z",
                    "updatedAt": "2022-11-06T04:00:57.484Z",
                    "__v": 0
                },
                {
                    "_id": "6367316ecd40ed6eac57db34",
                    "content": null,
                    "imageLink": [],
                    "fileLink": "https://mechat-v2.s3.ap-southeast-1.amazonaws.com/Gi%E1%BB%9Bi%20thi%E1%BB%87u%20%C4%91%E1%BB%91i%20th%E1%BB%A7%20c%E1%BA%A1nh%20tranh.docx",
                    "conversationID": "6364c5422942d6d374b065ba",
                    "senderID": "6364c4a1704a90ce691c6853",
                    "action": null,
                    "deleteBy": [],
                    "createdAt": "2022-11-06T04:00:46.402Z",
                    "updatedAt": "2022-11-06T04:00:46.402Z",
                    "__v": 0
                },
                {
                    "_id": "6367315bcd40ed6eac57db30",
                    "content": null,
                    "imageLink": [],
                    "fileLink": "https://mechat-v2.s3.ap-southeast-1.amazonaws.com/Gi%E1%BB%9Bi%20thi%E1%BB%87u%20%C4%91%E1%BB%91i%20th%E1%BB%A7%20c%E1%BA%A1nh%20tranh.docx",
                    "conversationID": "6364c5422942d6d374b065ba",
                    "senderID": "6364c4a1704a90ce691c6853",
                    "action": null,
                    "deleteBy": [],
                    "createdAt": "2022-11-06T04:00:27.570Z",
                    "updatedAt": "2022-11-06T04:00:27.570Z",
                    "__v": 0
                },
                {
                    "_id": "636730ee65015ca80e8d3a44",
                    "content": null,
                    "imageLink": [],
                    "fileLink": "https://mechat-v2.s3.ap-southeast-1.amazonaws.com/Gi%E1%BB%9Bi%20thi%E1%BB%87u%20%C4%91%E1%BB%91i%20th%E1%BB%A7%20c%E1%BA%A1nh%20tranh.docx",
                    "conversationID": "6364c5422942d6d374b065ba",
                    "senderID": "6364c4a1704a90ce691c6853",
                    "action": null,
                    "deleteBy": [],
                    "createdAt": "2022-11-06T03:58:38.341Z",
                    "updatedAt": "2022-11-06T03:58:38.341Z",
                    "__v": 0
                },
                {
                    "_id": "636730a265015ca80e8d3a41",
                    "content": null,
                    "imageLink": [],
                    "fileLink": "https://mechat-v2.s3.ap-southeast-1.amazonaws.com/Gi%E1%BB%9Bi%20thi%E1%BB%87u%20%C4%91%E1%BB%91i%20th%E1%BB%A7%20c%E1%BA%A1nh%20tranh.docx",
                    "conversationID": "6364c5422942d6d374b065ba",
                    "senderID": "6364c4a1704a90ce691c6853",
                    "action": null,
                    "deleteBy": [],
                    "createdAt": "2022-11-06T03:57:22.177Z",
                    "updatedAt": "2022-11-06T03:57:22.177Z",
                    "__v": 0
                },
                {
                    "_id": "63666b0cdce022227516dd2e",
                    "content": null,
                    "imageLink": [],
                    "fileLink": "https://mechat-v2.s3.ap-southeast-1.amazonaws.com/CV_LUMANHCUONG.docx",
                    "conversationID": "6364c5422942d6d374b065ba",
                    "senderID": "6364c4ba704a90ce691c685f",
                    "action": null,
                    "deleteBy": [],
                    "createdAt": "2022-11-05T13:54:20.878Z",
                    "updatedAt": "2022-11-05T13:54:20.878Z",
                    "__v": 0
                },
                {
                    "_id": "636668ab0960597ca8c62d99",
                    "content": null,
                    "imageLink": [],
                    "fileLink": "https://mechat-v2.s3.ap-southeast-1.amazonaws.com/Customer%20Persona%20Template.xlsx",
                    "conversationID": "6364c5422942d6d374b065ba",
                    "senderID": "6364c4ba704a90ce691c685f",
                    "action": null,
                    "deleteBy": [],
                    "createdAt": "2022-11-05T13:44:11.693Z",
                    "updatedAt": "2022-11-05T13:44:11.693Z",
                    "__v": 0
                }
            ]
        }
```
### getAllMessageInConversationID
``` json
    - Method: GET: nobody
    - Dữ liệu gửi đi
        http://localhost:3000/api/v3/messages/6342a2cd2d1f50338655e82b
    - Dữ liệu nhận về
    [
        {
            "_id": "635f43faead5a8774275361c",
            "content": null,
            "imageLink": null,
            "fileLink": null,
            "senderID": "635f12961ac24d08dc61a611",
            "createdAt": "2022-10-31T03:41:46.347Z",
            "action": "Hai bạn đã là bạn bè",
            "deleteBy": null
        },
        {
            "_id": "635f440ed874178f4e497ab5",
            "content": "Alo",
            "imageLink": null,
            "fileLink": null,
            "senderID": "635f12961ac24d08dc61a609",
            "createdAt": "2022-10-31T03:42:06.176Z",
            "action": null,
            "deleteBy": null
        },
        ...................
    ]
```
### Thêm message
```json
    - Method: POST:   body (form-data)
    - Dữ liệu gửi đi
        {
            "content":"Add message",
            "conversationID":"634016808a1090a62877a2b0",
            "senderID":"6340145304260a64fc12b009",
            "imageLinks":[file],
            "fileLink":file,
        }

    - Dữ liệu trả về
        {
            "contentMessage": "[File]",
            "_id": "636760d67f369a646e778cd9",
            "content": null,
            "imageLink": [],
            "fileLink": "https://mechat-v2.s3.ap-southeast-1.amazonaws.com/Gi%E1%BB%9Bi%20thi%E1%BB%87u%20%C4%91%E1%BB%91i%20th%E1%BB%A7%20c%E1%BA%A1nh%20tranh.docx",
            "conversationID": "6364c5422942d6d374b065ba",
            "senderID": "6364c4a1704a90ce691c6853",
            "action": null,
            "deleteBy": []
        }
```         
### Xóa message 
```json
    - Method: DELETE: /:messageId
    - Dữ liệu gửi đi
        http://localhost:3000/api/v3/messages/63553df0d6efa86d5ca705fc
        {
            "conversationID":"6354f250d2c16a0be9a94a15"
        }                    
    - Dữ liệu trả về
        {
            "id": "63553df0d6efa86d5ca705fc"
        }
```
### Xóa tin nhắn phía bạn 
```json
    - Method: DELETE: /delete-for-you/:messageId
    - Dữ liệu gửi đi
        http://localhost:3000/api/v3/messages/delete-for-you/635f12e40c640098f0ee9308
        {
            "userId":"635f12971ac24d08dc61a615"
        }                  
    - Dữ liệu trả về
        {
            "id": "635f12e40c640098f0ee9308"
        }
```
### Thu hồi tin nhắn
```json
    - Method: GET: /recall/:messageId
    - Dữ liệu gửi đi
        http://localhost:3000/api/v3/messages/recall/635539662851cec893b19a8d                   
    - Dữ liệu trả về
        {
            "_id": "635539662851cec893b19a8d",
            "content": "Tin nhắn này đã được thu hồi",
            "imageLink": null,
            "fileLink": null,
            "conversationID": "6354f250d2c16a0be9a94a15",
            "senderID": "6354f1c10a879557f30194c9",
            "action": null,
            "createdAt": "2022-10-23T12:53:58.426Z",
            "updatedAt": "2022-10-23T13:14:37.342Z",
            "__v": 0
        }
```
### Chuyển tiếp tin nhắn
```json
    - Method: POST: /move-message/:messageId
    - Dữ liệu gửi đi
         http://localhost:3000/api/v3/messages/move-message/6379e637626cffb9e78d72a3      
        {
            "conversationId":["63799085aedf72db7b7f4f62","6379908baedf72db7b7f4f68"],
            "userId":"6379837d461339d862d84595"
        }         
    - Dữ liệu trả về
        {
            "id": "6379e637626cffb9e78d72a3",
            "conversationID": [
                "63799085aedf72db7b7f4f62",
                "6379908baedf72db7b7f4f68"
            ],
            "userId": "6379837d461339d862d84595",
            "newMessage": [
                {
                    "_id": "6379e649626cffb9e78d72a9",
                    "content": null,
                    "contentMessage": "[File]",
                    "conversationID": "63799085aedf72db7b7f4f62",
                    "senderID": "6379837d461339d862d84595",
                    "imageLink": [],
                    "fileLink": "https://mechat-v2.s3.ap-southeast-1.amazonaws.com/Nhom10_LTPT05_DHKTPM15A_Tuan_Huy_Tran_V3_TuanChange.docx",
                    "action": null,
                    "createdAt": "2022-11-20T08:33:13.708Z",
                    "seen": [],
                    "deleteBy": [],
                    "members": [
                        "6379837d461339d862d84599",
                        "6379837d461339d862d8459d"
                    ]
                },
                {
                    "_id": "6379e649626cffb9e78d72ad",
                    "content": null,
                    "contentMessage": "[File]",
                    "conversationID": "6379908baedf72db7b7f4f68",
                    "senderID": "6379837d461339d862d84595",
                    "imageLink": [],
                    "fileLink": "https://mechat-v2.s3.ap-southeast-1.amazonaws.com/Nhom10_LTPT05_DHKTPM15A_Tuan_Huy_Tran_V3_TuanChange.docx",
                    "action": null,
                    "createdAt": "2022-11-20T08:33:13.880Z",
                    "seen": [],
                    "deleteBy": [],
                    "members": [
                        "6379837d461339d862d84599",
                        "6379837d461339d862d8459d"
                    ]
                }
            ]
        }
```
### Chỉnh sửa người xem tin nhắn
```json
    - Method: POST: /update-seen/:messageId
    - Dữ liệu gửi đi
     http://localhost:3000/api/v3/messages/update-seen/63798ebf0e67ecd2a42487c6       
        {
            "userId":"6379837d461339d862d84599"
        }           
    - Dữ liệu trả về
        {
            "id": "63798ebf0e67ecd2a42487c6",
            "userId": "6379837d461339d862d84599",
            "seen": [
                "6379837d461339d862d84595",
                "6379837d461339d862d84599"
            ]
        }
```
# Path: http://localhost:3000/api/v3/conversations
### Lấy tất cả nhóm chát theo idUser
```json
    - Method: GET :   /:userId
    - Dữ liệu gửi đi
        http://localhost:3000/api/v3/conversations/636b163e80f85770969964e7
    - Dữ liệu trả về
        {
            "status": "success",
            "data": [
                {
                    "id": "636b169d72d42c01c1de5254",
                    "name": "Võ Minh Phương",
                    "members": [
                        "636b163e80f85770969964e7",
                        "636b163e80f85770969964eb"
                    ],
                    "imageLinkOfConver": "https://mechat.s3.ap-southeast-1.amazonaws.com/f6070779-9893-4929-a2b6-bdb533859893.jpeg",
                    "content": null,
                    "lastMessage": "Hai bạn đã là bạn bè",
                    "time": "2022-11-09T02:55:25.277Z",
                    "isGroup": false,
                    "createdBy": null,
                    "isCalling": false,
                    "deleteBy": null,
                    "blockBy": []
                },
                {
                    "id": "636b4ce00648ef9b9bb276a7",
                    "name": "Nhóm của tui ",
                    "members": [
                        "636b163e80f85770969964e7",
                        "636b163e80f85770969964eb",
                        "636b163e80f85770969964ef",
                        "636b3cb194c02355d2559b67"
                    ],
                    "imageLinkOfConver": "https://mechat-v2.s3.ap-southeast-1.amazonaws.com/ff35336e-1ab9-4bd7-904c-c6f526ade6de2519ebdb-499e-451b-b2c9-dee53d96ca98.jpeg",
                    "content": null,
                    "lastMessage": "Tăng Bảo Trấn đã thoát khỏi nhóm",
                    "time": "2022-11-09T11:46:29.907Z",
                    "isGroup": true,
                    "createdBy": "636b163e80f85770969964eb",
                    "isCalling": false,
                    "deleteBy": [],
                    "blockBy": [
                        "636b163e80f85770969964ef"
                    ]
                }
            ]
        }
```
### Tạo một nhóm chát mới
```json
    - Method: POST:   /create-conversation
    - Dữ liệu gửi đi
        {
            "members":["636b163e80f85770969964ef","636b163e80f85770969964eb"], 
            "createdBy":"636b163e80f85770969964e7",
            "name":"Group Huy tao n"
        }   
    - Dữ liệu trả về
        {
            "id": "636d0b04bfda2411ac7455d5",
            "name": "Group Huy tao n",
            "imageLinkOfConver": "https://mechat-v2.s3.ap-southeast-1.amazonaws.com/avatar-group.png",
            "lastMessage": "Nguyen Duc Huy đã tạo nhóm",
            "time": "2022-11-10T14:30:28.327Z",
            "members": [
                "636b163e80f85770969964ef",
                "636b163e80f85770969964eb",
                "636b163e80f85770969964e7"
            ],
            "createdBy": "636b163e80f85770969964e7",
            "deleteBy": [],
            "isGroup": true,
            "isCalling": false,
            "blockBy":[]
        }
``` 
### Add member to conversation
```json
    - Method: POST : /add-member-conversation/:conversationId
    - Dữ liệu gửi đi
        http://localhost:3000/api/v3/conversations/add-member-conversation/636d0b04bfda2411ac7455d5
        {
            "newMemberID":["636b163f80f85770969964f3"],
            "memberAddID":"636b163e80f85770969964ef"
        }
    - Dữ liệu trả về 
        {
            "id": "636d0b04bfda2411ac7455d5",
            "name": "Group Huy tao n",
            "imageLink": "https://mechat-v2.s3.ap-southeast-1.amazonaws.com/avatar-group.png",
            "time": "2022-11-10T14:31:53.665Z",
            "members": [
                "636b163e80f85770969964ef",
                "636b163e80f85770969964eb",
                "636b163e80f85770969964e7",
                "636b163f80f85770969964f3"
            ],
            "createdBy": "636b163e80f85770969964e7",
            "deleteBy": [],
            "isGroup": true,
            "isCalling": false,
            "lastMessage": "Lê Tuấn đã thêm Võ Thành Nhớ vào nhóm!",
            "newMember": [
                "636b163f80f85770969964f3"
            ]
        }
```
### Delete member
```json
    - Method : DELETE : /delete-member/:conversationId
    - Dữ liệu gửi đi
        http://localhost:3000/api/v3/conversations/delete-member/636d0b04bfda2411ac7455d5
        {
            "memberId":"636b163e80f85770969964ef",
            "mainId":"636b163e80f85770969964e7"
        }  
    - Dữ liệu nhận về
        {
            "_id": "636d0b04bfda2411ac7455d5",
            "idMember": "636b163e80f85770969964ef",
            "name": "Group Huy tao n",
            "imageLink": "https://mechat-v2.s3.ap-southeast-1.amazonaws.com/avatar-group.png",
            "action": "Nguyen Duc Huy đã xóa Lê Tuấn ra khỏi nhóm!",
            "time": "2022-11-10T14:32:47.547Z",
            "members": [
                "636b163e80f85770969964eb",
                "636b163e80f85770969964e7",
                "636b163f80f85770969964f3"
            ],
            "createdBy": "636b163e80f85770969964e7",
            "deleteBy": [],
            "isGroup": true,
            "isCalling": false
        }
```
### Delete conversation 
```json
    - Method : DELETE : /delete-conversation /:conversationId
    - Dữ liệu gửi đi
        http://localhost:3000/api/v3/conversations/delete-conversation/634d2c073a0555e973021109
        {
            "mainId":"634a58d1a85520274df88512"
        } 
    - Dữ liệu nhận về
        {
            "_id": "6369b59dca9f69c85bbc937d",
            "members": [
                "6367985d8b88a0af24508260",
                "6367985d8b88a0af2450825c",
                "6367985e8b88a0af24508268"
            ]
        }
```
### Delete conversation for you
```json
    - Method : DELETE : /delete-for-you/:conversationId
    - Dữ liệu gửi đi
        http://localhost:3000/api/v3/conversations/delete-for-you/635fe79743ebe4d945d4b1e2
        {
            "userId":"635fe7612a6ba8c0eea9c6c0"
        }
    - Dữ liệu nhận về
        {
            "id": "635fe79743ebe4d945d4b1e2"
        }
```
### remove deleteBy
```json
    - Method : DELETE : /remove-deleteby/:conversationId
    - Dữ liệu gửi đi
 http://localhost:3000/api/v3/conversations/remove-deleteby/63776f611cf730bdb3080f92
        {
            "userId":"63776e1f16297a68e6dfa4c4"
        }
    - Dữ liệu nhận về
        {
            "id": "63776f611cf730bdb3080f92",
            "name": "Test remove conversations",
            "members": [
                "63776e1f16297a68e6dfa4d0",
                "63776e1f16297a68e6dfa4c8",
                "63776e1f16297a68e6dfa4c4"
            ],
            "imageLinkOfConver":"https://mechat-v2.s3.ap-southeast-1.amazonaws.com/avatar-group.png",
            "content": null,
            "lastMessage": "Võ Minh Phương đã tạo nhóm",
            "time": "2022-11-18T11:41:22.048Z",
            "isGroup": true,
            "createdBy": "63776e1f16297a68e6dfa4c4",
            "isCalling": false,
            "deleteBy": [],
            "blockBy": [],
            "userID": "63776e1f16297a68e6dfa4c4"
        }
```
### Out conversation 
```json
    - Method: POST : /out-conversation/:conversationId
    - Dữ liệu gửi đi
        http://localhost:3000/api/v3/conversations/out-conversation/636d0b04bfda2411ac7455d5
        {
            "userId":"636b163f80f85770969964f3"
        }
    - Dữ liệu nhận về
        {
            "_id": "636d0b04bfda2411ac7455d5",
            "idMember": "636b163f80f85770969964f3",
            "name": "Group Huy tao n",
            "imageLink": "https://mechat-v2.s3.ap-southeast-1.amazonaws.com/avatar-group.png",
            "time": "2022-11-10T14:33:59.040Z",
            "action": "Võ Thành Nhớ đã thoát khỏi nhóm",
            "members": [
                "636b163e80f85770969964eb",
                "636b163e80f85770969964e7"
            ],
            "createdBy": "636b163e80f85770969964e7",
            "deleteBy": [],
            "isGroup": true,
            "isCalling": false
        }
```
### Change Name 
```json
    - Method : POST : /change-name/:conversationId
    - DỮ liệu gửi đi
        http://localhost:3000/api/v3/conversations/change-name/636d0b04bfda2411ac7455d5
        {
            "newName":"Test ChangeName",
            "userId":"636b163e80f85770969964e7"
        }
    - Dữ liệu trả về
        {
            "id": "636d0b04bfda2411ac7455d5",
            "name": "Test ChangeName",
            "imageLink": "https://mechat-v2.s3.ap-southeast-1.amazonaws.com/avatar-group.png",
            "action": "Nguyen Duc Huy đã thay đổi tên nhóm thành: Test ChangeName",
            "time": "2022-11-10T14:34:46.671Z",
            "members": [
                "636b163e80f85770969964eb",
                "636b163e80f85770969964e7"
            ],
            "createdBy": "636b163e80f85770969964e7",
            "deleteBy": [],
            "isGroup": true,
            "isCalling": false
        }
```
### Change-avatar 
```json
    - Method : POST : /change-avatar/:conversationId
    - DỮ liệu gửi đi
 http://localhost:3000/api/v3/conversations/change-avatar/636d0b04bfda2411ac7455d5
        {
            "userId":"636b163e80f85770969964e7",
            "imageLink":file
        }
    - Dữ liệu trả về
        {
            "id": "636d0b04bfda2411ac7455d5",
            "name": "Test ChangeName",
            "imageLink": "https://mechat-v2.s3.ap-southeast-1.amazonaws.com/0167558f-3c51-4311-a694-c3352c58a72aavatar-group.png",
            "action": "Nguyen Duc Huy đã thay đổi ảnh đại diện nhóm!",
            "time": "2022-11-10T14:36:28.852Z",
            "members": [
                "636b163e80f85770969964eb",
                "636b163e80f85770969964e7"
            ],
            "createdBy": "636b163e80f85770969964e7",
            "deleteBy": [],
            "isGroup": true,
            "isCalling": false
        }
```
### BlockConversation
```json
    - Method : POST : /block-conversation/:conversationId
    - DỮ liệu gửi đi
 http://localhost:3000/api/v3/conversations/block-conversation/636b169d72d42c01c1de5254
        {
            "userId":"636b163e80f85770969964e7",
        }
    - Dữ liệu trả về
        {
            "id": "636b169d72d42c01c1de5254",
            "userId": "636b163e80f85770969964e7",
            "blockBy": [
                "636b163e80f85770969964e7"
            ]
        }
```
### RemoveBlockConversation
```json
    - Method : POST : /remove-block-conversation/:conversationId
    - DỮ liệu gửi đi
 http://localhost:3000/api/v3/conversations/remove-block-conversation/636b169d72d42c01c1de5254
        {
            "userId":"636b163e80f85770969964e7",
        }
    - Dữ liệu trả về
        {
            "id": "636b169d72d42c01c1de5254",
            "userId":"636b163e80f85770969964e7",
            "blockBy": []
        }
```
### ChangeCreateByConversation
```json
    - Method : PUT : /change-createBy/:conversationId
    - DỮ liệu gửi đi
        http://localhost:3000/api/v3/conversations/change-createBy/636dae48d975405787518106
        {
            "userId":"636b163e80f85770969964eb",
        }
    - Dữ liệu trả về
        {
            "idConversation": "636dae48d975405787518106",
            "createBy": "636b163e80f85770969964eb",
            "action": "Võ Minh Phương đã trở thành trưởng nhóm!"
        }
```
# Path:  http://localhost:3000/api/v3/friendRequests
### CreateFriendRequests
``` json
    - Method : POST: /create
    - Dữ liệu gửi đi
        {
            "senderID":"633d56db8a9d52c78fcc6257",
            "receiverID":"633d56dc8a9d52c78fcc6267"
        }
    - Dữ liệu trả về
        {
            "friendRequest": {
                "senderID": "633d56db8a9d52c78fcc6257",
                "receiverID": "633d56dc8a9d52c78fcc6267",
                "status": false,
                "_id": "633d9d850f23a2435d0256db",
                "__v": 0
            }
        }
```
### getFriendRequestAddOfMe
```json
    - Method: GET : /get-of-me/:userID
    - Dữ liệu gửi đi
        http://localhost:3000/api/v3/friendRequests/get-of-me/6371c8e34a860a6021339d39
    - Dữ liệu trả về
        [
            {
                "idFriendRequest": "6371fd90b3b1659a3c0b82f9",
                "receiverId": "6371c8e34a860a6021339d35",
                "phoneNumber": "0397548005",
                "fullName": "Võ Thành Nhớ",
                "content": "Hello! I'm Tăng Bảo Trấn! Nice to meet you!",
                "imageLink": "https://mechat.s3.ap-southeast-1.amazonaws.com/download.jpg"
            },
            {
                "idFriendRequest": "63721eefe19d20de1f20ad07",
                "receiverId": "6371c8e34a860a6021339d29",
                "phoneNumber": "0879276284",
                "fullName": "Nguyen Duc Huy",
                "content": "Hello! I'm Tăng Bảo Trấn! Nice to meet you!",
                "imageLink": "https://mechat.s3.ap-southeast-1.amazonaws.com/huyAvar.jpg"
            },
            {
                "idFriendRequest": "63721ef5e19d20de1f20ad0c",
                "receiverId": "6371c8e34a860a6021339d2d",
                "phoneNumber": "0396887293",
                "fullName": "Võ Minh Phương",
                "content": "Hello! I'm Tăng Bảo Trấn! Nice to meet you!",
                "imageLink": "https://mechat.s3.ap-southeast-1.amazonaws.com/7a8363de-1496-42c8-815b-f0994de42f1b.jpeg"
            }
        ]
```
### getListUserSendRequestAddFriendOfMe
```json
    - Method: GET : /get-list-request/:userID
    - Dữ liệu gửi đi
        http://localhost:3000/api/v3/friendRequests/get-list-request/633d56dc8a9d52c78fcc6267
    - Dữ liệu trả về
        {
            "data": {
                "_id": "633d9d850f23a2435d0256db",
                "senderID": {
                    "_id": "633d56db8a9d52c78fcc6257",
                    "fullName": "Nguyễn Đức Huy",
                    "bio": "Sông Lam",
                    "gender": 0,
                    "birthday": "2022-10-05T10:05:15.288Z",
                    "status": true,
                    "avatarLink": "https://mechat.s3.ap-southeast-1.amazonaws.com/huyAvar.jpg",
                    "backgroundLink": "https://mechat.s3.ap-southeast-1.amazonaws.com/huyBack.jpg",
                    "accountID": "633d56d98a9d52c78fcc6254",
                    "friendID": null,
                    "__v": 0
                },
                "receiverID": "633d56dc8a9d52c78fcc6267",
                "status": false,
                "__v": 0
            }
        }
```
### FriendRequests
    - Method: POST : friend-request/:friendRequestID

    * Chấp nhận kết bạn

```json
    - Dữ liệu gửi đi
        http://localhost:3000/api/v3/friendRequests/friend-request/633d9c420f23a2435d0256d5
        {
            "status":true,
            "senderID":"633d56db8a9d52c78fcc6257",
            "receiverID":"633d56db8a9d52c78fcc625f"
        }
    - Dữ liệu trả về
        {
            "message": "Accept friend request",
            "friendRequestID": "6369b71a034100d8eabdc906",
            "listFriendsReceiver": [
                "6367985d8b88a0af2450825c"
            ],
            "listFriendsSender": [
                "6367985d8b88a0af24508260",
                "6367985e8b88a0af2450826c",
                "6367a4198cbf4f0780e0671f",
                "6367985e8b88a0af24508264"
            ],
            "sender": {
                "id": "6367985d8b88a0af2450825c",
                "name": "Nguyen Duc Huy",
                "avatar": "https://mechat.s3.ap-southeast-1.amazonaws.com/huyAvar.jpg"
            },
            "receiver": {
                "id": "6367985e8b88a0af24508264",
                "name": "Lê Tuấn",
                "avatar": "https://mechat.s3.ap-southeast-1.amazonaws.com/3cf9ea0b-b387-4a00-8af0-ddf8a457a96a.png"
            },
            "idSender": "6367985d8b88a0af2450825c",
            "idReceiver": "6367985e8b88a0af24508264",
            "conversation": {
                "id": "6369b725034100d8eabdc90d",
                "members": [
                    "6367985d8b88a0af2450825c",
                    "6367985e8b88a0af24508264"
                ],
                "isGroup": false,
                "isCalling": false,
                "createBy": "6367985e8b88a0af24508264",
                "lastMessage": "Hai bạn đã là bạn bè",
                "time": "2022-11-08T01:55:49.966Z"
            }
        }
```
    * Từ chối kết bạn
    
```json
    - Dữ liệu gửi đi
        http://localhost:3000/api/v3/friendRequests/friend-request/633d9c420f23a2435d0256d5
        {
            "status":false,
            "senderID":"633d56db8a9d52c78fcc6257",
            "receiverID":"633d56dc8a9d52c78fcc6267"
        }
    - Dữ liệu trả về
        {
            "message": "Don't accept friend request",
            "listFriendsReceiver": null,
            "listFriendsSender": {
                "_id": "633d9813d507f66d6d7cba5f",
                "userID": "633d56db8a9d52c78fcc6257",
                "friends": [
                    "633d56db8a9d52c78fcc6263",
                    "633d56db8a9d52c78fcc625b",
                    "633d56db8a9d52c78fcc625f"
                ],
                "__v": 0
            }
        }
```
### Delete FriendRequest
```json
    - Method: DELETE: /:friendRequestID
    - Dữ liệu gửi đi
        http://localhost:3000/api/v3/friendRequests/6348e9c1bdf82ace11be8acb
        {
            "status":true,
            "senderID":"6347f10993dccf4ddec4f60c"
        }
    - Dữ liệu trả về 
        {
            "deleted": {
                "id": "6374897c765469fe2c43f6c6",
                "deleted": "6371c8e34a860a6021339d39"
            },
            "data": [
                {
                    "idFriendRequest": "63748981765469fe2c43f6cb",
                    "content": "Hello! I'm Nguyen Duc Huy! Nice to meet you!",
                    "receiverId": "6371e01858573d3df5101bec",
                    "senderId": "6371c8e34a860a6021339d29",
                    "status": false
                },
                {
                    "idFriendRequest": "63748986765469fe2c43f6d0",
                    "content": "Hello! I'm Nguyen Duc Huy! Nice to meet you!",
                    "receiverId": "63745aab2d56c49268051a22",
                    "senderId": "6371c8e34a860a6021339d29",
                    "status": false
                }
            ]
        }
```
# PATH:  http://localhost:3000/api/v3/accounts
### Quên mật khẩu
```json
    - POST:  /forget-password
    - Dữ liệu gửi đi
        {
            "phoneNumber":"0879276284",
            "newPassword":"12345"
        }
    - Dữ liệu trả về
        {
            "status": "success",
            "data": {
                "_id": "6355457b4c65ebf7bcf9f237",
                "phoneNumber": "0879276284",
                "passWord": "$2b$10$UNnjXKWoLmcwcxUNOzig4O5P.VGWZSEr6MWzfuFlMykBoELLSiI0C",
                "status": true,
                "__v": 0
            }
        }
```
### Đổi mật khẩu
```json
    - PUT:  /change-password/:userId
    - Dữ liệu gửi đi
        {
            "oldPass":"12345",
            "newPassword":"123456",
            "confirmNewPass":"123456"
        }
    - Dữ liệu trả về
        {
            "status": "success",
            "data": {
                "_id": "6355457b4c65ebf7bcf9f237",
                "phoneNumber": "0879276284",
                "passWord": "$2b$10$9uLfKFjecblGMKcv3HHM3eYGmmFW8PWnSxxztIg8i8bWEuRL2Oc7e",
                "status": true,
                "__v": 0
            }
        }
```
# PATH:  http://localhost:3000/api/v3/reports
### Lấy tất cả Report
```json
    - GET :     no body
    - Dữ liệu gửi đi
    - Dữ liệu trả về
        {
            "status": "success",
            "results": 3,
            "data": [
                {
                    "id": "6372130d0fefee77861c8567",
                    "messageID": "6371f6a687ea3c9f3286962c",
                    "imageLink": null,
                    "content": "Hí",
                    "image": "https://mechat-v2.s3.ap-southeast-1.amazonaws.com/ef041dc4-876e-4ba1-8953-9ee1638ab4e3huy.jpg",
                    "idUser": "6371c8e34a860a6021339d35",
                    "fullName": "Võ Thành Nhớ",
                    "createdAt": "2022-11-14T10:06:05.157Z"
                },
                {
                    "id": "6372132ef017982316f7858b",
                    "messageID": "6371f6a687ea3c9f3286962c",
                    "imageLink": null,
                    "content": "Hí",
                    "image": "https://mechat-v2.s3.ap-southeast-1.amazonaws.com/7a40ff5e-ffa6-47f8-bdaa-b685e1dcfef6huy.jpg",
                    "idUser": "6371c8e34a860a6021339d35",
                    "fullName": "Võ Thành Nhớ",
                    "createdAt": "2022-11-14T10:06:38.679Z"
                },
                {
                    "id": "637213a07a495a0e692cb58b",
                    "messageID": "6371f6a687ea3c9f3286962c",
                    "imageLink": null,
                    "content": "Hí",
                    "image": "https://mechat-v2.s3.ap-southeast-1.amazonaws.com/ed7bc862-9b4d-4e8b-89ed-c882957356c3huy.jpg",
                    "idUser": "6371c8e34a860a6021339d35",
                    "fullName": "Võ Thành Nhớ",
                    "createdAt": "2022-11-14T10:08:32.128Z"
                }
            ]
        }
```
### Thêm Report
```json
    - POST: no body
    - Dữ liệu gửi đi (form-data)
        {
            "messageId":"6371f6a687ea3c9f3286962c",
            "fileImage": file,
            "content": "abc"
        }
    - Dữ liệu trả về
        {
            "id": "637220127fb26c80ddbcf39a",
            "messageID": "6371f6a687ea3c9f3286962c",
            "content": "Hí",
            "imageLink": null,
            "image": "https://mechat-v2.s3.ap-southeast-1.amazonaws.com/ceb824d1-23e3-4b37-89a7-a77f81ef60f7huyhung.jpg",
            "createdAt": "2022-11-14T11:01:38.194Z"
        }
```
### Tìm Report theo Id
```json
    - GET: /:reportId
    - Dữ liệu gửi đi 
        http://localhost:3000/api/v3/reports/6372130d0fefee77861c8567
    - Dữ liệu trả về
        {
            "id": "6372130d0fefee77861c8567",
            "image": "https://mechat-v2.s3.ap-southeast-1.amazonaws.com/ef041dc4-876e-4ba1-8953-9ee1638ab4e3huy.jpg",
            "content": "Hí",
            "imageLink": null,
            "createdAt": "2022-11-14T08:04:54.867Z",
            "idUser": "6371c8e34a860a6021339d35",
            "fullName": "Võ Thành Nhớ"
        }
```
### Xóa Report 
```json
    - DELETE : /:reportId
    - Dữ liệu gửi đi 
        http://localhost:3000/api/v3/reports/
        {
            "status":true
        }
    - Dữ liệu trả về
        {
            "_id": "6372130d0fefee77861c8567",
            "messageID": "6371f6a687ea3c9f3286962c",
            "image": "https://mechat-v2.s3.ap-southeast-1.amazonaws.com/ef041dc4-876e-4ba1-8953-9ee1638ab4e3huy.jpg",
            "createdAt": "2022-11-14T10:06:05.157Z",
            "updatedAt": "2022-11-14T10:06:05.157Z",
            "__v": 0
        }
```
### Accept Report
```json
    - POST : /:reportId
    - Dữ liệu gửi đi 
        http://localhost:3000/api/v3/reports/6372132ef017982316f7858b
        {
            "status":true
        }
    - Dữ liệu trả về
        {
            "_id": "6372132ef017982316f7858b",
            "messageID": "6371f6a687ea3c9f3286962c",
            "image": "https://mechat-v2.s3.ap-southeast-1.amazonaws.com/7a40ff5e-ffa6-47f8-bdaa-b685e1dcfef6huy.jpg",
            "createdAt": "2022-11-14T10:06:38.679Z",
            "updatedAt": "2022-11-14T10:06:38.679Z",
            "__v": 0
        }
```
