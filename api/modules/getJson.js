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
			else if(v[0] == stat[i]) result.push(['무기타입',v[1]])
		})
	}
	return result;
}

const getValidItem = function(item) {
	let items = Object.fromEntries(Object.entries(item).filter(v => v[1] !== 0))
	items.transKr = transStatus(items);
  return transStatus(items);
}

const getItem = function(ctgr, itemcode) {
	return getValidItem(ctgr.filter((v)=>{
			if(v.code == itemcode) return v;
			else return '';
		})[0])
}

const reverseTrans = function(itemKr){
	return trans.filter((v)=>{
		let result;
		if(v[1] === itemKr) result =v[0];
		return result;
	})
}

// add transKr to Json File
function addTransKr(){
	for(var i in armor){
		armor[i].transKr=(getValidItem(armor[i]));
	};
	let json = JSON.stringify(armor)
	fs.writeFileSync('remakeArmor.json', json  )
}

module.exports = { weapon,armor,charList,getItem,reverseTrans }