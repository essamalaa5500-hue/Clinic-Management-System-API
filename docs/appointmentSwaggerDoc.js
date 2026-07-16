    /**
     * @swagger
     * tags:
     *   name: Appointment
     *   description: Appointment Management APIs
     */

    /**
     * @swagger
     * /appointment:
     *   post:
     *     summary: Create a new appointment
     *     tags: [Appointment]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - patient
     *               - doctor
     *               - date
     *               - startTime
     *               - endTime
     *               - consultationFee
     *             properties:
     *               patient:
     *                 type: string
     *                 example: 6872bc6a8e4e8e9a1c123456
     *               doctor:
     *                 type: string
     *                 example: 6872bc6a8e4e8e9a1c654321
     *               date:
     *                 type: string
     *                 format: date
     *                 example: 2026-07-15
     *               startTime:
     *                 type: string
     *                 example: "10:00"
     *               endTime:
     *                 type: string
     *                 example: "10:30"
     *               consultationFee:
     *                 type: number
     *                 example: 300
     *               notes:
     *                 type: string
     *                 example: First visit
     *     responses:
     *       201:
     *         description: Appointment created successfully
     */

    /**
     * @swagger
     * /appointment:
     *   get:
     *     summary: Get appointments with filters
     *     tags: [Appointment]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: patient
     *         schema:
     *           type: string
     *       - in: query
     *         name: doctor
     *         schema:
     *           type: string
     *       - in: query
     *         name: status
     *         schema:
     *           type: string
     *           enum: [pending, confirmed, canceled, completed]
     *       - in: query
     *         name: date
     *         schema:
     *           type: string
     *           format: date
     *       - in: query
     *         name: search
     *         schema:
     *           type: string
     *         description: Search patient by name or phone number
     *       - in: query
     *         name: sort
     *         schema:
     *           type: string
     *         example: -date,startTime
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Appointments fetched successfully
     */

    /**
     * @swagger
     * /appointment/all:
     *   get:
     *     summary: Get all appointments without pagination
     *     tags: [Appointment]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: All appointments fetched successfully
     */

    /**
     * @swagger
     * /appointment/today:
     *   get:
     *     summary: Get today's appointments
     *     tags: [Appointment]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Today's appointments fetched successfully
     */

    /**
     * @swagger
     * /appointment/doctor/{id}:
     *   get:
     *     summary: Get appointments by doctor
     *     tags: [Appointment]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Doctor appointments fetched successfully
     */

    /**
     * @swagger
     * /appointment/patient/{id}:
     *   get:
     *     summary: Get appointments by patient
     *     tags: [Appointment]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Patient appointments fetched successfully
     */

    /**
     * @swagger
     * /appointment/{id}:
     *   get:
     *     summary: Get appointment by id
     *     tags: [Appointment]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Appointment fetched successfully
     *       404:
     *         description: Appointment not found
     */

    /**
     * @swagger
     * /appointment/{id}:
     *   patch:
     *     summary: Update appointment
     *     tags: [Appointment]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: false
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               patient:
     *                 type: string
     *               doctor:
     *                 type: string
     *               date:
     *                 type: string
     *                 format: date
     *               startTime:
     *                 type: string
     *               endTime:
     *                 type: string
     *               consultationFee:
     *                 type: number
     *               notes:
     *                 type: string
     *     responses:
     *       200:
     *         description: Appointment updated successfully
     */

    /**
     * @swagger
     * /appointment/{id}/status:
     *   patch:
     *     summary: Update appointment status
     *     tags: [Appointment]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - status
     *             properties:
     *               status:
     *                 type: string
     *                 enum:
     *                   - pending
     *                   - confirmed
     *                   - canceled
     *                   - completed
     *     responses:
     *       200:
     *         description: Appointment status updated successfully
     */

    /**
     * @swagger
     * /appointment/{id}:
     *   delete:
     *     summary: Delete appointment
     *     tags: [Appointment]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Appointment deleted successfully
     *       404:
     *         description: Appointment not found
     */
