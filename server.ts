import express, { Request, Response } from 'express'
import mongoose, { Document, Model } from 'mongoose'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'
import { User } from './models/user.js'

declare global {
	namespace Express {
		interface Request {
			user?: Record<string, any>
		}
	}
}

dotenv.config()
const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// Log middleware
app.use((req: Request, res: Response, next: express.NextFunction) => {
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
	next()
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode}`)
  })
// Database connection
;(async () => {
	mongoose.connect(process.env.MONGODB_URI as string)
	const db = mongoose.connection
	db.on('error', console.error.bind(console, 'MongoDB connection error:'))
	db.once('open', function () {
		console.log('Connected to MongoDB')
	})
})()

// Schema and Model
interface IRecord extends Document {
	name: string
	value: string
	deleted: boolean
}

const recordSchema = new mongoose.Schema<IRecord>(
	{
		name: { type: String, required: true },
		value: { type: String, required: true },
		deleted: { type: Boolean, default: false }
	},
	{ timestamps: true }
)

const Record: Model<IRecord> = mongoose.model<IRecord>('Record', recordSchema)

// JWT Authentication middleware
const authenticateJWT = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	const authHeader = req.headers.authorization

	if (authHeader) {
		const token = authHeader.split(' ')[1]
		const jwtSecret: string = process.env.JWT_SECRET || 'defaultSecret=1234567890'
		jwt.verify(token, jwtSecret, (err: any, user: any) => {
			if (err) {
				return res.sendStatus(403)
			}

			req.user = user
			next()
		})
	} else {
		res.sendStatus(401)
	}
}

// Routes
app.get('/records', authenticateJWT, async (req: Request, res: Response) => {
	const page: number = parseInt(req.query.page as string) || 1
	const limit: number = parseInt(req.query.limit as string) || 10
	const skip: number = (page - 1) * limit

	const query: any = { deleted: false }
	if (req.query.name) {
		query.name = { $regex: req.query.name as string, $options: 'i' }
	}

	const count: number = await Record.countDocuments(query)
	const records: IRecord[] = await Record.find(query).skip(skip).limit(limit).lean()

	res.json({
		count,
		totalPages: Math.ceil(count / limit),
		currentPage: page,
		data: records
	})
})

app.post('/records', authenticateJWT, async (req: Request, res: Response) => {
	const value: string = await randomString()
	const record: IRecord = new Record({ name: req.body.name, value })
	await record.save()

	res.json(record)
})

app.delete('/records/:id', authenticateJWT, async (req: Request, res: Response) => {
	const record: IRecord | null = await Record.findById(req.params.id)
	if (!record) {
		res.status(404).json({ message: 'Record not found' })
		return
	}
	record.deleted = true
	await record.save()

	res.json(record)
})

// Sign up route
app.post('/signUp', async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body

		const existingUser = await User.findOne({ email }).exec()
		if (existingUser) {
			return res.status(400).json({ message: 'User already exists' })
		}

		const hashedPassword = await bcrypt.hash(password, 10)

		const user = new User({ email, password: hashedPassword })
		await user.save()

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!)

		res.json({ token })
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Server error' })
	}
})
// Login route
app.post('/login', async (req: Request, res: Response) => {
	try {
		const user = await User.findOne({ email: req.body.email }).exec()
		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}

		const isMatch = await bcrypt.compare(req.body.password, user.password)
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid credentials' })
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!)

		// Add the user ID to the request object
		req.user = user._id

		res.json({ token })
	} catch (error: Error | unknown) {
		console.error(error)
		res.status(500).json({ message: 'Server error' })
	}
})

async function randomString(): Promise<string> {
	const saltRounds = 10
	const randomBytes = await bcrypt.genSalt(saltRounds)
	return randomBytes
}

app.listen(port, (): void => {
	console.log(`Server listening at http://localhost:${port} this is working`)
})
