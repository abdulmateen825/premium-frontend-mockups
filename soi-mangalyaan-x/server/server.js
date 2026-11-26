import express from 'express'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()
const port = Number(process.env.PORT || 3001)
const dataFile = join(dirname(fileURLToPath(import.meta.url)), 'data', 'reservations.json')
const interests = new Set(['Astronaut pathway', 'Science & research', 'Engineering & systems', 'Mission support', 'Just exploring'])

app.disable('x-powered-by')
app.use(express.json({ limit: '10kb' }))

app.get('/api/health', (_request, response) => response.json({ status: 'ok', service: 'SOI local concept backend' }))

app.post('/api/reserve', async (request, response) => {
  const { name, email, country, interest, conceptConsent } = request.body || {}
  const cleanName = typeof name === 'string' ? name.trim() : ''
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
  const cleanCountry = typeof country === 'string' ? country.trim() : ''
  if (cleanName.length < 2 || cleanName.length > 80) return response.status(400).json({ message: 'Enter a name between 2 and 80 characters.' })
  if (cleanEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return response.status(400).json({ message: 'Enter a valid email address.' })
  if (!cleanCountry || cleanCountry.length > 80) return response.status(400).json({ message: 'Enter a country or region up to 80 characters.' })
  if (!interests.has(interest)) return response.status(400).json({ message: 'Choose one of the listed areas of interest.' })
  if (conceptConsent !== 'on') return response.status(400).json({ message: 'Confirm that this is a fictional demo enquiry, not a real booking.' })

  try {
    await mkdir(dirname(dataFile), { recursive: true })
    let records = []
    try { records = JSON.parse(await readFile(dataFile, 'utf8')) } catch (error) { if (error.code !== 'ENOENT') throw error }
    const record = { id: randomUUID(), name: cleanName, email: cleanEmail, country: cleanCountry, interest, receivedAt: new Date().toISOString() }
    records.push(record)
    await writeFile(dataFile, `${JSON.stringify(records, null, 2)}\n`, 'utf8')
    return response.status(201).json({ message: 'Interest recorded for this local demo.', id: record.id })
  } catch (error) {
    console.error('Could not save reservation interest:', error.message)
    return response.status(500).json({ message: 'The local service could not save your request. Check that the project folder is writable, then try again.' })
  }
})

app.use((error, _request, response, _next) => {
  if (error.type === 'entity.too.large') return response.status(413).json({ message: 'The submitted form is too large.' })
  if (error instanceof SyntaxError) return response.status(400).json({ message: 'The request body must be valid JSON.' })
  console.error('Request failed:', error.message)
  return response.status(500).json({ message: 'The local service encountered an unexpected error.' })
})

app.listen(port, '127.0.0.1', () => console.log(`SOI concept API listening at http://127.0.0.1:${port}`))
