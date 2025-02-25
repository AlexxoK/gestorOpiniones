import { config } from 'dotenv';
import { initServer } from './configs/server.js';
import { createSinCategoria, createAdmin, createUser } from './configs/mongo.js';

config();

const initializeServer = async () => {

    await initServer();
    await createAdmin();
    await createUser();
    await createSinCategoria();
};

initializeServer();