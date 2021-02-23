const fs = require('fs');
const path = require('path')


/********** Read item data ************/ 

const weapon = (JSON.parse((fs.readFileSync(path.join(__dirname,'../assets/ItemWeapon.json'), 'utf8')))).data;
const armor = (JSON.parse((fs.readFileSync(path.join(__dirname,'../assets/ItemArmor.json'), 'utf8')))).data;
const charList = (fs.readFileSync(path.join(__dirname,'../assets/character'), 'utf8')).split(',');
const trans = JSON.parse((fs.readFileSync(path.join(__dirname,'../assets/trans.json'), 'utf8'))).data;

/********** Custom function ************/



const transStatus = function(stat) {
	var result=[]
	for(i in stat){
		trans.filter((v) => {
			if(v[0] == i) result.push([v[1], stat[i]])
			else if(v[0] == stat[i]) result.push(['무기',v[1]])
		})
	}
	return result;
}

const getValidItem = function(item) {
	let items = Object.fromEntries(Object.entries(item).filter(v => v[1] !== 0))
	items.transKr = transStatus(items);
  return items
}



const getItem = function(ctgr, itemcode) {
	return  getValidItem(ctgr.filter((v)=>{
			if(v.code == itemcode) return v;
			else return '';
		})[0])
  
}

module.exports = { weapon,armor,charList,getItem }