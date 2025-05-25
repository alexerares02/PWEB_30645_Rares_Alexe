const db = require('../models')
const Offer = db.offers


// 1. create offer
const addOrUpdateOffer = async (req, res) => {
    const { courseID, discount } = req.body;
  
    try {
      let offer = await Offer.findOne({ where: { courseID } });
  
      if (offer) {
        // update existing
        offer.discount = discount;
        await offer.save();
      } else {
        // create new
        offer = await Offer.create({ courseID, discount });
      }
  
      res.status(200).json({ message: 'Oferta salvată', offer });
    } catch (err) {
      res.status(500).json({ message: 'Eroare server', error: err });
    }
  };

// 2. get all offers
const getAllOffers = async (req, res) => {
    try {
      const offers = await Offer.findAll();
      res.status(200).send(offers);
    } catch (err) {
      res.status(500).send({ error: 'Eroare la extragerea ofertelor' });
    }
  };

// 3. get single offer 
const getOneOffer = async (req, res) => {
    let id = req.params.id
    let offer = await Offer.findOne({ where: { id: id }})
    res.status(200).send(offer)
}

// 4. update offer
const updateOffer = async (req, res) => {
    let id = req.params.id
    const offer = await Offer.update(req.body, { where: { id: id }})
    res.status(200).send(offer)
}

// 5. delete offer by id
const deleteOffer = async (req, res) => {
    let id = req.params.id
    await Offer.destroy({ where: { id: id }} )
    res.status(200).send('Offer is deleted !')
}

module.exports = {
    addOrUpdateOffer,
    getAllOffers,
    getOneOffer,
    updateOffer,
    deleteOffer
}

