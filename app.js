require('dotenv').config({ path: './variables.env' });
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
 
//const { errorMiddleware } = require('./middlewares/error.js');
const routes = require('./routes/routes.js');
//const db = require('./middlewares/db.js');
 
const app = express();
 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // limit each IP to 100 requests per windowMs
});
 
app.use(limiter);
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '50mb' }));
app.use(
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 })
);
 
//app.use(db.connectToDatabase);
app.use('/', routes);
//app.use(errorMiddleware);
 
const port = 4000;
 
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});