import { Handler } from 'aws-lambda';
import { getPool } from '../shared/db';

export const handler: Handler = async (event, ctx) => {
  console.log('Migrations started!');

  const pool = await getPool();

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(`CREATE SCHEMA IF NOT EXISTS AtraDatabase DEFAULT CHARACTER SET utf8;
      USE AtraDatabase;

      CREATE TABLE IF NOT EXISTS User (
        user_id VARCHAR(255) NOT NULL,
        email VARCHAR(45) NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(25) NOT NULL,
        last_name VARCHAR(45) NOT NULL,
        PRIMARY KEY (user_id),
        UNIQUE KEY idUser_UNIQUE (user_id)
      ) ENGINE=InnoDB;

      CREATE TABLE IF NOT EXISTS Customer (
        customer_id INT NOT NULL AUTO_INCREMENT,
        email VARCHAR(45) NOT NULL,
        phone VARCHAR(45),
        first_name VARCHAR(25),
        last_name VARCHAR(45),
        notes TEXT,
        User_user_id VARCHAR(255) NOT NULL,
        PRIMARY KEY (customer_id),
        UNIQUE KEY idCustomer_UNIQUE (customer_id),
        INDEX fk_Customer_User1_idx (User_user_id),
        FOREIGN KEY (User_user_id) REFERENCES User(user_id)
      ) ENGINE=InnoDB;

      CREATE TABLE IF NOT EXISTS PublicInk (
        ink_id INT NOT NULL AUTO_INCREMENT,
        product_name VARCHAR(45) NOT NULL,
        manufacturer VARCHAR(45) NOT NULL,
        color VARCHAR(45) NOT NULL,
        recalled TINYINT,
        image_url VARCHAR(255),
        size VARCHAR(45),
        PRIMARY KEY (ink_id),
        UNIQUE KEY ink_id_UNIQUE (ink_id)
      ) ENGINE=InnoDB;

      CREATE TABLE IF NOT EXISTS UserInk (
        user_ink_id INT NOT NULL AUTO_INCREMENT,
        batch_number VARCHAR(40),
        opened_at DATE,
        image_url VARCHAR(255),
        expires_at DATE,
        favorite TINYINT,
        PublicInk_ink_id INT NOT NULL,
        User_user_id VARCHAR(255) NOT NULL,
        PRIMARY KEY (user_ink_id),
        INDEX fk_UserInk_PublicInk1_idx (PublicInk_ink_id),
        INDEX fk_UserInk_User1_idx (User_user_id),
        UNIQUE KEY user_ink_id_UNIQUE (user_ink_id),
        FOREIGN KEY (PublicInk_ink_id) REFERENCES PublicInk(ink_id),
        FOREIGN KEY (User_user_id) REFERENCES User(user_id)
      ) ENGINE=InnoDB;

      CREATE TABLE IF NOT EXISTS Appointment (
        appointment_id INT NOT NULL AUTO_INCREMENT,
        appointment_date DATETIME NOT NULL,
        comments TEXT,
        User_user_id VARCHAR(255) NOT NULL,
        Customer_customer_id INT NOT NULL,
        PRIMARY KEY (appointment_id),
        UNIQUE KEY idAppointment_UNIQUE (appointment_id),
        INDEX fk_Appointment_User1_idx (User_user_id),
        INDEX fk_Appointment_Customer1_idx (Customer_customer_id),
        FOREIGN KEY (User_user_id) REFERENCES User(user_id),
        FOREIGN KEY (Customer_customer_id) REFERENCES Customer(customer_id)
      ) ENGINE=InnoDB;

      CREATE TABLE IF NOT EXISTS UserInk_has_Appointment (
        UserInk_user_ink_id INT NOT NULL,
        Appointment_appointment_id INT NOT NULL,
        PRIMARY KEY (UserInk_user_ink_id, Appointment_appointment_id),
        INDEX fk_UserInk_has_Appointment_Appointment1_idx (Appointment_appointment_id),
        INDEX fk_UserInk_has_Appointment_UserInk1_idx (UserInk_user_ink_id),
        FOREIGN KEY (UserInk_user_ink_id) REFERENCES UserInk(user_ink_id),
        FOREIGN KEY (Appointment_appointment_id) REFERENCES Appointment(appointment_id)
      ) ENGINE=InnoDB;`);

    await conn.query(`
      INSERT INTO User (user_id, email, password, first_name, last_name)
      VALUES ('f08c996c-f081-7001-76e0-bfe9e4956901', 'testi.testaaja@testaajat.com', 'Testi', 'Testaaja');

      INSERT INTO Customer (email, first_name, last_name, User_user_id) VALUES ('yes@email.com', 'Aku', 'Asiakas', 'f08c996c-f081-7001-76e0-bfe9e4956901');
      INSERT INTO Customer (email, first_name, last_name, User_user_id) VALUES ('maybe@email.com', 'Anneli', 'Asiakaspalvelija', 'f08c996c-f081-7001-76e0-bfe9e4956901');
      INSERT INTO Customer (email, first_name, last_name, User_user_id) VALUES ('no@email.com', 'Jaakko', 'Jaakkonen', 'f08c996c-f081-7001-76e0-bfe9e4956901');

      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Tattoo Finish', 'Panthera Ink', 'Panthera Ink', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Violet', 'Radiant', 'Radiant', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('London Fog', 'World Famous Ink', 'World Famous Ink', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Bright Orange', 'Eternal Ink', 'Eternal Ink', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Shadow Ink', 'Panthera Ink', 'Panthera Ink', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Black Gold', 'Panthera Ink', 'Panthera Ink', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Miami Blue', 'World Famous Ink', 'World Famous Ink', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Sydney Sky', 'World Famous Ink', 'World Famous Ink', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Paris Green', 'World Famous Ink', 'World Famous Ink', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Snow White Opaque', 'Intenze', 'Intenze', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Berlin Gray', 'World Famous Ink', 'World Famous Ink', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Sunset Orange', 'Radiant', 'Radiant', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('White', 'Eternal Ink', 'Eternal Ink', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Canary Yellow', 'Radiant', 'Radiant', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Barcelona Brown', 'World Famous Ink', 'World Famous Ink', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Lemon Yellow', 'Intenze', 'Intenze', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Tokyo Pink', 'World Famous Ink', 'World Famous Ink', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('True Magenta', 'Intenze', 'Intenze', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Liner Ink', 'Panthera Ink', 'Panthera Ink', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Dark Sumy', 'Panthera Ink', 'Panthera Ink', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Jet Black', 'Radiant', 'Radiant', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Mint Green', 'Eternal Ink', 'Eternal Ink', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Golden Yellow', 'Eternal Ink', 'Eternal Ink', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Black', 'Eternal Ink', 'Eternal Ink', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Velvet Black', 'Panthera Ink', 'Panthera Ink', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Bright Red', 'Intenze', 'Intenze', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('XXX Tribal Black', 'Panthera Ink', 'Panthera Ink', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Coral', 'Radiant', 'Radiant', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Deep Black', 'Panthera Ink', 'Panthera Ink', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Lavender', 'Eternal Ink', 'Eternal Ink', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Light Sumy', 'Panthera Ink', 'Panthera Ink', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Smooth Black', 'Panthera Ink', 'Panthera Ink', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Rio Yellow', 'World Famous Ink', 'World Famous Ink', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Jungle Green', 'Intenze', 'Intenze', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Crimson Red', 'Radiant', 'Radiant', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Turquoise', 'Radiant', 'Radiant', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Peach', 'Intenze', 'Intenze', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Zuper Black', 'Intenze', 'Intenze', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Slate Blue', 'Intenze', 'Intenze', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Light Purple', 'Eternal Ink', 'Eternal Ink', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Sky Blue', 'Eternal Ink', 'Eternal Ink', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Moscow Red', 'World Famous Ink', 'World Famous Ink', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('True Blue', 'Eternal Ink', 'Eternal Ink', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Sienna', 'Intenze', 'Intenze', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('New York Black', 'World Famous Ink', 'World Famous Ink', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Royal Blue', 'Radiant', 'Radiant', 0, '', '30ml');
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES ('Aqua', 'Intenze', 'Intenze', 0, '', '30ml');

      INSERT INTO UserInk (batch_number, opened_at, expires_at, favorite, PublicInk_ink_id, User_user_id) VALUES ('123456', DATE("2025-01-01"), DATE("2026-01-01"), 0, 5, 'f08c996c-f081-7001-76e0-bfe9e4956901');
      INSERT INTO UserInk (batch_number, opened_at, expires_at, favorite, PublicInk_ink_id, User_user_id) VALUES ('ABC123', DATE("2025-01-01"), DATE("2026-01-01"), 1, 10, 'f08c996c-f081-7001-76e0-bfe9e4956901');
      INSERT INTO UserInk (batch_number, opened_at, expires_at, favorite, PublicInk_ink_id, User_user_id) VALUES ('123-01', DATE("2025-01-01"), DATE("2026-01-01"), 1, 1, 'f08c996c-f081-7001-76e0-bfe9e4956901');
      INSERT INTO UserInk (batch_number, opened_at, expires_at, favorite, PublicInk_ink_id, User_user_id) VALUES ('98765', DATE("2025-01-01"), DATE("2026-01-01"), 0, 20, 'f08c996c-f081-7001-76e0-bfe9e4956901');
      INSERT INTO UserInk (batch_number, opened_at, expires_at, favorite, PublicInk_ink_id, User_user_id) VALUES ('HJKL011', DATE("2025-01-01"), DATE("2026-01-01"), 1, 2, 'f08c996c-f081-7001-76e0-bfe9e4956901');



      INSERT INTO Appointment (appointment_date, comments, User_user_id, Customer_customer_id) VALUES (DATE("2025-06-06"), 'eka', 'f08c996c-f081-7001-76e0-bfe9e4956901', 1);
      INSERT INTO Appointment (appointment_date, comments, User_user_id, Customer_customer_id) VALUES (DATE("2025-07-07"), 'toka', 'f08c996c-f081-7001-76e0-bfe9e4956901', 1);
      INSERT INTO Appointment (appointment_date, comments, User_user_id, Customer_customer_id) VALUES (DATE("2025-07-09"), '', 'f08c996c-f081-7001-76e0-bfe9e4956901', 2);
      INSERT INTO Appointment (appointment_date, comments, User_user_id, Customer_customer_id) VALUES (DATE("2025-10-06"), '', 'f08c996c-f081-7001-76e0-bfe9e4956901', 3);
      INSERT INTO Appointment (appointment_date, comments, User_user_id, Customer_customer_id) VALUES (DATE("2025-12-12"), '', 'f08c996c-f081-7001-76e0-bfe9e4956901', 2);
 

      INSERT INTO UserInk_has_Appointment (UserInk_user_ink_id, Appointment_appointment_id) VALUES (1, 1);
      INSERT INTO UserInk_has_Appointment (UserInk_user_ink_id, Appointment_appointment_id) VALUES (3, 1);
      INSERT INTO UserInk_has_Appointment (UserInk_user_ink_id, Appointment_appointment_id) VALUES (1, 2);
      INSERT INTO UserInk_has_Appointment (UserInk_user_ink_id, Appointment_appointment_id) VALUES (4, 2);
      INSERT INTO UserInk_has_Appointment (UserInk_user_ink_id, Appointment_appointment_id) VALUES (1, 3);
      INSERT INTO UserInk_has_Appointment (UserInk_user_ink_id, Appointment_appointment_id) VALUES (1, 4);
      INSERT INTO UserInk_has_Appointment (UserInk_user_ink_id, Appointment_appointment_id) VALUES (2, 4);
      INSERT INTO UserInk_has_Appointment (UserInk_user_ink_id, Appointment_appointment_id) VALUES (3, 4);
      INSERT INTO UserInk_has_Appointment (UserInk_user_ink_id, Appointment_appointment_id) VALUES (4, 4);

    `);

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
