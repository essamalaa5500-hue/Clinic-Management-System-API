/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard & Analytics APIs
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard overview
 *     description: Returns dashboard cards and revenue statistics.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 */

/**
 * @swagger
 * /api/dashboard/appointments-per-month:
 *   get:
 *     summary: Get appointments and revenue per month
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         required: false
 *         schema:
 *           type: integer
 *           example: 2026
 *         description: Year to retrieve statistics for
 *     responses:
 *       200:
 *         description: Monthly appointments statistics retrieved successfully
 */

/**
 * @swagger
 * /api/dashboard/top-doctors:
 *   get:
 *     summary: Get top 5 doctors
 *     description: Returns the doctors with the highest completed appointments and revenue.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         required: false
 *         schema:
 *           type: integer
 *           example: 2026
 *     responses:
 *       200:
 *         description: Top doctors retrieved successfully
 */

/**
 * @swagger
 * /api/dashboard/top-patients:
 *   get:
 *     summary: Get top 5 patients
 *     description: Returns patients with the highest number of completed appointments.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         required: false
 *         schema:
 *           type: integer
 *           example: 2026
 *     responses:
 *       200:
 *         description: Top patients retrieved successfully
 */

/**
 * @swagger
 * /api/dashboard/doctor-performance:
 *   get:
 *     summary: Get doctor performance statistics
 *     description: Returns appointment statistics, revenue and completion rate for each doctor.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         required: false
 *         schema:
 *           type: integer
 *           example: 2026
 *     responses:
 *       200:
 *         description: Doctor performance retrieved successfully
 */
