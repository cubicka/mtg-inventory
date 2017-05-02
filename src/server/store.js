import MemoryStore from 'express-session/session/memory'

var session_store = new MemoryStore()
export default session_store