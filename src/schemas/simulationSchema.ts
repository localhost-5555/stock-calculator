// src/schemas/simulationSchema.ts
import { z } from 'zod'

export const simulationSchema = z.object({
    company: z.object({ name: z.string(), code: z.string() })
    .nullish()
    .refine(val => val != null, { message: '❌ Select a company' }),
    quantity: z.number({ error: '❌ Required' }).positive('Must be greater than 0').int('Must be an integer'),
    buyPrice: z.number({ error: '❌ Required' }).positive('Must be greater than 0'),
    priceNow: z.number({ error: '❌ Select a company first' }).positive('Fetch a stock price first'),
})