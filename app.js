import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import session from 'express-session';
import bcrypt from 'bcrypt';
import multer from 'multer';
import cloudinary from 'cloudinary';
import {
  initializeDatabase,
  getDb,
  createCustomer,
  authenticateCustomer,
  updateCustomer,
  updateCustomerPassword,
  getAllLaptops,
  getLaptopById,
  addLaptop,
  updateLaptop,
  deleteLaptop,
  getAllPhones,
  getPhoneById,
  addPhone,
  updatePhone,
  deletePhone,
  getAllChargers,
  getChargerById,
  addCharger,          // Added
  updateCharger,       // Added
  deleteCharger,       // Added
  getAllEarphones,
  getEarphonesById,
  addEarphones,        
  updateEarphones,     
  deleteEarphones,     
  createPhoneApplication,
  getAllPhoneApplications,
  getPhoneApplicationsByUserId,
  getPhoneApplicationById,
  updatePhoneApplicationStatus,
  createLaptopApplication,
  getAllLaptopApplications,
  getLaptopApplicationsByUserId,
  getLaptopApplicationById,
  updateLaptopApplicationStatus,
  authenticateSupervisor,
  updateSupervisorProfile,
  updateSupervisorPassword,
  getAllMouses,
  getMouseById,
  addMouse,            
  updateMouse,         
  deleteMouse,         
  getAllSmartwatches,
  getSmartwatchById,
  addSmartwatch,       // Added
  updateSmartwatch,    // Added
  deleteSmartwatch ,
  createOrder,         // Added
  getOrdersByUserId,  // Added
  getOrderById  ,  // Added
  getAllSupervisors,
  deleteSupervisor
} from './db.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dqohkpeyp',
  api_key: '932324182493947',       
  api_secret: 'PigT_hhRRKDi0utHVEQpmZ2kiIo', 
});

// Set up storage engine for multer (temporary storage for Cloudinary upload)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public', 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const app = express();
const port = 3000;

