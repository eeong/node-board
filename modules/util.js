const path = require("path");
const alert = (msg,location) => {
	return `<script>	alert('${msg}'); location.href = '${location}';	</script>`;
}

const getPath = (filename, mode = 'abs') => mode == 'abs' ? 
	path.join(__dirname, '../storage', filename.substr(0,6), filename) :
	`/upload/${filename.substr(0, 6)}/${filename}`;

const getExt = (filename, mode = 'lower') =>{ 
	if(mode == "lower") 
		return path.extname(filename).replace('.','').toLowerCase(); 
	else
		return path.extname(filename).replace('.','').toUpperCase();
	}

const txtCut = v => v.length > 20 ? v.substr(0, 20) + '...': v;
module.exports = {alert, getPath, getExt, txtCut};