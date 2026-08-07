import 'dotenv/config'

process.env.DATABASE_URI = `file:/tmp/susoncodes-payload-vitest-${process.pid}.sqlite`
process.env.DATABASE_AUTH_TOKEN = ''
process.env.PAYLOAD_SECRET ||= 'integration-test-secret'