// Initialize database before setting up routes
(async () => {
  try {
    await initializeDatabase();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
})();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

function requireSupervisorAuth(req, res, next) {
  if (req.session.user && req.session.user.role === 'supervisor') {
    next();
  } else {
    res.redirect('/supervisor/login');
  }
}


function requireCustomerAuth(req, res, next) {
  if (req.session.user && req.session.user.role === 'customer') {
    next();
  } else {
    res.redirect('/login');
  }
}

// Test database connection route
app.get('/api/test-db', async (req, res) => {
  try {
    const db = await getDb();
    res.json({ success: true, message: 'Database connection successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});

// Supervisor Routes
app.get('/supervisor/login', (req, res) => {
  res.render("supervisor/supervisor-login", { error: null });
});

app.get('/supervisor/statistics', requireSupervisorAuth, async (req, res) => {
  const supervisor = req.session.user;
  res.render('supervisor/supervisor-statistics', { supervisor });
});
// Supervisor homepage (updated to match supervisor-portal-home.ejs)
app.get('/supervisor', requireSupervisorAuth, async (req, res) => {
  const supervisor = req.session.user;
  res.render('supervisor/supervisor-portal-home', { supervisor });
});
app.get('/supervisor/manage-inventory', (req, res) => {
  const supervisor = req.session.user;
  res.render("supervisor/manage-inventory",{ supervisor });
});

// Supervisor Profile Page
app.get('/supervisor/profile', requireSupervisorAuth, async (req, res) => {
  try {
    const db = await getDb();
    const supervisor = await db.get('SELECT * FROM supervisors WHERE user_id = ?', [req.session.user.userId]);
    
    if (!supervisor) {
      return res.status(404).render('error', { message: 'Supervisor not found' });
    }
    
    res.render('supervisor/supervisor-profile', { supervisor });
  } catch (error) {
    console.error('Error fetching supervisor profile:', error);
    res.status(500).render('error', { message: 'Failed to load profile' });
  }
});


app.get('/api/supervisor/dashboard', requireSupervisorAuth, async (req, res) => {
  try {
      const db = await getDb();
      const pendingListings = await db.get(
          `SELECT COUNT(*) as count FROM (
              SELECT id FROM phone_applications WHERE status = 'pending'
              UNION ALL
              SELECT id FROM laptop_applications WHERE status = 'pending'
          )`
      );
      const itemsAdded = await db.get(
          `SELECT COUNT(*) as count FROM supervisor_activity WHERE action LIKE 'Added % to inventory%'`
      );
      const recentActivity = await db.all(
          `SELECT action FROM supervisor_activity WHERE supervisor_id = ? ORDER BY timestamp DESC LIMIT 5`,
          [req.session.user.userId]
      );
      res.json({
          success: true,
          pendingListings: pendingListings.count,
          itemsAdded: itemsAdded.count,
          recentActivity: recentActivity.map(row => row.action)
      });
  } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({ success: false, message: 'Error fetching dashboard data' });
  }
});


app.get('/api/supervisor/statistics', requireSupervisorAuth, async (req, res) => {
  try {
      const db = await getDb();
      const supervisorId = req.session.user.userId;

      // Total items added to inventory
      const itemsAdded = await db.get(
          `SELECT COUNT(*) as count 
           FROM supervisor_activity 
           WHERE supervisor_id = ? 
           AND action LIKE 'Added % to inventory%'`,
          [supervisorId]
      );

      // Listings verified 
      const listingsVerified = await db.get(
          `SELECT COUNT(*) as count 
           FROM supervisor_activity 
           WHERE supervisor_id = ? 
           AND (action LIKE 'Updated % application%to approved%' 
                OR action LIKE 'Updated % application%to rejected%')`,
          [supervisorId]
      );

      // Pending listings
      const pendingListings = await db.get(
          `SELECT COUNT(*) as count 
           FROM (
               SELECT id FROM phone_applications WHERE status = 'pending'
               UNION ALL
               SELECT id FROM laptop_applications WHERE status = 'pending'
           )`
      );

      // Recent activity
      const recentActivity = await db.all(
          `SELECT action, timestamp 
           FROM supervisor_activity 
           WHERE supervisor_id = ? 
           ORDER BY timestamp DESC 
           LIMIT 5`,
          [supervisorId]
      );

      res.json({
          success: true,
          statistics: {
              totalItemsAdded: itemsAdded.count,
              listingsVerified: listingsVerified.count,
              pendingListings: pendingListings.count,
              recentActivity: recentActivity.map(a => ({
                  action: a.action,
                  timestamp: new Date(a.timestamp).toLocaleString()
              }))
          }
      });
  } catch (error) {
      console.error('Error fetching supervisor statistics:', error);
      res.status(500).json({ success: false, message: 'Error fetching statistics' });
  }
});
// Get all inventory items
app.get('/api/supervisor/inventory', requireSupervisorAuth, async (req, res) => {
  try {
      const dbFunctions = {
          phones: getAllPhones,
          laptops: getAllLaptops,
          earphones: getAllEarphones,
          chargers: getAllChargers,
          mouses: getAllMouses,
          smartwatches: getAllSmartwatches
      };

      const allItems = [];
      for (const [type, fetchFunction] of Object.entries(dbFunctions)) {
          const items = await fetchFunction();
          // pushing to array with type as index(map toaray)
          allItems.push(...items.map(item => ({ ...item, type })));
      }

      res.json({ success: true, items: allItems });
  } catch (error) {
      console.error('Error fetching inventory:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch inventory' });
  }
});


app.post('/api/supervisor/inventory', requireSupervisorAuth, async (req, res) => {
    const { type, id, brand, pricing, image, ...specificData } = req.body;
    console.log('item type in api:',type);
    try {
        let result;
        const typeLower = type.toLowerCase();
        if (typeLower === 'earphones') {
            result = await addEarphones({ id, title: specificData.title, brand, pricing, image, design: specificData.design, batteryLife: specificData.battery_life });
        } else if (typeLower === 'chargers') {
            result = await addCharger({ id, title: specificData.title, brand, pricing, image, wattage: specificData.wattage, type: specificData.Pin_type, outputCurrent: specificData.output_current });
        } else if (typeLower === 'mouses') {
            result = await addMouse({ id, title: specificData.title, brand, pricing, image, type: specificData.wire_type, connectivity: specificData.connectivity, resolution: specificData.resolution });
        } else if (typeLower === 'smartwatches') {
            result = await addSmartwatch({ id, title: specificData.title, brand, pricing, image, displaySize: specificData.display_size, displayType: specificData.display_type, batteryRuntime: specificData.battery_runtime });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid item type' });
        }
        if (result.success) {
            res.json({ success: true, id: result.id });
        } else {
            res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ success: false, message: 'Failed to add item' });
    }
});

// Update inventory item
app.put('/api/supervisor/inventory/:type/:id', requireSupervisorAuth, async (req, res) => {
  const { type, id } = req.params;
  const { brand, pricing, image, ...specificData } = req.body;
  try {
      let result;
      if (type === 'phones') {
          result = await updatePhone(id, {
              brand,
              pricing: { basePrice: pricing.originalPrice, discount: pricing.discount },
              image,
              model: specificData.model,
              color: specificData.color,
              processor: specificData.processor,
              display: specificData.display,
              battery: specificData.battery,
              camera: specificData.camera,
              os: specificData.os,
              network: specificData.network,
              weight: specificData.weight,
              ram: specificData.ram,
              rom: specificData.rom,
              condition: specificData.condition
          });
      } else if (type === 'laptops') {
          result = await updateLaptop(id, {
              brand,
              pricing: { basePrice: pricing.originalPrice, discount: pricing.discount },
              image,
              series: specificData.series,
              processor: { name: specificData.processor_name, generation: specificData.processor_generation },
              memory: { ram: specificData.ram, storage: { type: specificData.storage_type, capacity: specificData.storage_capacity } },
              displaysize: specificData.display_size,
              weight: specificData.weight,
              condition: specificData.condition,
              os: specificData.os
          });
      } else if (type === 'earphones') {
          result = await updateEarphones(id, {
              brand,
              pricing,
              image,
              title: specificData.title,
              design: specificData.design,
              battery_life: specificData.battery_life || 'N/A' // Fallback for NOT NULL
          });
      } else if (type === 'chargers') {
          result = await updateCharger(id, {
              brand,
              pricing,
              image,
              title: specificData.title,
              wattage: specificData.wattage,
              type: specificData.type,
              outputCurrent: specificData.outputCurrent
          });
      } else if (type === 'mouses') {
          result = await updateMouse(id, {
              brand,
              pricing,
              image,
              title: specificData.title,
              type: specificData.type,
              connectivity: specificData.connectivity,
              resolution: specificData.resolution
          });
        } else if (type === 'smartwatches') {
          result = await updateSmartwatch(id, {
              brand,
              pricing,
              image,
              title: specificData.title,
              display_size: specificData.display_size || 'N/A',
              display_type: specificData.display_type,
              battery_runtime: specificData.battery_runtime
          });
      }
      if (result.success) {
          res.json({ success: true });
      } else {
          res.status(400).json({ success: false, message: result.message });
      }
  } catch (error) {
      console.error(`Error updating ${type}:`, error);
      res.status(500).json({ success: false, message: `Failed to update ${type}` });
  }
});

// Delete inventory item
app.delete('/api/supervisor/inventory/:type/:id', requireSupervisorAuth, async (req, res) => {
  const { type, id } = req.params;
  try {
      let result;
      if (type === 'phones') result = await deletePhone(id);
      else if (type === 'laptops') result = await deleteLaptop(id);
      else if (type === 'earphones') result = await deleteEarphones(id);
      else if (type === 'chargers') result = await deleteCharger(id);
      else if (type === 'mouses') result = await deleteMouse(id);
      else if (type === 'smartwatches') result = await deleteSmartwatch(id);
      if (result.success) {
          res.json({ success: true });
      } else {
          res.status(404).json({ success: false, message: result.message });
      }
  } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ success: false, message: 'Failed to delete item' });
  }
});
app.post('/api/supervisor/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const result = await authenticateSupervisor(username, password);
    
    if (result.success) {
      req.session.user = {
        userId: result.supervisor.user_id,
        first_name: result.supervisor.first_name,
        last_name: result.supervisor.last_name,
        email: result.supervisor.email,
        phone: result.supervisor.phone,
        username: result.supervisor.username,
        role: 'supervisor'
      };
      
      return res.json({ 
        success: true, 
        firstName: result.supervisor.first_name,
        lastName: result.supervisor.last_name
      });
    } else {
      return res.status(401).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Supervisor login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// Supervisor logout route
app.get('/api/supervisor/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ success: false, message: 'Error logging out' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});


// Update supervisor profile
app.put('/api/supervisor/profile', requireSupervisorAuth, async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const { first_name, last_name, email, phone, username } = req.body;

    // Basic validation
    const errors = {};
    if (!first_name || first_name.length < 2) {
      errors.first_name = 'First name must be at least 2 characters';
    }
    if (!last_name || last_name.length < 2) {
      errors.last_name = 'Last name must be at least 2 characters';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!phone || phone.length < 10) {
      errors.phone = 'Please enter a valid phone number';
    }
    if (!username || username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const result = await updateSupervisorProfile(userId, {
      first_name,
      last_name,
      email,
      phone,
      username
    });

    if (result.success) {
      // Update session data
      req.session.user.first_name = first_name;
      req.session.user.last_name = last_name;
      req.session.user.email = email;
      req.session.user.phone = phone;
      req.session.user.username = username;

      return res.json({ success: true, message: 'Profile updated successfully' });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: result.message || 'Error updating profile' 
      });
    }
  } catch (error) {
    console.error('Error updating supervisor profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
app.post('/api/supervisor/password', requireSupervisorAuth, async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new passwords are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const db = await getDb();
    const supervisor = await db.get('SELECT password FROM supervisors WHERE user_id = ?', [userId]);
    
    const passwordMatch = await bcrypt.compare(currentPassword, supervisor.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    const result = await updateSupervisorPassword(userId, newPassword);

    if (result.success) {
      return res.json({ success: true, message: 'Password updated successfully' });
    } else {
      return res.status(500).json({ success: false, message: result.message || 'Error updating password' });
    }
  } catch (error) {
    console.error('Error updating supervisor password:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Customer signup route
app.post('/api/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    const errors = {};
    if (!firstName || firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }
    if (!lastName || lastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }
    // Updated email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address (e.g., user@example.com)';
    }
    if (!phone || phone.length < 10) {
      errors.phone = 'Please enter a valid phone number';
    }
    if (!password || password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const result = await createCustomer(firstName, lastName, email, phone, password);

    if (result.success) {
      req.session.user = {
        userId: result.userId,
        firstName,
        lastName,
        email,
        role: 'customer',
      };

      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        userId: result.userId,
      });
    } else {
      if (result.message === 'Email already registered') {
        return res.status(409).json({
          success: false,
          errors: { email: 'Email is already registered' },
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Error creating account',
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// Customer login route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const result = await authenticateCustomer(email, password);

    if (result.success) {
      req.session.user = {
        userId: result.user.user_id,
        firstName: result.user.first_name,
        lastName: result.user.last_name,
        email: result.user.email,
        role: 'customer',
      };

      return res.json({
        success: true,
        message: 'Login successful',
        user: {
          userId: result.user.user_id,
          firstName: result.user.first_name,
          lastName: result.user.last_name,
          email: result.user.email,
        },
      });
    } else {
      return res.status(401).json({
        success: false,
        message: result.message || 'Invalid credentials',
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

app.post('/api/sell-phone', upload.single('device-image'), async (req, res) => {
  try {
    console.log('Request body:', req.body); // Log all incoming form fields
    console.log('Uploaded file:', req.file);

    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: 'phone-applications',
    });

    const applicationData = {
      userId: req.session.user ? req.session.user.userId : null,
      brand: req.body.brand,
      model: req.body.model,
      ram: req.body.ram,
      rom: req.body.rom,
      processor: req.body.processor,
      network: req.body.network,
      size: req.body.size,
      weight: req.body.weight,
      deviceAge: req.body.deviceAge,
      switchingOn: req.body.switchingOn,
      phoneCalls: req.body.phoneCalls,
      camerasWorking: req.body.camerasWorking,
      batteryIssues: req.body.batteryIssues,
      physicallyDamaged: req.body.physicallyDamaged,
      soundIssues: req.body.soundIssues,
      location: req.body.location,
      email: req.body.email,
      phone: req.body.phone,
      battery: req.body.battery,       // New field
      camera: req.body.camera,         // New field
      os: req.body.os,                 // New field
      imagepath: result.secure_url,
    };

    console.log('Constructed applicationData:', applicationData); // Log the final object

    const requiredFields = [
      'brand', 'model', 'ram', 'rom', 'processor', 'network', 'deviceAge',
      'switchingOn', 'phoneCalls', 'camerasWorking', 'batteryIssues',
      'physicallyDamaged', 'soundIssues', 'location', 'email', 'phone',
      'battery', 'camera', 'os'
    ];

    for (const field of requiredFields) {
      if (!applicationData[field]) {
        console.log(`Missing or invalid field: ${field}`);
        return res.status(400).json({
          success: false,
          message: `${field.replace(/([A-Z])/g, ' $1').trim()} is required`,
        });
      }
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Device image is required',
      });
    }

    const dbResult = await createPhoneApplication(applicationData);

    if (dbResult.success) {
      return res.status(201).json({
        success: true,
        message: 'Application submitted successfully',
        applicationId: dbResult.id,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: dbResult.message || 'Error submitting application',
      });
    }
  } catch (error) {
    console.error('Phone application submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});
  app.post('/api/sell-laptop', upload.single('device-image'), async (req, res) => {
    try {
      console.log('Request body:', req.body); // Log form data
      console.log('Uploaded file:', req.file); // Log uploaded file
  
      // Upload image to Cloudinary
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'laptop-applications',
      });
  
      console.log('Cloudinary upload result:', result); // Log Cloudinary response
  
      const applicationData = {
        userId: req.session.user ? req.session.user.userId : null,
        brand: req.body.brand,
        model: req.body.model,
        ram: req.body.ram,
        storage: req.body.storage,
        processor: req.body.processor,
        generation: req.body.generation,
        displaySize: req.body.displaySize,
        weight: req.body.weight,
        os: req.body.os,
        deviceAge: req.body.deviceAge,
        batteryIssues: req.body.batteryIssues,
        location: req.body.location,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        imagepath: result.secure_url, // Store the Cloudinary URL
      };
  
      console.log('Application data:', applicationData); // Log application data
  
      // Validate required fields
      const requiredFields = [
        'brand',
        'model',
        'ram',
        'storage',
        'processor',
        'location',
        'name',
        'email',
        'phone',
      ];
  
      for (const field of requiredFields) {
        if (!applicationData[field]) {
          return res.status(400).json({
            success: false,
            message: `${field.replace(/([A-Z])/g, ' $1').trim()} is required`,
          });
        }
      }
  
      // Ensure an image is uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Device image is required',
        });
      }
  
      // Create application in the database
      const dbResult = await createLaptopApplication(applicationData);
  
      if (dbResult.success) {
        return res.status(201).json({
          success: true,
          message: 'Application submitted successfully',
          applicationId: dbResult.id,
        });
      } else {
        return res.status(500).json({
          success: false,
          message: dbResult.message || 'Error submitting application',
        });
      }
    } catch (error) {
      console.error('Laptop application submission error:', error); // Log the full error
      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  });

  // Supervisor routes for phone applications
app.get('/supervisor/phone-applications', requireSupervisorAuth, (req, res) => {
  res.render('supervisor/phone-applications');
});

app.get('/api/supervisor/phone-applications', requireSupervisorAuth, async (req, res) => {
  try {
    const applications = await getAllPhoneApplications();
    res.json({ success: true, applications });
  } catch (error) {
    console.error('Error fetching phone applications:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching applications' 
    });
  }
});

// Supervisor routes for laptop applications
app.get('/supervisor/laptop-applications', requireSupervisorAuth, (req, res) => {
  res.render('supervisor/laptop-applications');
});

app.get('/api/supervisor/laptop-applications', requireSupervisorAuth, async (req, res) => {
  try {
    const applications = await getAllLaptopApplications();
    res.json({ success: true, applications });
  } catch (error) {
    console.error('Error fetching laptop applications:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching applications' 
    });
  }
});
// Route to get user profile data
app.get('/api/customer/profile', requireCustomerAuth, async (req, res) => {
    try {
      const userId = req.session.user.userId;
      const db = await getDb();
      
      const user = await db.get('SELECT * FROM customers WHERE user_id = ?', [userId]);
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      // Remove sensitive data
      const { password, ...userData } = user;
      res.json({ success: true, user: userData });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ success: false, message: 'Error fetching profile' });
    }
  });
  
  // Route to update user profile
  app.put('/api/customer/profile', requireCustomerAuth, async (req, res) => {
    try {
      const userId = req.session.user.userId;
      const { firstName, lastName, email, phone } = req.body;
  
      // Basic validation
      const errors = {};
      if (!firstName || firstName.length < 2) {
        errors.firstName = 'First name must be at least 2 characters';
      }
      if (!lastName || lastName.length < 2) {
        errors.lastName = 'Last name must be at least 2 characters';
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        errors.email = 'Please enter a valid email address';
      }
      if (!phone || phone.length < 10) {
        errors.phone = 'Please enter a valid phone number';
      }
  
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, errors });
      }
  
      const result = await updateCustomer(userId, {
        first_name: firstName,
        last_name: lastName,
        email,
        phone
      });
  
      if (result.success) {
        // Update session data
        req.session.user.firstName = firstName;
        req.session.user.lastName = lastName;
        req.session.user.email = email;
        
        return res.json({ success: true, message: 'Profile updated successfully' });
      } else {
        return res.status(500).json({ success: false, message: result.message || 'Error updating profile' });
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  
  // Route to change password
  app.put('/api/customer/password', requireCustomerAuth, async (req, res) => {
    try {
      const userId = req.session.user.userId;
      const { currentPassword, newPassword } = req.body;
  
      // Validate passwords
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Current and new passwords are required' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
      }
  
      // Verify current password
      const db = await getDb();
      const user = await db.get('SELECT password FROM customers WHERE user_id = ?', [userId]);
      
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: 'Current password is incorrect' });
      }
  
      // Update password
      const result = await updateCustomerPassword(userId, newPassword);
  
      if (result.success) {
        return res.json({ success: true, message: 'Password updated successfully' });
      } else {
        return res.status(500).json({ success: false, message: result.message || 'Error updating password' });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  
// Route to get all customer applications (laptops and phones)
app.get('/api/customer/listings', requireCustomerAuth, async (req, res) => {
  try {
    const userId = req.session.user.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User ID not found in session' });
    }

    const laptopApplications = await getLaptopApplicationsByUserId(userId);
    const phoneApplications = await getPhoneApplicationsByUserId(userId);
    const listings = [
      ...laptopApplications.map(app => ({ ...app, type: 'laptop' })),
      ...phoneApplications.map(app => ({ ...app, type: 'phone' })),
    ];

    res.json({ success: true, listings });
  } catch (error) {
    console.error('Error fetching customer listings:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Error fetching listings: ' + error.message });
  }
});

  // Route to get applications for the logged-in customer
  app.get('/api/customer/phone-applications', requireCustomerAuth, async (req, res) => {
    try {
      const applications = await getPhoneApplicationsByUserId(req.session.user.userId);
      res.json({ success: true, applications });
    } catch (error) {
      console.error('Error fetching customer applications:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching applications' 
      });
    }
  });
  
  // Route for supervisors to update application status
  app.put('/api/supervisor/phone-applications/:id/status', requireSupervisorAuth, async (req, res) => {
    try {
      const id = req.params.id;
      const { status } = req.body;
      
      if (!status || !['pending', 'approved', 'rejected', 'processing'].includes(status)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid status' 
        });
      }
      
      const result = await updatePhoneApplicationStatus(id, status);
      
      if (result.success) {
        return res.json({ 
          success: true, 
          message: 'Status updated successfully' 
        });
      } else {
        return res.status(500).json({ 
          success: false, 
          message: result.message || 'Error updating status' 
        });
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error' 
      });
    }
  });
  
  // Route to get a specific laptop application
  app.get('/api/laptop-applications/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const application = await getLaptopApplicationById(id);
      
      if (!application) {
        return res.status(404).json({ 
          success: false, 
          message: 'Application not found' 
        });
      }
      
      // Check if the user is authorized to view this application
      if (!req.session.user || 
          (req.session.user.role !== 'supervisor' && 
           req.session.user.role !== 'admin' && 
           application.user_id !== req.session.user.userId)) {
        return res.status(403).json({ 
          success: false, 
          message: 'Unauthorized' 
        });
      }
      
      res.json({ success: true, application });
    } catch (error) {
      console.error('Error fetching laptop application:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching application' 
      });
    }
  });
  
  // Route to get laptop applications for the logged-in customer
  app.get('/api/customer/laptop-applications', requireCustomerAuth, async (req, res) => {
    try {
      const applications = await getLaptopApplicationsByUserId(req.session.user.userId);
      res.json({ success: true, applications });
    } catch (error) {
      console.error('Error fetching customer applications:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching applications' 
      });
    }
  });
  
  // Route for supervisors to update laptop application status
  app.put('/api/supervisor/laptop-applications/:id/status', requireSupervisorAuth, async (req, res) => {
    try {
      const id = req.params.id;
      const { status } = req.body;
      
      if (!status || !['pending', 'approved', 'rejected', 'processing'].includes(status)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid status' 
        });
      }
      
      const result = await updateLaptopApplicationStatus(id, status);
      
      if (result.success) {
        return res.json({ 
          success: true, 
          message: 'Status updated successfully' 
        });
      } else {
        return res.status(500).json({ 
          success: false, 
          message: result.message || 'Error updating status' 
        });
      }
    } catch (error) {
      console.error('Error updating laptop application status:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error' 
      });
    }
  });
  
  app.get('/api/customer/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ success: false, message: 'Error logging out' });
        }
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

