/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: Patient Management APIs
 */

/**
 * @swagger
 * /api/patients:
 *   post:
 *     summary: Create a new patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - phoneNumber
 *               - address
 *               - gender
 *               - bloodType
 *               - dateOfBirth
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *               bloodType:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Patient created successfully
 */

/**
 * @swagger
 * /api/patients:
 *   get:
 *     summary: Get all patients
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
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
 *         description: Patients fetched successfully
 */

/**
 * @swagger
 * /api/patients/{id}:
 *   get:
 *     summary: Get patient by id
 *     tags: [Patients]
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
 *         description: Patient fetched successfully
 *       404:
 *         description: Patient not found
 */

/**
 * @swagger
 * /api/patients/phone/{phoneNumber}:
 *   get:
 *     summary: Get patient by phone number
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: phoneNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient fetched successfully
 */

/**
 * @swagger
 * /api/patients/{id}:
 *   patch:
 *     summary: Update patient
 *     tags: [Patients]
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
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *               bloodType:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Patient updated successfully
 */
