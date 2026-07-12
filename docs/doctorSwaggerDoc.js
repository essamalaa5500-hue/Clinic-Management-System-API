/**
 * @swagger
 * tags:
 *   name: Doctor
 *   description: Doctor Management APIs
 */

/**
 * @swagger
 * /doctor:
 *   post:
 *     summary: Create a new doctor
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - specialization
 *               - consultationFee
 *               - workingDays
 *               - appointmentDuration
 *             properties:
 *               user:
 *                 type: string
 *                 example: 68723c6a6dd62a8a96b81234
 *               specialization:
 *                 type: string
 *                 example: 68723c6a6dd62a8a96b85678
 *               consultationFee:
 *                 type: number
 *                 example: 300
 *               workingDays:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     day:
 *                       type: string
 *                       enum:
 *                         - saturday
 *                         - sunday
 *                         - monday
 *                         - tuesday
 *                         - wednesday
 *                         - thursday
 *                         - friday
 *                     from:
 *                       type: string
 *                       example: "09:00"
 *                     to:
 *                       type: string
 *                       example: "17:00"
 *               appointmentDuration:
 *                 type: number
 *                 example: 30
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Doctor created successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User or specialization not found
 */

/**
 * @swagger
 * /doctor:
 *   get:
 *     summary: Get all doctors
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by doctor's name or specialization
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Doctors fetched successfully
 *       404:
 *         description: No doctors found
 */

/**
 * @swagger
 * /doctor/{id}:
 *   get:
 *     summary: Get doctor by id
 *     tags: [Doctor]
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
 *         description: Doctor fetched successfully
 *       404:
 *         description: Doctor not found
 */

/**
 * @swagger
 * /doctor/{id}:
 *   patch:
 *     summary: Update doctor
 *     tags: [Doctor]
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
 *               user:
 *                 type: string
 *               specialization:
 *                 type: string
 *               consultationFee:
 *                 type: number
 *               workingDays:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     day:
 *                       type: string
 *                       enum:
 *                         - saturday
 *                         - sunday
 *                         - monday
 *                         - tuesday
 *                         - wednesday
 *                         - thursday
 *                         - friday
 *                     from:
 *                       type: string
 *                     to:
 *                       type: string
 *               appointmentDuration:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Doctor updated successfully
 *       404:
 *         description: Doctor not found
 */