// Your existing routes
app.get('/', (req, res) => {
    res.render("homepage");
});

app.get('/sell-laptop', (req, res) => {
    res.render("sell-laptop");
});


app.get('/Accessories', (req, res) => {
    res.render("accessories");
});

app.get('/sell-phone-models', (req, res) => {
    res.render("sellphone-container");
});

app.get('/buy-phone', async (req, res) => {
  try {
      const phones = await getAllPhones();
      res.render("buy_phone", { phoneModels: phones });
  } catch (error) {
      console.error('Error fetching phones:', error);
      res.status(500).render('error', { message: 'Failed to load phones' });
  }
});

app.get('/buy-laptop', async (req, res) => {
  try {
      const laptops = await getAllLaptops();
      res.render("buy_laptop", { laptopModels: laptops });
  } catch (error) {
      console.error('Error fetching laptops:', error);
      res.status(500).render('error', { message: 'Failed to load laptops' });
  }
});

app.get('/chargers', async(req, res) => {
    const chargers = await getAllChargers();
        
    res.render("chargers",{chargers}); 
});

app.get('/earbuds', async (req, res) => {
    try {
        const earphones = await getAllEarphones();
        
        res.render("earpods",{earphones}); // Pass earphones data to the view
    } catch (error) {
        console.error('Error fetching earphones:', error);
        res.status(500).render('error', { message: 'Failed to load earphones' });
    }
});

