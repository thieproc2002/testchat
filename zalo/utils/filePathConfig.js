export const iconExtends = ['docx', 'ppt', 'pptx', 'pdf', 'xlsx', 'csv', 'xls'];

export const icons = {
    docx: require('../assets/file-icon/word-icon.png'),
    ppt: require('../assets/file-icon/pwp-icon.png'),
    pptx: require('../assets/file-icon/pwp-icon.png'),
    pdf: require('../assets/file-icon/pdf-icon.png'),
    xlsx: require('../assets/file-icon/excel-icon.png'),
    csv: require('../assets/file-icon/excel-icon.png'),
    xls: require('../assets/file-icon/excel-icon.png'),
    blank: require('../assets/file-icon/blank.png'),
};

export const handleFileExtension = (uri) => {
    const fileExtend = uri.split('.');
    const fileEx = fileExtend[fileExtend.length - 1];

    return fileEx;
};

export const handleFileName = (uri) => {
    const filePaths = uri.split('/');
    const fileName = filePaths[filePaths.length - 1];

    return fileName;
};
