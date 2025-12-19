const swaggerJsDoc = require('swagger-jsdoc')

const swaggerOptions = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Homework Control API',
			version: '1.0.0',
			description: 'Homework Control backend API documentation',
		},
		servers: [
			{
				url: 'http://localhost:5000', // local server
				description: 'Local server',
			},
			{
				url: 'https://homeworkcontrol.onrender.com', // production server
				description: 'Global server',
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
		security: [{ bearerAuth: [] }],
	},
	apis: ['./src/routes/*.js'], // Swagger commentlar joylashgan route fayllar
}

module.exports = swaggerJsDoc(swaggerOptions)
