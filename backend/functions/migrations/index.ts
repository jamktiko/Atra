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
        email VARCHAR(45) NOT NULL,
        first_name VARCHAR(25) NOT NULL,
        last_name VARCHAR(45) NOT NULL,
        PRIMARY KEY (user_id),
        UNIQUE KEY idUser_UNIQUE (user_id)
      ) ENGINE=InnoDB;

      CREATE TABLE IF NOT EXISTS Customer (
        customer_id INT NOT NULL AUTO_INCREMENT,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(45),
        first_name VARCHAR(25),
        last_name VARCHAR(45),
        notes TEXT,
        User_user_id VARCHAR(255) NOT NULL,
        PRIMARY KEY (customer_id),
        UNIQUE KEY ux_customer_email (email, User_user_id),
        INDEX fk_Customer_User1_idx (User_user_id),
        CONSTRAINT fk_Customer_User1 FOREIGN KEY (User_user_id) REFERENCES User(user_id)
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
        User_user_id VARCHAR(255) NOT NULL,
        PRIMARY KEY (user_ink_id),
        INDEX fk_UserInk_PublicInk1_idx (PublicInk_ink_id),
        INDEX fk_UserInk_User1_idx (User_user_id),
        UNIQUE KEY user_ink_id_UNIQUE (user_ink_id),
        CONSTRAINT fk_UserInk_PublicInk1 FOREIGN KEY (PublicInk_ink_id) REFERENCES PublicInk(ink_id)
          ON DELETE RESTRICT,
        CONSTRAINT fk_UserInk_User1 FOREIGN KEY (User_user_id) REFERENCES User(user_id)
          ON DELETE RESTRICT
      ) ENGINE=InnoDB; 

      CREATE TABLE IF NOT EXISTS Entry (
        entry_id INT NOT NULL AUTO_INCREMENT,
        entry_date DATETIME NOT NULL,
        comments TEXT,
        User_user_id VARCHAR(255) NOT NULL,
        Customer_customer_id INT NULL,
        PRIMARY KEY (entry_id),
        UNIQUE KEY idEntry_UNIQUE (entry_id),
        INDEX fk_Entry_User1_idx (User_user_id),
        INDEX fk_Entry_Customer1_idx (Customer_customer_id),
        CONSTRAINT fk_Entry_User1 FOREIGN KEY (User_user_id) REFERENCES User(user_id)
          ON DELETE RESTRICT,
        CONSTRAINT fk_Entry_Customer1 FOREIGN KEY (Customer_customer_id) REFERENCES Customer(customer_id)
          ON DELETE SET NULL
      ) ENGINE=InnoDB;

      CREATE TABLE IF NOT EXISTS UserInk_has_Entry (
        id INT NOT NULL AUTO_INCREMENT,
        UserInk_user_ink_id INT NULL,
        Entry_entry_id INT NULL,
        snapshot_product_name VARCHAR(100),
        snapshot_manufacturer VARCHAR(100),
        snapshot_color VARCHAR(100),
        snapshot_batch_number VARCHAR(40),
        snapshot_image_url VARCHAR(255),
        snapshot_size VARCHAR(45),
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX fk_UserInk_has_Entry_Entry1_idx (Entry_entry_id),
        INDEX fk_UserInk_has_Entry_UserInk1_idx (UserInk_user_ink_id),
        UNIQUE KEY ux_userink_entry (UserInk_user_ink_id, Entry_entry_id),
        CONSTRAINT fk_UserInk_has_Entry_UserInk1 FOREIGN KEY (UserInk_user_ink_id) REFERENCES UserInk(user_ink_id)
          ON DELETE SET NULL,
        CONSTRAINT fk_UserInk_has_Entry_Entry1 FOREIGN KEY (Entry_entry_id) REFERENCES Entry(entry_id)
          ON DELETE CASCADE
      ) ENGINE=InnoDB;

      INSERT INTO User (user_id, email, first_name, last_name)
      VALUES ('demo-user-123', 'testi.testaaja@testaajat.com', 'Testi', 'Testaaja')
      ON DUPLICATE KEY UPDATE user_id = user_id;

      INSERT INTO PublicInk (product_name, manufacturer, color, recalled, image_url, size)
      VALUES
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
      ('Quantum Ink Rose Pink', 'Quantum Ink', 'Pink', 0, 'https://www.nordictattoosupplies.com/WebRoot/NTS/Shops/24052010-172317/65CE/0425/9EFB/4FDE/39AF/0A28/1066/809C/KSI44FLBL_ml.jpg', '30ml')
      ON DUPLICATE KEY UPDATE product_name = VALUES(product_name), manufacturer = VALUES(manufacturer);

      INSERT INTO Customer (email, first_name, last_name, phone, User_user_id)
      VALUES
        ('cust1@example.com', 'Aku', 'Asiakas', '0442005678', 'demo-user-123'),
        ('cust2@example.com', 'Matti', 'Meikäläinen', '0441000000', 'demo-user-123'),
        ('cust3@example.com', 'Liisa', 'Laine', '0443000000', 'demo-user-123')
      ON DUPLICATE KEY UPDATE email = email;

      INSERT INTO UserInk (batch_number, opened_at, expires_at, favorite, PublicInk_ink_id, User_user_id)
      VALUES
        ('123456', '2025-01-01', '2026-01-01', 0, (SELECT ink_id FROM PublicInk WHERE product_name = 'Panthera Black' AND manufacturer = 'Panthera Ink' LIMIT 1), 'demo-user-123'),
        ('ABC123', '2025-01-01', '2026-01-01', 1, (SELECT ink_id FROM PublicInk WHERE product_name = 'Panthera Shadow' AND manufacturer = 'Panthera Ink' LIMIT 1), 'demo-user-123'),
        ('123-01', '2025-01-01', '2026-01-01', 1, (SELECT ink_id FROM PublicInk WHERE product_name = 'Eternal Jet Black' AND manufacturer = 'Eternal Ink' LIMIT 1), 'demo-user-123'),
        ('98765', '2025-01-01', '2026-01-01', 0, (SELECT ink_id FROM PublicInk WHERE product_name = 'Panthera Bright Red' AND manufacturer = 'Panthera Ink' LIMIT 1), 'demo-user-123'),
        ('HJKL011', '2025-01-01', '2026-01-01', 1, (SELECT ink_id FROM PublicInk WHERE product_name = 'World Famous London Fog' AND manufacturer = 'World Famous Ink' LIMIT 1), 'demo-user-123')
      ON DUPLICATE KEY UPDATE batch_number = VALUES(batch_number);

      INSERT INTO Entry (entry_date, comments, User_user_id, Customer_customer_id)
      VALUES (DATE('2025-06-06'), 'eka', 'demo-user-123', (SELECT customer_id FROM Customer WHERE email = 'cust1@example.com' LIMIT 1))
      ON DUPLICATE KEY UPDATE entry_date = entry_date;

      INSERT INTO Entry (entry_date, comments, User_user_id, Customer_customer_id)
      VALUES (DATE('2025-07-07'), 'toka', 'demo-user-123', (SELECT customer_id FROM Customer WHERE email = 'cust1@example.com' LIMIT 1))
      ON DUPLICATE KEY UPDATE entry_date = entry_date;

      INSERT INTO Entry (entry_date, comments, User_user_id, Customer_customer_id)
      VALUES (DATE('2025-07-09'), '', 'demo-user-123', (SELECT customer_id FROM Customer WHERE email = 'cust2@example.com' LIMIT 1))
      ON DUPLICATE KEY UPDATE entry_date = entry_date;

      INSERT INTO Entry (entry_date, comments, User_user_id, Customer_customer_id)
      VALUES (DATE('2025-10-06'), '', 'demo-user-123', (SELECT customer_id FROM Customer WHERE email = 'cust3@example.com' LIMIT 1))
      ON DUPLICATE KEY UPDATE entry_date = entry_date;

      INSERT INTO Entry (entry_date, comments, User_user_id, Customer_customer_id)
      VALUES (DATE('2025-12-12'), '', 'demo-user-123', (SELECT customer_id FROM Customer WHERE email = 'cust2@example.com' LIMIT 1))
      ON DUPLICATE KEY UPDATE entry_date = entry_date;

      -- Bulk insert associations with snapshots using UNION ALL
      INSERT INTO UserInk_has_Entry (
        UserInk_user_ink_id, Entry_entry_id,
        snapshot_product_name, snapshot_manufacturer, snapshot_color,
        snapshot_batch_number, snapshot_image_url, snapshot_size
      )
      -- (1,1)
      SELECT ui.user_ink_id, e.entry_id, pi.product_name, pi.manufacturer, pi.color,
             ui.batch_number, pi.image_url, pi.size
      FROM UserInk ui
      JOIN PublicInk pi ON ui.PublicInk_ink_id = pi.ink_id
      JOIN Entry e ON e.entry_id = (SELECT entry_id FROM Entry WHERE entry_date = DATE('2025-06-06') AND User_user_id = 'demo-user-123' LIMIT 1)
      WHERE ui.user_ink_id = (SELECT user_ink_id FROM UserInk WHERE batch_number = '123456' LIMIT 1)

      UNION ALL

      -- (3,1)
      SELECT ui.user_ink_id, e.entry_id, pi.product_name, pi.manufacturer, pi.color,
             ui.batch_number, pi.image_url, pi.size
      FROM UserInk ui
      JOIN PublicInk pi ON ui.PublicInk_ink_id = pi.ink_id
      JOIN Entry e ON e.entry_id = (SELECT entry_id FROM Entry WHERE entry_date = DATE('2025-06-06') AND User_user_id = 'demo-user-123' LIMIT 1)
      WHERE ui.user_ink_id = (SELECT user_ink_id FROM UserInk WHERE batch_number = '123-01' LIMIT 1)

      UNION ALL

      -- (1,2)
      SELECT ui.user_ink_id, e.entry_id, pi.product_name, pi.manufacturer, pi.color,
             ui.batch_number, pi.image_url, pi.size
      FROM UserInk ui
      JOIN PublicInk pi ON ui.PublicInk_ink_id = pi.ink_id
      JOIN Entry e ON e.entry_id = (SELECT entry_id FROM Entry WHERE entry_date = DATE('2025-07-07') AND User_user_id = 'demo-user-123' LIMIT 1)
      WHERE ui.user_ink_id = (SELECT user_ink_id FROM UserInk WHERE batch_number = '123456' LIMIT 1)

      UNION ALL

      -- (4,2)
      SELECT ui.user_ink_id, e.entry_id, pi.product_name, pi.manufacturer, pi.color,
             ui.batch_number, pi.image_url, pi.size
      FROM UserInk ui
      JOIN PublicInk pi ON ui.PublicInk_ink_id = pi.ink_id
      JOIN Entry e ON e.entry_id = (SELECT entry_id FROM Entry WHERE entry_date = DATE('2025-07-07') AND User_user_id = 'demo-user-123' LIMIT 1)
      WHERE ui.user_ink_id = (SELECT user_ink_id FROM UserInk WHERE batch_number = '98765' LIMIT 1)

      UNION ALL

      -- (1,3)
      SELECT ui.user_ink_id, e.entry_id, pi.product_name, pi.manufacturer, pi.color,
             ui.batch_number, pi.image_url, pi.size
      FROM UserInk ui
      JOIN PublicInk pi ON ui.PublicInk_ink_id = pi.ink_id
      JOIN Entry e ON e.entry_id = (SELECT entry_id FROM Entry WHERE entry_date = DATE('2025-07-09') AND User_user_id = 'demo-user-123' LIMIT 1)
      WHERE ui.user_ink_id = (SELECT user_ink_id FROM UserInk WHERE batch_number = '123456' LIMIT 1)

      UNION ALL

      -- (1,4)
      SELECT ui.user_ink_id, e.entry_id, pi.product_name, pi.manufacturer, pi.color,
             ui.batch_number, pi.image_url, pi.size
      FROM UserInk ui
      JOIN PublicInk pi ON ui.PublicInk_ink_id = pi.ink_id
      JOIN Entry e ON e.entry_id = (SELECT entry_id FROM Entry WHERE entry_date = DATE('2025-10-06') AND User_user_id = 'demo-user-123' LIMIT 1)
      WHERE ui.user_ink_id = (SELECT user_ink_id FROM UserInk WHERE batch_number = '123456' LIMIT 1)

      UNION ALL

      -- (2,4)
      SELECT ui.user_ink_id, e.entry_id, pi.product_name, pi.manufacturer, pi.color,
             ui.batch_number, pi.image_url, pi.size
      FROM UserInk ui
      JOIN PublicInk pi ON ui.PublicInk_ink_id = pi.ink_id
      JOIN Entry e ON e.entry_id = (SELECT entry_id FROM Entry WHERE entry_date = DATE('2025-10-06') AND User_user_id = 'demo-user-123' LIMIT 1)
      WHERE ui.user_ink_id = (SELECT user_ink_id FROM UserInk WHERE batch_number = 'ABC123' LIMIT 1)

      UNION ALL

      -- (3,4)
      SELECT ui.user_ink_id, e.entry_id, pi.product_name, pi.manufacturer, pi.color,
             ui.batch_number, pi.image_url, pi.size
      FROM UserInk ui
      JOIN PublicInk pi ON ui.PublicInk_ink_id = pi.ink_id
      JOIN Entry e ON e.entry_id = (SELECT entry_id FROM Entry WHERE entry_date = DATE('2025-10-06') AND User_user_id = 'demo-user-123' LIMIT 1)
      WHERE ui.user_ink_id = (SELECT user_ink_id FROM UserInk WHERE batch_number = '123-01' LIMIT 1)

      UNION ALL

      -- (4,4)
      SELECT ui.user_ink_id, e.entry_id, pi.product_name, pi.manufacturer, pi.color,
             ui.batch_number, pi.image_url, pi.size
      FROM UserInk ui
      JOIN PublicInk pi ON ui.PublicInk_ink_id = pi.ink_id
      JOIN Entry e ON e.entry_id = (SELECT entry_id FROM Entry WHERE entry_date = DATE('2025-10-06') AND User_user_id = 'demo-user-123' LIMIT 1)
      WHERE ui.user_ink_id = (SELECT user_ink_id FROM UserInk WHERE batch_number = '98765' LIMIT 1)

      ON DUPLICATE KEY UPDATE created_at = created_at;
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
