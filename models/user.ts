import { Document, model, Schema } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUser extends Document {
	email: string
	password: string
}

const userSchema = new Schema<IUser>({
	email: { type: String, required: true },
	password: { type: String, required: true }
})

userSchema.pre<IUser>('save', async function (next) {
	const user = this

	if (!user.isModified('password')) {
		return next()
	}

	try {
		const salt = await bcrypt.genSalt(10)
		user.password = await bcrypt.hash(user.password, salt)
		next()
	} catch (error: any | undefined) {
		return next(error)
	}
})

export const User = model<IUser>('User', userSchema)
