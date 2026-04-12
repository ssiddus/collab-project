import app from './app';
import dotenv from 'dotenv'
dotenv.config()
import logger from "./utils/logger"
const PORT = 9322;

app.listen(PORT, () => {
  logger.info(`server running on port ${PORT}`);
})
