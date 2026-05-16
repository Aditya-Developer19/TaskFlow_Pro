const express    = require('express');
const http       = require('http');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDB      = require('./src/config/db');
const initSocket     = require('./src/config/socket');
const { getIO }      = require('./src/config/socket');
const errorHandler   = require('./src/middleware/errorHandler');

const authRoutes      = require('./src/routes/auth.routes');
const projectRoutes   = require('./src/routes/project.routes');
const taskRoutes      = require('./src/routes/task.routes');
const userRoutes      = require('./src/routes/user.routes');
const analyticsRoutes = require('./src/routes/analytics.routes');

const app    = express();
const server = http.createServer(app);

connectDB();
initSocket(server);

// Attach io to every request
app.use((req, res, next) => { req.io = getIO(); next(); });

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth',      authRoutes);
app.use('/api/projects',  projectRoutes);
app.use('/api/tasks',     taskRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
