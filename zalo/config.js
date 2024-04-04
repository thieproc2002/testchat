
import { io } from 'socket.io-client';

console.log('API -->', "http://localhost:8091/api/v3");
export default {
    LINK_API:"http://localhost:8091/api/v3",
    LINK_API_LOCAL:"http://localhost:8091"
};

export const socket = io('http://localhost:8900', {
    transports: ['websocket'],
    //reconnection: true,
    withCredentials: true,
});

export const checkPhoneNumber = (phoneNumber) => {
    var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;

    if (vnf_regex.test(phoneNumber) == false) {
        return false;
    }
    return true;
};

export const regexPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/

export const createFormData = (images, key) => {
    const _images = images.map(link => {
        let uriParts = link.split('.');
        const path = link.split('/');
        let fileType = uriParts[uriParts.length - 1];
        let nameFile = path[path.length - 1];
        //console.log();
        const imagePath = ['png', 'jpg', 'jpeg'];
        
        return {
            uri: link,
            type: imagePath.includes(fileType) ? `image/${fileType}` : `video/mp4`,
            name: imagePath.includes(fileType) ? nameFile : nameFile.replace('.mov', '.mp4'),
        };
    })
   
    const formData = new FormData();
    //console.log(image);
    _images.forEach(image => {
        // console.log(image, key);
        formData.append(key, image);
    });

    return formData;
};


export const createFormDataUpdate = (imageLink, key) => {
    let uriParts = imageLink.split('.');
    const path = imageLink.split('/');
    let fileType = uriParts[uriParts.length - 1];
    let nameFile = path[path.length - 1];
    //console.log();
    const imagePath = ['png', 'jpg', 'jpeg'];

    const image = {
        uri: imageLink,
        type: imagePath.includes(fileType) ? `image/${fileType}` : `video/mp4`,
        name: imagePath.includes(fileType) ? nameFile : nameFile.replace('.mov', '.mp4'),
    };

    let formData = new FormData();
    //console.log(image);
    formData.append(key, image);

    return formData;
};

export const createFormDataUpdateAvatarGroup = (imageLink, key1, userId, key2) => {
    let uriParts = imageLink.split('.');
    const path = imageLink.split('/');
    let fileType = uriParts[uriParts.length - 1];
    let nameFile = path[path.length - 1];
    //console.log();
    const imagePath = ['png', 'jpg', 'jpeg'];

    const image = {
        uri: imageLink,
        type: imagePath.includes(fileType) ? `image/${fileType}` : `video/mp4`,
        name: imagePath.includes(fileType) ? nameFile : nameFile.replace('.mov', '.mp4'),
    };

    let formData = new FormData();
    //console.log(image);
    formData.append(key1, userId);
    formData.append(key2, image);

    return formData;
};