const offerController = require('../controllers/offerController.js')
const verifyToken = require('../middleware/authMiddleware.js')

const router = require('express').Router()

router.post('/add', verifyToken, offerController.addOrUpdateOffer)
router.get('/all', verifyToken, offerController.getAllOffers)
router.get('/:id', verifyToken, offerController.getOneOffer)
router.put('/:id', verifyToken, offerController.updateOffer)
router.delete('/:id', verifyToken, offerController.deleteOffer)

module.exports = router