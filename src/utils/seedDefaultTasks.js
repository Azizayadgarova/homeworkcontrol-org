const DefaultTask = require('../models/DefaultTask')
const LEVELS = require('../constants/levels')

const seedDefaultTasks = async () => {
	const count = await DefaultTask.countDocuments()
	if (count > 0) return

	await DefaultTask.insertMany([
		{
			title: 'Alphabet & Basic Words',
			description: 'Learn basic letters and words',
			level: LEVELS.BEGINNER,
		},
		{
			title: 'Simple Sentences',
			level: LEVELS.ELEMENTARY,
		},
		{
			title: 'Grammar & Tenses',
			level: LEVELS.INTERMEDIATE,
		},
		{
			title: 'Essay Writing',
			level: LEVELS.ADVANCED,
		},
		{
			title: 'Professional Presentation',
			level: LEVELS.PROFESSIONAL,
		},
	])

	console.log('✅ Default tasks seeded')
}

module.exports = seedDefaultTasks
