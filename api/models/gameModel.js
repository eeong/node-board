const mongoose = require('mongoose');

const { Schema } = mongoose;

const gameSchema = new Schema(
  {
    character:{
      type: String,
      required: true
    },
    characterSrc:{
      type: String,
      required: true
    },
    weapon:{
      type: String,
      required:false
    },
    nickname: {
      type: String,
      required: false
    },
    userNum: {
      type: Number,
      required: false
    },
    mode: {
      type:String,
      default:'솔로',
      required: true
    },
    date: {
      type: Date,
      default:Date.now,
    },
    titleCustom:{
      type: String,
      required: false
    },
    item:[
      
    ]
  },
  { collection: 'game' }
);

var month = {Jan:'01',Feb:'02',Mar:'03',Apr:'04',May:'05',Jun:'06',Jul:'07',Aug:'08',Sep:'09',Oct:'10',Nov:'11',Dec:'12'};

function getDate(d){
  let dArray = d.toString().split(' ').slice(1,4);
  return dArray[2]+'-'+month[dArray[0]]+'-'+dArray[1];
}
if(!gameSchema.title){
  gameSchema.virtual('title').get(function(){
    return getDate(this.date) + ' '+ this.character + ' ' + this.mode;
  });
}


gameSchema.set('toJSON', {getters:true, virtuals:true});

module.exports = mongoose.model('game', gameSchema);