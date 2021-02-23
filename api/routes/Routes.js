const express = require('express');
const router = express.Router();
const recBuilder = require('../controllers/recController');
const searchApi = require('../controllers/searchController');

router.get(['/','/search'], searchApi.read_rank);

router.get('/search/:user', searchApi.read_user_num);

router.get('/search/:user/:mode', searchApi.read_user_rank);

router.get('/recs', recBuilder.list_all_recs)

router.post('/recs', recBuilder.create_a_rec)

router.get('/recs/armor', recBuilder.read_itemArmor)

router.get('/recs/weapon', recBuilder.read_itemWeapon)

router.get('/recs/:recId', recBuilder.read_a_rec)

router.put('/recs/:recId', recBuilder.update_a_rec)

router.delete('/recs/:recId', recBuilder.delete_a_rec)

module.exports = router;