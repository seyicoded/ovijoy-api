import "dotenv/config"

export default ()=>{
    return {
        "development": {
          "username": process.env.DB_USERNAME,
          "password": process.env.DB_PASSWORD,
          "database": process.env.DB_NAME,
          "host": process.env.DB_HOST,
          "dialect": process.env.DB_DIALECT,
          "port": process.env.DB_PORT,
          "logging": false,
          "ssl": {
            "require": (process.env.DB_SSL == 'yes') ? true : false,
            rejectUnauthorized: false,
          }
        },
        "test": {
          "username": process.env.DB_USERNAME,
          "password": process.env.DB_PASSWORD,
          "database": process.env.DB_NAME,
          "host": process.env.DB_HOST,
          "dialect": process.env.DB_DIALECT,
          "port": process.env.DB_PORT,
          "logging": false,
          "ssl": {
            "require": (process.env.DB_SSL == 'yes') ? true : false,
            rejectUnauthorized: false,
          }
        },
        "production": {
          "username": process.env.DB_USERNAME,
          "password": process.env.DB_PASSWORD,
          "database": process.env.DB_NAME,
          "host": process.env.DB_HOST,
          "dialect": process.env.DB_DIALECT,
          "port": process.env.DB_PORT,
          "logging": false,
          "ssl": {
            "require": (process.env.DB_SSL == 'yes') ? true : false,
            rejectUnauthorized: false,
          }
        }
      }
      
}