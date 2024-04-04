const express = require('express');
const Router = express.Router();
const ReportController = require('../controllers/reportController');

Router.get('/',ReportController.getAllReports);

Router.post('/',ReportController.addReport);

Router.put('/:userId',ReportController.removeBlock);

Router
    .route('/:reportId')
    .get(ReportController.getReportById)
    .post(ReportController.acceptReport)
    .delete(ReportController.deleteReport);

module.exports = Router;