app.get('/mouses',async  (req, res) => {
  const mouses = await getAllMouses();
        
  res.render("mouse",{mouses}); 
});

app.get('/smartwatches', async (req, res) => {
  const smartwatches=await getAllSmartwatches();
    res.render("smartwatch",{smartwatches});
});

app.get('/filter-buy-phone', async (req, res) => {
    try {
        const phones = await getAllPhones();
        res.render("filter-buy-phone", { phoneModels: phones });
    } catch (error) {
        console.error('Error fetching phones for filter:', error);
        res.status(500).render('error', { message: 'Failed to load phones' });
    }
});

app.get('/filter-buy-laptop', async (req, res) => {
    try {
        const laptops = await getAllLaptops();
        res.render("filter-buy-laptop", { laptopModels: laptops });
    } catch (error) {
        console.error('Error fetching laptops for filter:', error);
        res.status(500).render('error', { message: 'Failed to load laptops' });
    }
});

app.get('/cart', (req, res) => {
    res.render("cart");
});

app.get('/profile', requireCustomerAuth, (req, res) => {
    res.render("user-profile");
});


app.get('/login', (req, res) => {
    res.render("login-interfaces");
});

app.get('/customerlogin', (req, res) => {
    res.render("login");
});

app.get('/signup', (req, res) => {
    res.render("signup");
});
app.get('/listings', (req, res) => {
    res.render("listings");
});

