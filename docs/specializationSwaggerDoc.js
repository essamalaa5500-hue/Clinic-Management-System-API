/**
 * @swagger
 * tags:
 *   name: Specialization
 *   description: Specialization Management APIs
 */

/**
 * @swagger
 * /specialization:
 *   post:
 *     summary: Create a new specialization
 *     tags: [Specialization]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Cardiology
 *               description:
 *                 type: string
 *                 example: Heart diseases and cardiovascular system.
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Specialization created successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /specialization:
 *   get:
 *     summary: Get all specializations
 *     tags: [Specialization]
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
 *         description: Specializations fetched successfully
 */

/**
 * @swagger
 * /specialization/{id}:
 *   get:
 *     summary: Get specialization by id
 *     tags: [Specialization]
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
 *         description: Specialization fetched successfully
 *       404:
 *         description: Specialization not found
 */

/**
 * @swagger
 * /specialization/{id}:
 *   patch:
 *     summary: Update specialization
 *     tags: [Specialization]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Specialization updated successfully
 *       404:
 *         description: Specialization not found
 */

/**
 * @swagger
 * /specialization/{id}/doctors:
 *   get:
 *     summary: Get all doctors in a specialization
 *     tags: [Specialization]
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
 *         description: Doctors fetched successfully
 *       404:
 *         description: Specialization not found
 */

/**
 * @swagger
 * /specialization/{id}:
 *   delete:
 *     summary: Delete specialization
 *     tags: [Specialization]
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
 *         description: Specialization deleted successfully
 *       404:
 *         description: Specialization not found
 */
