const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const { initSocket } = require('./socket/socket');
const AuthRouter = require('./Routes/AuthRouter');
const AuthAlumniRouter = require('./Routes/AuthAlumniRoutes');
const uploadRoute = require('./Routes/routeUpload');
const eventRouter = require('./Routes/eventRoutes');
const messageRoutes = require('./Routes/messageRoutes');
const userRoutes = require('./Routes/userRoutes');
const connectCloudinary = require('./utils/cloudinary');
const AdminRoutes = require('./Routes/AdminRoutes');
const networkRoutes = require('./Routes/NetworkRoutes');
const postRoutes = require('./Routes/postRoutes');
require('./Models/db');

connectCloudinary();
const app = express();
const server = http.createServer(app);

// ✅ Allowed origins: localhost (dev) + frontend (prod)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://alumni-connect-puce.vercel.app/", // replace with your real Vercel URL
];

// Configure CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Initialize socket with same CORS config
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  }
});

initSocket(io);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('Backend is Working ✅');
});

// API Routes
app.use('/api/follow', followRoutes);
app.use('/api/auth', AuthRouter);
app.use('/api/user', userRoutes);
app.use('/api/network', networkRoutes);
app.use('/api/alumni', AuthAlumniRouter);
app.use('/api/upload', uploadRoute);
app.use('/api/events', eventRouter);
app.use('/api/messages', messageRoutes);
app.use('/admin', AdminRoutes);
app.use('/api/posts', postRoutes);

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
