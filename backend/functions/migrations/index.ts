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
      
      CREATE TABLE IF NOT EXISTS Entry (
        entry_id INT NOT NULL AUTO_INCREMENT,
        entry_date DATETIME NOT NULL,
        comments TEXT,
        User_user_id VARCHAR(255) NOT NULL,
        Customer_customer_id INT NULL, --NULL for cascades
        PRIMARY KEY (entry_id),
        UNIQUE KEY idEntry_UNIQUE (entry_id),
        INDEX fk_Entry_User1_idx (User_user_id),
        INDEX fk_Entry_Customer1_idx (Customer_customer_id),
        FOREIGN KEY (User_user_id) REFERENCES User(user_id),
        FOREIGN KEY (Customer_customer_id) REFERENCES Customer(customer_id) 
          ON DELETE SET NULL --cascades customer deletion
      ) ENGINE=InnoDB;

        CREATE TABLE IF NOT EXISTS UserInk_has_Entry (
        id INT NOT NULL AUTO_INCREMENT,
        UserInk_user_ink_id INT NULL, --NULL for cascades
        Entry_entry_id INT NULL, --NULL for cascades
        PRIMARY KEY (UserInk_user_ink_id, Entry_entry_id),
        INDEX fk_UserInk_has_Entry_Entry1_idx (Entry_entry_id),
        INDEX fk_UserInk_has_Entry_UserInk1_idx (UserInk_user_ink_id),
        FOREIGN KEY (UserInk_user_ink_id) REFERENCES UserInk(user_ink_id)
          ON DELETE SET NULL --cascades user deletion,
        FOREIGN KEY (Entry_entry_id) REFERENCES Entry(entry_id)
          ON DELETE SET NULL --cascades entry deletion
      ) ENGINE=InnoDB;
    `);

    await conn.query(`
      INSERT INTO User (user_id, email, first_name, last_name)
      VALUES ('demo-user-123', 'testi.testaaja@testaajat.com', 'Testi', 'Testaaja');`);

    await conn.query(`
      INSERT INTO Customer (email, first_name, last_name, phone, User_user_id) VALUES ('yes@email.com', 'Aku', 'Asiakas', '0442005678', 'demo-user-123');
      INSERT INTO Customer (email, first_name, last_name, phone, User_user_id) VALUES ('maybe@email.com', 'Anneli', 'Asiakaspalvelija', '0506789534', 'demo-user-123');
      INSERT INTO Customer (email, first_name, last_name, phone, User_user_id) VALUES ('no@email.com', 'Jaakko', 'Jaakkonen', '0446753478', 'demo-user-123');`);

    await conn.query(`
      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size) VALUES
      ('Panthera Black', 'Panthera Ink', 'Black', 0, 'https://www.nordictattoosupplies.com/WebRoot/NTS/Shops/24052010-172317/65CE/0425/9EFB/4FDE/39AF/0A28/1066/809C/KSI44FLBL_ml.jpg', '30ml'),
      ('Panthera Shadow', 'Panthera Ink', 'Dark Gray', 0, 'https://www.nordictattoosupplies.com/WebRoot/NTS/Shops/24052010-172317/65CE/0425/9EFB/4FDE/39AF/0A28/1066/809C/KSI44FLBL_ml.jpg', '30ml'),
      ('Eternal Jet Black', 'Eternal Ink', 'Black', 0, 'https://www.nordictattoosupplies.com/WebRoot/NTS/Shops/24052010-172317/65CE/0425/9EFB/4FDE/39AF/0A28/1066/809C/KSI44FLBL_ml.jpg', '30ml'),
      ('Eternal Chocolate Brown', 'Eternal Ink', 'Brown', 0, 'https://www.nordictattoosupplies.com/WebRoot/NTS/Shops/24052010-172317/65CE/0425/9EFB/4FDE/39AF/0A28/1066/809C/KSI44FLBL_ml.jpg', '30ml'),
      ('World Famous London Fog', 'World Famous Ink', 'Gray', 0, 'https://www.nordictattoosupplies.com/WebRoot/NTS/Shops/24052010-172317/65CE/0425/9EFB/4FDE/39AF/0A28/1066/809C/KSI44FLBL_ml.jpg', '30ml'),
      ('World Famous Mint Green', 'World Famous Ink', 'Green', 0, 'https://www.nordictattoosupplies.com/WebRoot/NTS/Shops/24052010-172317/65CE/0425/9EFB/4FDE/39AF/0A28/1066/809C/KSI44FLBL_ml.jpg', '180ml'),
      ('Intenze Chrome Yellow', 'Intenze', 'Yellow', 0, 'https://www.nordictattoosupplies.com/WebRoot/NTS/Shops/24052010-172317/65CE/0425/9EFB/4FDE/39AF/0A28/1066/809C/KSI44FLBL_ml.jpg', '22ml'),
      ('Intenze Purple Rain', 'Intenze', 'Purple', 0, 'https://www.nordictattoosupplies.com/WebRoot/NTS/Shops/24052010-172317/65CE/0425/9EFB/4FDE/39AF/0A28/1066/809C/KSI44FLBL_ml.jpg', '30ml'),
      ('Radiant Bright Orange', 'Radiant Ink', 'Orange', 0, 'https://www.nordictattoosupplies.com/WebRoot/NTS/Shops/24052010-172317/65CE/0425/9EFB/4FDE/39AF/0A28/1066/809C/KSI44FLBL_ml.jpg', '30ml'),
      ('Radiant Deep Turquoise', 'Radiant Ink', 'Turquoise', 0, 'https://www.nordictattoosupplies.com/WebRoot/NTS/Shops/24052010-172317/65CE/0425/9EFB/4FDE/39AF/0A28/1066/809C/KSI44FLBL_ml.jpg', '30ml'),
      ('Dynamic Black', 'Dynamic', 'Black', 0, 'https://www.nordictattoosupplies.com/WebRoot/NTS/Shops/24052010-172317/65CE/0425/9EFB/4FDE/39AF/0A28/1066/809C/KSI44FLBL_ml.jpg', '30ml'),
      ('Dynamic Light Gray', 'Dynamic', 'Light Gray', 0, 'https://www.nordictattoosupplies.com/WebRoot/NTS/Shops/24052010-172317/65CE/0425/9EFB/4FDE/39AF/0A28/1066/809C/KSI44FLBL_ml.jpg', '30ml'),
      ('Kuro Sumi Carbon', 'Kuro Sumi', 'Carbon Black', 0, 'https://www.nordictattoosupplies.com/WebRoot/NTS/Shops/24052010-172317/65CE/0425/9EFB/4FDE/39AF/0A28/1066/809C/KSI44FLBL_ml.jpg', '44ml'),
      ('Kuro Sumi Gray Wash', 'Kuro Sumi', 'Gray Wash', 0, 'https://www.nordictattoosupplies.com/WebRoot/NTS/Shops/24052010-172317/65CE/0425/9EFB/4FDE/39AF/0A28/1066/809C/KSI44FLBL_ml.jpg', '30ml'),
      ('Cosmoink Violet', 'Cosmoink', 'Violet', 0, 'https://www.nordictattoosupplies.com/WebRoot/NTS/Shops/24052010-172317/65CE/0425/9EFB/4FDE/39AF/0A28/1066/809C/KSI44FLBL_ml.jpg', '30ml'),
      ('Cosmoink Midnight Blue', 'Cosmoink', 'Blue', 0, 'https://www.nordictattoosupplies.com/WebRoot/NTS/Shops/24052010-172317/65CE/0425/9EFB/4FDE/39AF/0A28/1066/809C/KSI44FLBL_ml.jpg', '30ml'),
      ('Panthera Velvet Black', 'Panthera Ink', 'Velvet Black', 0, 'https://www.nordictattoosupplies.com/WebRoot/NTS/Shops/24052010-172317/65CE/0425/9EFB/4FDE/39AF/0A28/1066/809C/KSI44FLBL_ml.jpg', '30ml'),
      ('Panthera Bright Red', 'Panthera Ink', 'Red', 0, 'https://www.nordictattoosupplies.com/WebRoot/NTS/Shops/24052010-172317/65CE/0425/9EFB/4FDE/39AF/0A28/1066/809C/KSI44FLBL_ml.jpg', '88ml'),
      ('Quantum Ink Silver', 'Quantum Ink', 'Silver', 0, 'https://www.nordictattoosupplies.com/WebRoot/NTS/Shops/24052010-172317/65CE/0425/9EFB/4FDE/39AF/0A28/1066/809C/KSI44FLBL_ml.jpg', '30ml'),
      ('Quantum Ink Rose Pink', 'Quantum Ink', 'Pink', 0, 'https://www.nordictattoosupplies.com/WebRoot/NTS/Shops/24052010-172317/65CE/0425/9EFB/4FDE/39AF/0A28/1066/809C/KSI44FLBL_ml.jpg', '30ml');`);

    await conn.query(`
      INSERT INTO UserInk (batch_number, opened_at, expires_at, favorite, PublicInk_ink_id, User_user_id) VALUES ('123456', DATE("2025-01-01"), DATE("2026-01-01"), 0, 5, 'demo-user-123');
      INSERT INTO UserInk (batch_number, opened_at, expires_at, favorite, PublicInk_ink_id, User_user_id) VALUES ('ABC123', DATE("2025-01-01"), DATE("2026-01-01"), 1, 10, 'demo-user-123');
      INSERT INTO UserInk (batch_number, opened_at, expires_at, favorite, PublicInk_ink_id, User_user_id) VALUES ('123-01', DATE("2025-01-01"), DATE("2026-01-01"), 1, 1, 'demo-user-123');
      INSERT INTO UserInk (batch_number, opened_at, expires_at, favorite, PublicInk_ink_id, User_user_id) VALUES ('98765', DATE("2025-01-01"), DATE("2026-01-01"), 0, 20, 'demo-user-123');
      INSERT INTO UserInk (batch_number, opened_at, expires_at, favorite, PublicInk_ink_id, User_user_id) VALUES ('HJKL011', DATE("2025-01-01"), DATE("2026-01-01"), 1, 2, 'demo-user-123');`);

    await conn.query(`
      INSERT INTO Entry (entry_date, comments, User_user_id, Customer_customer_id) VALUES (DATE("2025-06-06"), 'eka', 'demo-user-123', 1);
      INSERT INTO Entry (entry_date, comments, User_user_id, Customer_customer_id) VALUES (DATE("2025-07-07"), 'toka', 'demo-user-123', 1);
      INSERT INTO Entry (entry_date, comments, User_user_id, Customer_customer_id) VALUES (DATE("2025-07-09"), '', 'demo-user-123', 2);
      INSERT INTO Entry (entry_date, comments, User_user_id, Customer_customer_id) VALUES (DATE("2025-10-06"), '', 'demo-user-123', 3);
      INSERT INTO Entry (entry_date, comments, User_user_id, Customer_customer_id) VALUES (DATE("2025-12-12"), '', 'demo-user-123', 2);`);

    await conn.query(`
      INSERT INTO UserInk_has_Entry (UserInk_user_ink_id, Entry_entry_id) VALUES (1, 1);
      INSERT INTO UserInk_has_Entry (UserInk_user_ink_id, Entry_entry_id) VALUES (3, 1);
      INSERT INTO UserInk_has_Entry (UserInk_user_ink_id, Entry_entry_id) VALUES (1, 2);
      INSERT INTO UserInk_has_Entry (UserInk_user_ink_id, Entry_entry_id) VALUES (4, 2);
      INSERT INTO UserInk_has_Entry (UserInk_user_ink_id, Entry_entry_id) VALUES (1, 3);
      INSERT INTO UserInk_has_Entry (UserInk_user_ink_id, Entry_entry_id) VALUES (1, 4);
      INSERT INTO UserInk_has_Entry (UserInk_user_ink_id, Entry_entry_id) VALUES (2, 4);
      INSERT INTO UserInk_has_Entry (UserInk_user_ink_id, Entry_entry_id) VALUES (3, 4);
      INSERT INTO UserInk_has_Entry (UserInk_user_ink_id, Entry_entry_id) VALUES (4, 4);`);

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