app.get('/blog', (req, res) => {
    res.render("blog");
});

app.get('/contact_us', (req, res) => {
    res.render("contact_us");
});

app.get('/about_us', (req, res) => {
    res.render("about_us");
});

// Supervisor routes
app.get('/supervisor/login', (req, res) => {
    res.render("supervisor/supervisor-login", { error: null });
});

app.get('/supervisor/home', requireSupervisorAuth, (req, res) => {
    res.render("supervisor/home", { user: req.session.user });
});


app.get('/api/supervisor/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/supervisor/login');
});



// API routes for laptop management
app.get('/api/laptops', async (req, res) => {
    try {
        const laptops = await getAllLaptops();
        res.json(laptops);
    } catch (error) {
        console.error('Error fetching laptops:', error);
        res.status(500).json({ error: 'Failed to fetch laptops' });
    }
});

app.get('/api/laptops/:id', async (req, res) => {
    try {
        const laptop = await getLaptopById(req.params.id);
        
        if (!laptop) {
            return res.status(404).json({ error: 'Laptop not found' });
        }
        
        res.json(laptop);
    } catch (error) {
        console.error('Error fetching laptop:', error);
        res.status(500).json({ error: 'Failed to fetch laptop' });
    }
});



// API routes for phone management
app.get('/api/product', async (req, res) => {
    try {
        const phones = await getAllPhones();
        res.json(phones);
    } catch (error) {
        console.error('Error fetching phones:', error);
        res.status(500).json({ error: 'Failed to fetch phones' });
    }
});

app.get('/api/product/:id', async (req, res) => {
    try {
        const phone = await getPhoneById(req.params.id);
        
        if (!phone) {
            return res.status(404).json({ error: 'Phone not found' });
        }
        
        res.json(phone);
    } catch (error) {
        console.error('Error fetching phone:', error);
        res.status(500).json({ error: 'Failed to fetch phone' });
    }
});

app.get('/api/earbuds', async (req, res) => {
    try {
      const earphones = await getAllEarphones(); // Fetch all earphones from the database
      res.json(earphones); // Return earphones data as JSON
    } catch (error) {
      console.error('Error fetching earphones:', error);
      res.status(500).json({ error: 'Failed to fetch earphones' });
    }
  });
  app.get('/api/chargers', async (req, res) => {
    try {
      const chargers = await getAllChargers(); // Fetch all earphones from the database
      res.json(chargers); // Return earphones data as JSON
    } catch (error) {
      console.error('Error fetching chargers:', error);
      res.status(500).json({ error: 'Failed to fetch chargers' });
    }
  });
  app.get('/api/mouses', async (req, res) => {
    try {
      const mouses= await getAllMouses(); // Fetch all earphones from the database
      res.json(mouses); // Return earphones data as JSON
    } catch (error) {
      console.error('Error fetching mouses:', error);
      res.status(500).json({ error: 'Failed to fetch mouses' });
    }
  });
  app.get('/api/smartwatches', async (req, res) => {
    try {
      const smartwatches= await getAllSmartwatches(); // Fetch all earphones from the database
      res.json(smartwatches); // Return earphones data as JSON
    } catch (error) {
      console.error('Error fetching smartwatches:', error);
      res.status(500).json({ error: 'Failed to fetch smartwatches' });
    }
  });
// Updated route to get laptop details from database
app.get('/laptop/:id', async (req, res) => {
    try {
        const laptopId = parseInt(req.params.id);
        const laptop = await getLaptopById(laptopId);
        
        if (!laptop) {
            return res.status(404).render('404', { message: 'Laptop not found' });
        }
        
        res.render('laptop-details', { laptop });
    } catch (error) {
        console.error('Error fetching laptop details:', error);
        res.status(500).render('error', { message: 'Failed to load laptop details' });
    }
});

// Updated route to get phone details from database
app.get('/product/:id', async (req, res) => {
    try {
        const phoneId = parseInt(req.params.id);
        const phone = await getPhoneById(phoneId);
        
        res.render('product-details', { phone });
    } catch (error) {
        console.error('Error fetching phone details:', error);
        res.status(500).render('error', { message: 'Failed to load phone details' });
    }
});


