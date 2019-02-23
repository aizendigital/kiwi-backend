const config = {
  production: {
    secret: process.env.secret,
    MONGO_URI: process.env.MONGO_URI,
    port: process.env.PORT,
  },
  development: {
    secret: 'IDAR',
    MONGO_URI: 'mongodb://localhost/icyjson',
    port: 3000,
  },
};

export const getConfig = env => config[env] || config.development;
