import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const ENV = process.env.NODE_ENV || 'development';

const startServer = () => {
    try {
        app.listen(PORT, () => {
            console.clear(); // Clears previous clutter from the terminal
            
            console.log(`
  ____________________________________________________________________
 |                                                                    |
 |   ______   ______    __    __   _______        ______   __     __  |
 |  |   _  \\ |   _  \\  |  |  |  | |   ____|      |   _  \\  \\ \\   / /  |
 |  |  | |  ||  | |  | |  |  |  | |  |  __  ____ |  |_)  |  \\ \\_/ /   |
 |  |  | |  ||  | |  | |  |  |  | |  | |_ |/ ___||      /    \\   /    |
 |  |  |_|  ||  |_|  | |  \`--'  | |  |__| |      |  |\\  \\----.| |     |
 |  |______/ |______/   \\______/   \\______|      | _| \`._____||_|     |
 |                                                                    |
 |                --- DRUG-REVIVE BACKEND ONLINE ---                  |
 |____________________________________________________________________|
            `);

            console.log(`   [SYSTEM] : Server initialized successfully`);
            console.log(`   [PORT]   : http://localhost:${PORT}`);
            console.log(`   [ENV]    : ${ENV.toUpperCase()}`);
            console.log(`   [TIME]   : ${new Date().toLocaleString()}`);
            console.log(`  ____________________________________________________________________\n`);
            
            console.log(`  LOGS: Monitoring incoming requests...`);
        });
    } catch (error) {
        console.error(" [ERROR]  : Failed to start server:", error);
        process.exit(1);
    }
};

startServer();