// Route to render earphone details page
app.get('/earphone/:id', async (req, res) => {
    try {
        const earphoneId = req.params.id;
        const earphone = await getEarphonesById(earphoneId); // Fetch earphone from database

        if (!earphone) {
            return res.status(404).render('404', { message: 'Earphone not found' });
        }

        res.render('earphones-details', { earphone });
    } catch (error) {
        console.error('Error fetching earphone details:', error);
        res.status(500).render('error', { message: 'Failed to load earphone details' });
    }
});

// Route to fetch earphone data as JSON
app.get('/api/earphone/:id', async (req, res) => {
    try {
        const earphoneId = req.params.id;
        const earphone = await getEarphonesById(earphoneId); // Fetch earphone from database

        if (!earphone) {
            return res.status(404).json({ error: 'Earphone not found' });
        }

        res.json(earphone);
    } catch (error) {
        console.error('Error fetching earphone:', error);
        res.status(500).json({ error: 'Failed to fetch earphone' });
    }
});

app.get('/charger/:id', async (req, res) => {
    try {
        const chargerId = req.params.id;
        const charger= await getChargerById(chargerId); // Fetch earphone from database

        if (!charger) {
            return res.status(404).render('404', { message: 'Charger not found' });
        }

        res.render('charger-details', { charger });
    } catch (error) {
        console.error('Error fetching charger details:', error);
        res.status(500).render('error', { message: 'Failed to load charger details' });
    }
});

app.get('/api/charger/:id', async(req, res) => {
    const chargerId = req.params.id;
    const charger = await getChargerById(chargerId);
    
    if (!charger) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(charger);
});

app.get('/mouse/:id', async(req, res) => {
    const mouseId = req.params.id;
    const mouse = await getMouseById(mouseId);
    
    if (!mouse) {
        return res.status(404).render('404', { message: 'Product not found' });
    }
    
    res.render('mouse-details', { mouse });
});

app.get('/api/mouse/:id', async(req, res) => {
    const mouseId = req.params.id;
    const mouse = await getMouseById(mouseId);
    if (!mouse) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(mouse);
});

app.get('/smartwatch/:id', async (req, res) => {
    const smartwatchId = req.params.id;
    const smartwatch = await getSmartwatchById(smartwatchId);
    
    if (!smartwatch) {
        return res.status(404).render('404', { message: 'Product not found' });
    }
    
    res.render('smartwatch-details', { smartwatch });
});

app.get('/api/smartwatch/:id',async (req, res) => {
    const smartwatchId = req.params.id;
    const smartwatch = await getSmartwatchById(smartwatchId);
    
    if (!smartwatch) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(smartwatch);
});
// Render sell-phone page
app.get('/sell-phone', (req, res) => {
    res.render('sell-phone');
  });
  
  // Render supervisor phone applications dashboard
  app.get('/supervisor/phone-applications', requireSupervisorAuth, (req, res) => {
    res.render('supervisor/phone-applications');
  });
  
  // Render customer applications page
  app.get('/customer/phone-applications', requireCustomerAuth, (req, res) => {
    res.render('customer/phone-applications');
  });

// Add these routes under "Supervisor Routes" section in app.js

// Verify Listings Page
app.get('/supervisor/verify-listings', requireSupervisorAuth, (req, res) => {
  res.render('supervisor/verify-listings', { supervisor: req.session.user });
});

// In app.js
app.get('/api/supervisor/verify-applications', requireSupervisorAuth, async (req, res) => {
  try {
      const db = await getDb();
      const phoneApps = await db.all(`
          SELECT 'phone' AS type, id, brand, model, status, created_at, price
          FROM phone_applications
      `);
      const laptopApps = await db.all(`
          SELECT 'laptop' AS type, id, brand, model, status, created_at, price
          FROM laptop_applications
      `);
      const applications = [...phoneApps, ...laptopApps];
      res.json({ success: true, applications });
  } catch (error) {
      console.error('Error fetching applications:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch applications' });
  }
});

// API to get specific application details
app.get('/api/supervisor/application/:type/:id', requireSupervisorAuth, async (req, res) => {
  try {
      const { type, id } = req.params;
      let application;
      if (type === 'phone') {
          application = await getPhoneApplicationById(id);
      } else if (type === 'laptop') {
          application = await getLaptopApplicationById(id);
      } else {
          return res.status(400).json({ success: false, message: 'Invalid application type' });
      }

      if (!application) {
          return res.status(404).json({ success: false, message: 'Application not found' });
      }

      console.log('Application data sent:', application); // Debugging
      res.json({ success: true, application, type });
  } catch (error) {
      console.error('Error fetching application details:', error);
      res.status(500).json({ success: false, message: 'Error fetching application details' });
  }
});

