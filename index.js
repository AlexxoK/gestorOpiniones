import { config } from 'dotenv';
import { initServer, createSinCategoria } from './configs/server.js';

config();

const initializeServer = async () => {

    await initServer();
    
    await createSinCategoria();
};

initializeServer();