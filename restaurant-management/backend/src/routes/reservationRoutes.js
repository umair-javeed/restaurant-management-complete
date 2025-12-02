const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// Create new reservation
router.post('/', reservationController.createReservation);

// Get all reservations (with optional status/date filters)
router.get('/', reservationController.getAllReservations);

// Get reservation by ID
router.get('/:id', reservationController.getReservationById);

// Get reservations by customer phone
router.get('/customer/:phone', reservationController.getReservationsByCustomer);

// Update reservation status
router.patch('/:id/status', reservationController.updateReservationStatus);

// Delete reservation
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;
