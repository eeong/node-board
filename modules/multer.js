	const fs = require("fs-extra");
	const moment = require("moment")	
	const path = require("path");
	const multer = require("multer");
	const { v4: uuidv4} = require("uuid");
	const imgExt = ['jpg','jpeg','gif','png','svg'];
	const allowExt = [...imgExt, 'pdf', 'hwp', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx' ];
	
	const storage = multer.diskStorage({
		destination: (req, file, cb) => {
			var folder = path.join(__dirname, '../storage', moment().format('YYMMDD'))
			//if(!fs.existsSync(folder)) fs.mkdirSync(folder); //node fs
			fs.ensureDirSync(folder);
			cb(null, folder);
		},
		filename: (req, file, cb) => {
			var ext = path.extname(file.originalname);
			var name = moment().format('YYMMDD') + '-' +uuidv4() + ext;
		 cb(null, name);
		}
	});
	
	const fileFilter = (req, file, cb) => {
		let ext = path.extname(file.originalname).replace(".","").toLowerCase();
		if(allowExt.includes(ext)) {
			req.allow = true;
			req.ext = ext;
			cb(null, true);
		}
		else {
			req.allow = false;
			req.ext = ext;
			cb(null, false);
		}
	}
	 
	const upload = multer({ storage, fileFilter, limits: {fileSize: 2048000} });

	module.exports = { upload, imgExt, allowExt};