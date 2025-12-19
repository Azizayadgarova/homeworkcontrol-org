const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Homework Control API',
			version: '1.0.0',
			description: 'Homework Control System API Documentation',
			contact: {
				name: 'API Support',
				email: 'support@example.com',
			},
		},
		servers: [
			{
				url: 'http://localhost:5000',
				description: 'Development server',
			},
			{
				url: 'https://homeworkcontrol.onrender.com',
				description: 'Production server',
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
	apis: ['./src/routes/*.js', './src/controllers/*.js'], // API fayllari joyi
}

const swaggerSpec = swaggerJsdoc(options)

const swaggerDocs = (app, port) => {
	// Swagger page
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

	// Docs in JSON format
	app.get('/api-docs.json', (req, res) => {
		res.setHeader('Content-Type', 'application/json')
		res.send(swaggerSpec)
	})

	console.log(`📚 Swagger docs available at http://localhost:${port}/api-docs`)
}

module.exports = { swaggerDocs }
