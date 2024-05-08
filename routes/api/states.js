const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');



router.route('/')
    .get(statesController.getAllStates)
    router.route('/:state')
        .get(statesController.getState);
    router.route('/:state/funfact')
        .get(statesController.getFunFact)
        .post(statesController.createFunFact)
        .patch(statesController.updateFunFact)
        .delete(statesController.deleteFunFact);  
    router.route('/:state/capital')
        .get(statesController.getCapital);
    router.route('/:state/nickname')
        .get(statesController.getNickname);
    router.route('/:state/population')
        .get(statesController.getPopulation);
    router.route('/:state/admission')
        .get(statesController.getAdmission);


module.exports = router;