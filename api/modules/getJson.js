const fs = require('fs');
const path = require('path')


/********** Read item data ************/ 

const weapon = (JSON.parse((fs.readFileSync(path.join(__dirname,'../assets/remakeWeapon.json'), 'utf8'))));
const armor = (JSON.parse((fs.readFileSync(path.join(__dirname,'../assets/remakeArmor.json'), 'utf8'))));
const misc = (JSON.parse((fs.readFileSync(path.join(__dirname,'../assets/ItemMisc.json'), 'utf8')))).data;
const consum = (JSON.parse((fs.readFileSync(path.join(__dirname,'../assets/ItemConsumable.json'), 'utf8')))).data;
const special = (JSON.parse((fs.readFileSync(path.join(__dirname,'../assets/ItemSpecial.json'), 'utf8')))).data;
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

/* const getItem = function(ctgr, itemcode) {
	return getValidItem(ctgr.filter((v)=>{
			if(v.code == itemcode) return v;
			else return '';
		})[0])
} */

const getItem = function(ctgr, itemcode) {
	return ctgr.filter((v)=>{
			if(v.code == itemcode) return v;
			else return '';
		})
}

const reverseTrans = function(itemKr){
	return trans.filter((v)=>{
		let result;
		if(v[1] === itemKr) result =v[0];
		return result;
	})
}

const getCraftMap = function(mate1,mate2){
	let first = getCraft(mate1,mate2)
	for(var i in first){
		if(first[i].makeMaterial1) { 
			first[i].sub = getCraft(first[i].makeMaterial1,first[i].makeMaterial2)
			for(var j in first[i].sub){
				if(first[i].sub[j].makeMaterial1){
					first[i].sub[j].sub = getCraft(first[i].sub[j].makeMaterial1,first[i].sub[j].makeMaterial2)
					for(var k in first[i].sub[j].sub){
						if(first[i].sub[j].sub[k].makeMaterial1){
							first[i].sub[j].sub[k].sub = getCraft(first[i].sub[j].sub[k].makeMaterial1,first[i].sub[j].sub[k].makeMaterial2)
						}
					}
			}}
		}
	}
	return first;
}
function getCraft(mate1,mate2){
	let sort1 = checkItemType(mate1);
	let sort2 = checkItemType(mate2);
	return [findCraft(sort1,mate1),findCraft(sort2,mate2)];
}

function findCraft(sort,code){
	return (sort.filter((v)=>{return v.code == code}))[0]
}

function checkItemType(code){
	let sort = {1:weapon,2:armor,3:consum,4:misc,5:special}
	return sort[code.toString()[0]];
}

function sortArmor(armors){
	let result = [];
	for(v in armors) {
		if(v.itemGrade=='Legend') result.push(v);
		else if(v.itemGrade=='Epic') result.push(v);
		else if(v.itemGrade=='Rare') result.push(v);
		else if(v.itemGrade=='Uncommon') result.push(v);
		else if(v.itemGrade=='Common') result.push(v);
	}
	return result;
} 


// add transKr to Json File
function addTransKr(){
	for(var i in armor){
		armor[i].transKr=(getValidItem(armor[i]));
	};
	let json = JSON.stringify(armor)
	fs.writeFileSync('remakeArmor.json', json  )
}

module.exports = { weapon,armor,charList,getItem,reverseTrans,sortArmor,getCraftMap }