// API to update application status with supervisor actions
app.put('/api/supervisor/application/:type/:id/status', requireSupervisorAuth, async (req, res) => {
  try {
      const { type, id } = req.params;
      const { status, rejectionReason, price } = req.body;

      if (!status || !['pending', 'approved', 'rejected', 'processing'].includes(status)) {
          return res.status(400).json({ success: false, message: 'Invalid status' });
      }

      if (status === 'approved' && (!price || price <= 0)) {
          return res.status(400).json({ success: false, message: 'Valid price is required for approval' });
      }

      let result;
      if (type === 'phone') {
          result = await updatePhoneApplicationStatus(id, status, rejectionReason, price);
      } else if (type === 'laptop') {
          result = await updateLaptopApplicationStatus(id, status, rejectionReason, price);
      } else {
          return res.status(400).json({ success: false, message: 'Invalid application type' });
      }

      if (result.success) {
          const db = await getDb();
          await db.run(
              'INSERT INTO supervisor_activity (supervisor_id, action, timestamp) VALUES (?, ?, ?)',
              [
                  req.session.user.userId,
                  `Updated ${type} application #${id} to ${status}${status === 'rejected' && rejectionReason ? `: ${rejectionReason}` : ''}${status === 'approved' ? ` with price ₹${price}` : ''}`,
                  new Date().toISOString()
              ]
          );
          res.json({ success: true, message: 'Status updated successfully' });
      } else {
          res.status(500).json({ success: false, message: result.message || 'Error updating status' });
      }
  } catch (error) {
      console.error('Error updating application status:', error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/supervisor/approved-listings', requireSupervisorAuth, async (req, res) => {
  try {
      const phoneApps = await getAllPhoneApplications();
      const laptopApps = await getAllLaptopApplications();
      const products = [
          ...phoneApps.filter(app => ['approved', 'added_to_inventory'].includes(app.status)).map(app => ({ ...app, type: 'phone' })),
          ...laptopApps.filter(app => ['approved', 'added_to_inventory'].includes(app.status)).map(app => ({ ...app, type: 'laptop' })),
      ];
      res.json({ success: true, products });
  } catch (error) {
      console.error('Error fetching approved listings:', error);
      res.status(500).json({ success: false, message: 'Error fetching approved listings' });
  }
});

app.post('/api/supervisor/add-to-inventory/:type/:id', requireSupervisorAuth, async (req, res) => {
  try {
      const { type, id } = req.params;
      const { discount, condition } = req.body;

      if (!condition || !['Used', 'Like New', 'Refurbished'].includes(condition)) {
          return res.status(400).json({ success: false, message: 'Valid condition is required' });
      }
      if (discount && (isNaN(discount) || discount < 0 || discount > 100)) {
          return res.status(400).json({ success: false, message: 'Discount must be between 0 and 100' });
      }

      let application;
      if (type === 'phone') {
          application = await getPhoneApplicationById(id);
      } else if (type === 'laptop') {
          application = await getLaptopApplicationById(id);
      } else {
          return res.status(400).json({ success: false, message: 'Invalid type' });
      }

      if (!application || application.status !== 'approved' || !application.price) {
          return res.status(404).json({ success: false, message: 'Approved application with price not found' });
      }

  
      const db = await getDb();
      if (type === 'phone') {
        const price=(application.price*1.5).toFixed(0);
          const phoneData = {
              id: Date.now(),
              brand: application.brand,
              model: application.model,
              color: 'N/A',
              image: application.image_path,
              processor: application.processor,
              display: application.size || 'N/A',
              battery: parseInt(application.battery),
              camera: application.camera,
              os: application.os,
              network: application.network,
              weight: application.weight || 'N/A',
              ram: application.ram,
              rom: application.rom,
              basePrice:price, 
              discount: discount || 0,
              condition: condition
          };
          await addPhone(phoneData);
          await updatePhoneApplicationStatus(id, 'added_to_inventory');
      } else if (type === 'laptop') {
        const price=(application.price*1.5).toFixed(0);
          const laptopData = {
              id: Date.now(),
              brand: application.brand,
              series: application.model,
              processorName: application.processor,
              processorGeneration: application.generation || 'N/A',
              basePrice: price, // Use the stored price
              discount: discount || 0,
              ram: application.ram,
              storage_type: 'SSD',
              storage_capacity: application.storage,
              display_size: parseFloat(application.display_size) || 0,
              weight: parseFloat(application.weight) || 0,
              condition: condition,
              os: application.os || 'N/A',
              image: application.image_path
          };
          await addLaptop(laptopData);
          await updateLaptopApplicationStatus(id, 'added_to_inventory');
      }

      await db.run(
          'INSERT INTO supervisor_activity (supervisor_id, action, timestamp) VALUES (?, ?, ?)',
          [req.session.user.userId, `Added ${type} #${id} to inventory with price ₹${application.price}, condition ${condition}, and ${discount || 0}% discount`, new Date().toISOString()]
      );

      res.json({ success: true, message: 'Added to inventory successfully' });
  } catch (error) {
      console.error('Error adding to inventory:', error);
      res.status(500).json({ success: false, message: 'Error adding to inventory' });
  }
});

app.get('/buy/:type/:id', requireCustomerAuth, async (req, res) => {
  try {
    const accessoryType = req.params.type.toLowerCase();
    const accessoryId = req.params.id;
    const userId = req.session.user.userId;

    const fetchFunctions = {
      'earphone': getEarphonesById,
      'charger': getChargerById,
      'mouse': getMouseById,
      'smartwatch': getSmartwatchById,
      'product': getPhoneById,
      'laptop': getLaptopById
    };

    if (!fetchFunctions[accessoryType]) {
      return res.status(400).render('404', { message: 'Invalid accessory type' });
    }

    const fetchFunction = fetchFunctions[accessoryType];
    const accessory = await fetchFunction(accessoryId);

    if (!accessory) {
      return res.status(404).render('404', { message: `${accessoryType} not found` });
    }

    const finalPrice = parseFloat(accessory.pricing.originalPrice) -
      (parseFloat(accessory.pricing.originalPrice) * parseFloat(accessory.pricing.discount) / 100);

    res.render('dummy-payment', {
      price: finalPrice,
      type: accessoryType,
      id: accessoryId,
      accessory: accessory,
      userId: userId // Pass userId to the template
    });
  } catch (error) {
    console.error(`Error rendering payment page for ${req.params.type}:`, error);
    res.status(500).render('error', { message: 'Failed to load payment page' });
  }
});
app.get('/orders', requireCustomerAuth, async (req, res) => {
  let order = {};
  try {
    if (req.query.order) {
      order = JSON.parse(req.query.order);
    } else if (req.query.orderId) {
      order = await getOrderById(req.query.orderId);
      if (!order || order.user_id !== req.session.user.userId) {
        return res.status(404).render('404', { message: 'Order not found or unauthorized' });
      }
    }
    res.render('orders', { order });
  } catch (error) {
    console.error('Error in /orders route:', error);
    res.status(500).render('error', { message: 'Failed to load order confirmation' });
  }
});
app.get('/myorders', requireCustomerAuth, (req, res) => {
  try {
    // Orders will be fetched client-side via /api/myorders
    res.render('myorders', { orders: [] });
  } catch (error) {
    console.error('Error rendering myorders page:', error);
    res.status(500).render('error', { message: 'Failed to load my orders' });
  }
});

app.get('/checkout', (req, res) => {
  const session = req.session.user;
  if (!session || session.role !== 'customer') {
      return res.redirect('/login');
  }
  const userId = session.userId;
  // Cart is managed client-side; pass userId to fetch from localStorage
  res.render('checkout', { userId });
});

  function requireAdminAuth(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
      next();
    } else {
      res.redirect('/admin/login');
    }
  }

  // Admin Routes
app.get('/admin/login', (req, res) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return res.redirect('/admin/home');
  }
  res.render('admin/admin-login', { error: null });
});

app.get('/admin/home', requireAdminAuth, (req, res) => {
  res.render('admin/home', { admin: req.session.user });
});

app.get('/admin/statistics', requireAdminAuth, (req, res) => {
  res.render('admin/admin-statistics', { admin: req.session.user });
});

