/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Expense Management APIs
 */

/**
 * @swagger
 * /expenses:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *               - amount
 *             properties:
 *               title:
 *                 type: string
 *                 example: Clinic Rent
 *               category:
 *                 type: string
 *                 enum:
 *                   - salary
 *                   - rent
 *                   - electricity
 *                   - water
 *                   - internet
 *                   - medical_supplies
 *                   - maintenance
 *                   - marketing
 *                   - other
 *               amount:
 *                 type: number
 *                 example: 5000
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2026-07-12
 *               paymentMethod:
 *                 type: string
 *                 enum:
 *                   - cash
 *                   - card
 *                   - bank_transfer
 *                   - wallet
 *               notes:
 *                 type: string
 *                 example: Monthly clinic rent
 *     responses:
 *       201:
 *         description: Expense created successfully
 */

/**
 * @swagger
 * /expenses:
 *   get:
 *     summary: Get all expenses
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: -amount
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
 *         description: Expenses fetched successfully
 */

/**
 * @swagger
 * /expenses/{id}:
 *   get:
 *     summary: Get expense by id
 *     tags: [Expenses]
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
 *         description: Expense fetched successfully
 *       404:
 *         description: Expense not found
 */

/**
 * @swagger
 * /expenses/{id}:
 *   patch:
 *     summary: Update expense
 *     tags: [Expenses]
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
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum:
 *                   - salary
 *                   - rent
 *                   - electricity
 *                   - water
 *                   - internet
 *                   - medical_supplies
 *                   - maintenance
 *                   - marketing
 *                   - other
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               paymentMethod:
 *                 type: string
 *                 enum:
 *                   - cash
 *                   - card
 *                   - bank_transfer
 *                   - wallet
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Expense updated successfully
 */

/**
 * @swagger
 * /expenses/{id}:
 *   delete:
 *     summary: Delete expense
 *     tags: [Expenses]
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
 *         description: Expense deleted successfully
 *       404:
 *         description: Expense not found
 */

/**
 * @swagger
 * /expenses/statistics:
 *   get:
 *     summary: Get expense statistics
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Expense statistics fetched successfully
 */

/**
 * @swagger
 * /expenses/per-month:
 *   get:
 *     summary: Get monthly expenses
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           example: 2026
 *     responses:
 *       200:
 *         description: Monthly expenses fetched successfully
 */

/**
 * @swagger
 * /expenses/categories:
 *   get:
 *     summary: Get expenses grouped by category
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           example: 2026
 *     responses:
 *       200:
 *         description: Expenses by category fetched successfully
 */
