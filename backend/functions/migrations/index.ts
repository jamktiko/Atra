import { Handler } from 'aws-lambda';
import { getPool } from '../shared/db';

export const handler: Handler = async (event, ctx) => {
  console.log('Migrations started!');

  const pool = await getPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(`
      CREATE SCHEMA IF NOT EXISTS AtraDatabase DEFAULT CHARACTER SET utf8;
      USE AtraDatabase;

      CREATE TABLE IF NOT EXISTS User (
        user_id VARCHAR(255) NOT NULL,
        cognito_sub VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(45) NOT NULL,
        first_name VARCHAR(25) NOT NULL,
        last_name VARCHAR(45) NOT NULL,
        PRIMARY KEY (cognito_sub),
        UNIQUE KEY idUser_UNIQUE (user_id)
      ) ENGINE=InnoDB;

      CREATE TABLE IF NOT EXISTS Customer (
        customer_id INT NOT NULL AUTO_INCREMENT,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(45),
        first_name VARCHAR(25),
        last_name VARCHAR(45),
        notes TEXT,
        cognito_sub VARCHAR(255) NOT NULL,
        PRIMARY KEY (customer_id),
        UNIQUE KEY ux_customer_email (email, User_user_id),
        INDEX fk_Customer_User1_idx (User_user_id),
        CONSTRAINT fk_Customer_User1 FOREIGN KEY (User_user_id) REFERENCES User(cognito_sub)
          ON DELETE RESTRICT
      ) ENGINE=InnoDB;

      CREATE TABLE IF NOT EXISTS PublicInk (
        ink_id INT NOT NULL AUTO_INCREMENT,
        product_name VARCHAR(100) NOT NULL,
        manufacturer VARCHAR(100) NOT NULL,
        color VARCHAR(100) NOT NULL,
        recalled TINYINT,
        image_url VARCHAR(255),
        size VARCHAR(45),
        PRIMARY KEY (ink_id),
        UNIQUE KEY ux_publicink_product (product_name, manufacturer, size)
      ) ENGINE=InnoDB;

      CREATE TABLE IF NOT EXISTS UserInk (
        user_ink_id INT NOT NULL AUTO_INCREMENT,
        batch_number VARCHAR(40),
        opened_at DATE,
        expires_at DATE,
        favorite TINYINT,
        PublicInk_ink_id INT NOT NULL,
        cognito_sub VARCHAR(255) NOT NULL,
        PRIMARY KEY (user_ink_id),
        INDEX fk_UserInk_PublicInk1_idx (PublicInk_ink_id),
        INDEX fk_UserInk_User1_idx (User_user_id),
        UNIQUE KEY user_ink_id_UNIQUE (user_ink_id),
        CONSTRAINT fk_UserInk_PublicInk1 FOREIGN KEY (PublicInk_ink_id) REFERENCES PublicInk(ink_id)
          ON DELETE RESTRICT,
        CONSTRAINT fk_UserInk_User1 FOREIGN KEY (User_user_id) REFERENCES User(cognito_sub)
          ON DELETE RESTRICT
      ) ENGINE=InnoDB; 

      CREATE TABLE IF NOT EXISTS Entry (
        entry_id INT NOT NULL AUTO_INCREMENT,
        entry_date DATETIME NOT NULL,
        comments TEXT,
        cognito_sub VARCHAR(255) NOT NULL,
        Customer_customer_id INT NULL,
        PRIMARY KEY (entry_id),
        UNIQUE KEY idEntry_UNIQUE (entry_id),
        INDEX fk_Entry_User1_idx (User_user_id),
        INDEX fk_Entry_Customer1_idx (Customer_customer_id),
        CONSTRAINT fk_Entry_User1 FOREIGN KEY (User_user_id) REFERENCES User(cognito_sub)
          ON DELETE RESTRICT,
        CONSTRAINT fk_Entry_Customer1 FOREIGN KEY (Customer_customer_id) REFERENCES Customer(customer_id)
          ON DELETE SET NULL
      ) ENGINE=InnoDB;`);

    await conn.query(`
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size)
      VALUES
      ('Panthera Black', 'Panthera Ink', 'Black', 0, 'https://images.pexels.com/photos/34155037/pexels-photo-34155037.jpeg', '30ml'),
      ('Panthera Shadow', 'Panthera Ink', 'Dark Gray', 0, 'https://images.pexels.com/photos/34155037/pexels-photo-34155037.jpeg', '30ml'),
      ('Eternal Jet Black', 'Eternal Ink', 'Black', 0, 'https://images.pexels.com/photos/34155037/pexels-photo-34155037.jpeg', '30ml'),
      ('Eternal Chocolate Brown', 'Eternal Ink', 'Brown', 0, 'https://images.pexels.com/photos/34155037/pexels-photo-34155037.jpeg', '30ml'),
      ('World Famous London Fog', 'World Famous Ink', 'Gray', 0, 'https://images.pexels.com/photos/34155037/pexels-photo-34155037.jpeg', '30ml'),
      ('World Famous Mint Green', 'World Famous Ink', 'Green', 0, 'https://images.pexels.com/photos/34155037/pexels-photo-34155037.jpeg', '180ml'),
      ('Intenze Chrome Yellow', 'Intenze', 'Yellow', 0, 'https://images.pexels.com/photos/34155037/pexels-photo-34155037.jpeg', '22ml'),
      ('Intenze Purple Rain', 'Intenze', 'Purple', 0, 'https://images.pexels.com/photos/34155037/pexels-photo-34155037.jpeg', '30ml'),
      ('Radiant Bright Orange', 'Radiant Ink', 'Orange', 0, 'https://images.pexels.com/photos/34155037/pexels-photo-34155037.jpeg', '30ml'),
      ('Radiant Deep Turquoise', 'Radiant Ink', 'Turquoise', 0, 'https://images.pexels.com/photos/34155037/pexels-photo-34155037.jpeg', '30ml'),
      ('Dynamic Black', 'Dynamic', 'Black', 0, 'https://images.pexels.com/photos/34155037/pexels-photo-34155037.jpeg', '30ml'),
      ('Dynamic Light Gray', 'Dynamic', 'Light Gray', 0, 'https://images.pexels.com/photos/34155037/pexels-photo-34155037.jpeg', '30ml'),
      ('Kuro Sumi Carbon', 'Kuro Sumi', 'Carbon Black', 0, 'https://images.pexels.com/photos/34155037/pexels-photo-34155037.jpeg', '44ml'),
      ('Kuro Sumi Gray Wash', 'Kuro Sumi', 'Gray Wash', 0, 'https://images.pexels.com/photos/34155037/pexels-photo-34155037.jpeg', '30ml'),
      ('Cosmoink Violet', 'Cosmoink', 'Violet', 0, 'https://images.pexels.com/photos/34155037/pexels-photo-34155037.jpeg', '30ml'),
      ('Cosmoink Midnight Blue', 'Cosmoink', 'Blue', 0, 'https://images.pexels.com/photos/34155037/pexels-photo-34155037.jpeg', '30ml'),
      ('Panthera Velvet Black', 'Panthera Ink', 'Velvet Black', 0, 'https://images.pexels.com/photos/34155037/pexels-photo-34155037.jpeg', '30ml'),
      ('Panthera Bright Red', 'Panthera Ink', 'Red', 0, 'https://images.pexels.com/photos/34155037/pexels-photo-34155037.jpeg', '88ml'),
      ('Quantum Ink Silver', 'Quantum Ink', 'Silver', 0, 'https://images.pexels.com/photos/34155037/pexels-photo-34155037.jpeg', '30ml'),
      ('Quantum Ink Rose Pink', 'Quantum Ink', 'Pink', 0, 'https://images.pexels.com/photos/34155037/pexels-photo-34155037.jpeg', '30ml')
      ON DUPLICATE KEY UPDATE product_name = VALUES(product_name), manufacturer = VALUES(manufacturer);`);

    await conn.commit();
    console.log('Migration finished');

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Migrations completed' }),
    };
  } catch (err) {
    console.error('Migration error:', err);
    try {
      await conn.rollback();
    } catch (rbe) {
      console.error('Rollback error', rbe);
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (err as Error).message }),
    };
  } finally {
    conn.release();
  }
};
