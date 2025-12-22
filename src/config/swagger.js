const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Homework Control API',
			version: '1.0.0',
			description: 'Uyga vazifa tizimi API dokumentatsiyasi',
			contact: {
				name: 'API Support',
				email: 'support@example.com',
			},
		},
		servers: [
			{
				url: 'https://homeworkcontrol.onrender.com/api', // global URL
			},
			{
				url: 'http://localhost:5000/api', // lokal dev uchun
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	},
	apis: ['./src/routes/*.js', './src/controllers/*.js'], // fayllaringiz joylashgan joy
}

const swaggerSpec = swaggerJsdoc(options)

const swaggerDocs = (app, port) => {
	// Swagger UI
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

	// JSON format dokumentatsiya
	app.get('/api-docs.json', (req, res) => {
		res.setHeader('Content-Type', 'application/json')
		res.send(swaggerSpec)
	})

	console.log(
		`📚 Swagger docs available at https://homeworkcontrol.onrender.com/api-docs`
	)
	console.log(
		`📚 JSON docs available at https://homeworkcontrol.onrender.com/api-docs.json`
	)
}

module.exports = { swaggerDocs }