app.post('/api/admin/login', async (req, res) => {
  const { admin_id, password, security_token } = req.body;

  if (!admin_id || !password || !security_token) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const db = await getDb();
    const admin = await db.get('SELECT * FROM admins WHERE admin_id = ?', [admin_id]);

    if (!admin) {
      console.log(`Failed admin login attempt: ${admin_id} at ${new Date().toISOString()}`);
      return res.status(401).json({ success: false, message: 'Invalid credentials. This attempt has been logged.' });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    const tokenMatch = security_token === admin.security_token;

    if (passwordMatch && tokenMatch) {
      req.session.user = {
        adminId: admin.admin_id,
        name: admin.name,
        role: 'admin',
        loginTime: new Date().toISOString()
      };
      return res.json({ success: true, name: admin.name, redirect: '/admin/home' });
    } else {
      console.log(`Failed admin login attempt: ${admin_id} at ${new Date().toISOString()}`);
      return res.status(401).json({ success: false, message: 'Invalid credentials. This attempt has been logged.' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// Render Manage Supervisors Page
// Render Manage Supervisors Page
app.get('/admin/manage-supervisors', requireAdminAuth, (req, res) => {
  res.render('admin/manage-supervisors', { admin: req.session.user });
});

// API to Get All Supervisors
app.get('/api/admin/supervisors', requireAdminAuth, async (req, res) => {
  try {
    const db = await getDb();
    const supervisors = await db.all(`
      SELECT user_id, first_name, last_name, email, phone, username, created_at 
      FROM supervisors
    `);
    console.log('Fetched supervisors:', supervisors); // Debug log
    res.json({ success: true, supervisors });
  } catch (error) {
    console.error('Error fetching supervisors:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch supervisors' });
  }
});

// API to Delete a Supervisor
app.delete('/api/admin/supervisors/:userId', requireAdminAuth, async (req, res) => {
  const { userId } = req.params;
  try {
    const db = await getDb();
    const result = await db.run('DELETE FROM supervisors WHERE user_id = ?', [userId]);
    if (result.changes > 0) {
      res.json({ success: true, message: 'Supervisor deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Supervisor not found' });
    }
  } catch (error) {
    console.error('Error deleting supervisor:', error);
    res.status(500).json({ success: false, message: 'Failed to delete supervisor' });
  }
});

// API to Add a Supervisor (Ensure compatibility with your schema)
app.post('/api/admin/add-supervisor', requireAdminAuth, async (req, res) => {
  const { firstName, lastName, email, phone, username, password } = req.body;
  const userId = `supervisor_${Date.now()}`; // Simple unique user_id; adjust if needed
  try {
    const db = await getDb();
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run(`
      INSERT INTO supervisors (user_id, first_name, last_name, email, phone, username, password)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [userId, firstName, lastName, email, phone, username, hashedPassword]);
    res.json({ success: true, message: 'Supervisor added successfully' });
  } catch (error) {
    console.error('Error adding supervisor:', error);
    res.status(500).json({ success: false, message: 'Failed to add supervisor' });
  }
});

app.get('/api/admin/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error during logout:', err);
      return res.json({ success: false, message: 'Logout failed' });
    }
    res.json({ success: true, redirect: '/admin/login' });
  });
});

app.get('/admin/profile', requireAdminAuth, async (req, res) => {
  try {
    const db = await getDb();
    const admin = await db.get('SELECT admin_id, name, email FROM admins WHERE admin_id = ?', [req.session.user.adminId]);
    if (!admin) {
      return res.status(404).render('error', { message: 'Admin not found' });
    }
    res.render('admin/admin-profile', { admin });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).render('error', { message: 'Failed to load profile' });
  }
});


// API to create an order
app.post('/api/orders', requireCustomerAuth, async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const orderData = req.body;

    const result = await createOrder(userId, orderData);
    if (!result.success) {
      return res.status(500).json({ success: false, message: result.message });
    }

    res.json({ success: true, orderId: result.orderId });
  } catch (error) {
    console.error('Error in /api/orders:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API to get user's orders
app.get('/api/myorders', requireCustomerAuth, async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const orders = await getOrdersByUserId(userId);
    res.json(orders);
  } catch (error) {
    console.error('Error in /api/myorders:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API to get a specific order by ID
app.get('/api/orders/:orderId', requireCustomerAuth, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Ensure the order belongs to the requesting user
    if (order.user_id !== req.session.user.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to order' });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Error in /api/orders/:orderId:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/admin/statistics', requireAdminAuth, async (req, res) => {
  try {
    const db = await getDb();
    const salesCountResult = await db.get(`
      SELECT COUNT(*) as total_sales
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.order_id
    `) || { total_sales: 0 };
    console.log('Sales Count:', salesCountResult);

    const listingsCountResult = await db.get(`
      SELECT 
          (SELECT COUNT(*) FROM phone_applications) + 
          (SELECT COUNT(*) FROM laptop_applications) as total_listings,
          (SELECT COUNT(*) FROM phone_applications WHERE status IN ('approved', 'added_to_inventory')) + 
          (SELECT COUNT(*) FROM laptop_applications WHERE status IN ('approved', 'added_to_inventory')) as approved_listings
    `) || { total_listings: 0, approved_listings: 0 };
    console.log('Listings Count:', listingsCountResult);

    // Sales Revenue
    const salesRevenueResult = await db.get(`
      SELECT SUM(oi.amount * oi.quantity) as total_sales_revenue
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.order_id
    `) || { total_sales_revenue: 0 };
    console.log('Sales Revenue:', salesRevenueResult);

    const inventoryRevenueResult = await db.get(`
      SELECT 
          COALESCE(
              (SELECT SUM(CAST(COALESCE(base_price, '0') AS REAL)) 
               FROM phones), 
              0
          ) +
          COALESCE(
              (SELECT SUM(CAST(COALESCE(base_price, '0') AS REAL)) 
               FROM laptops), 
              0
          ) +
          COALESCE(
              (SELECT SUM(CAST(COALESCE(originalPrice, '0') AS REAL)) 
               FROM chargers), 
              0
          ) +
          COALESCE(
              (SELECT SUM(CAST(COALESCE(original_price, '0') AS REAL)) 
               FROM earphones), 
              0
          ) +
          COALESCE(
              (SELECT SUM(CAST(COALESCE(original_price, '0') AS REAL)) 
               FROM mouses), 
              0
          ) +
          COALESCE(
              (SELECT SUM(CAST(COALESCE(original_price, '0') AS REAL)) 
               FROM smartwatches), 
              0
          ) as total_inventory_revenue_potential
    `) || { total_inventory_revenue_potential: 0 };
    console.log('Inventory Revenue:', inventoryRevenueResult);

    res.json({
      success: true,
      statistics: {
        totalSales: salesCountResult.total_sales || 0,
        totalListings: listingsCountResult.total_listings || 0,
        approvedListings: listingsCountResult.approved_listings || 0,
        totalSalesRevenue: salesRevenueResult.total_sales_revenue || 0,
        totalInventoryRevenuePotential: inventoryRevenueResult.total_inventory_revenue_potential || 0
      }
    });
  } catch (error) {
    console.error('Detailed error fetching admin statistics:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Error fetching statistics: ' + error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
