const fetch = require('node-fetch');
const qs = require('querystring');
const bsKey = process.env.ER_KEY;

exports.read_rank = (req, res) => {
  fetch(`https://open-api.bser.io/v1/rank/top/1/1`, {
    headers: {
        'accept': 'application/json',
        'x-api-key': `${bsKey}`,
    }
}).then( ( response ) => {
  response.json().then((data) => {
    res.json(data.topRanks.slice(0,10));
  })
}).catch( function(error) {
  console.log("There has been error with fetch operation",error.message)});
};

exports.read_user_num = (req, res) => {
    let userQ = qs.escape(req.params.user);
    fetch(`https://open-api.bser.io/v1/user/nickname?query=${userQ}`, {
    headers: {
        'accept': 'application/json',
        'x-api-key': `${bsKey}`,
    }
}).then((response) => {
  response.json().then((data)=>{
    fetch(`https://open-api.bser.io/v1/user/games/${data.user.userNum}`, {
    headers: {
        'accept': 'application/json',
        'x-api-key': `${bsKey}`,
    }
}).then( ( response ) => {
  response.json().then((data)=>{
    res.json(data);
  })
})})
}).catch(function(error){
  console.log("There has been error with fetch operation",error.message);
})};
