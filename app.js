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
  addCharger,
  updateCharger,
  deleteCharger,
  getAllEarphones,
  getEarphonesById,
  addEarphones,
  updateEarphones,
  deleteEarphones,
  PhoneApplication,
  LaptopApplication,
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
  addSmartwatch,
  updateSmartwatch,
  deleteSmartwatch,
  createOrder,
  getOrdersByUserId,
  getAllOrders,
  getAllSupervisors,
  deleteSupervisor,
  getLatestPhones,
  getLatestLaptops,
  authenticateAdmin, 
  updateAdmin,       
  logSupervisorActivity, 
  SupervisorActivity,
  Supervisor,
  OrderItem,
  Phone,
  Laptop,
  Charger,
  Mouse,
  Smartwatch,
  Earphone,
  Order,
  Customer,
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
  if (!req.session.user || req.session.user.role !== 'customer') {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
}

function requireAdminAuth(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    res.redirect('/admin/login');
  }
}

// Test database connection route
app.get('/api/test-db', async (req, res) => {
  try {
    // Simple MongoDB ping by fetching a small collection
    await getAllPhones(); // Any lightweight query to test connection
    res.json({ success: true, message: 'Database connection successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});

// Supervisor Routes
app.get('/supervisor/login', (req, res) => {
  res.render('supervisor/supervisor-login', { error: null });
});

app.get('/supervisor/statistics', requireSupervisorAuth, async (req, res) => {
  const supervisor = req.session.user;
  res.render('supervisor/supervisor-statistics', { supervisor });
});

app.get('/supervisor', requireSupervisorAuth, async (req, res) => {
  const supervisor = req.session.user;
  res.render('supervisor/supervisor-portal-home', { supervisor });
});

app.get('/supervisor/manage-inventory', requireSupervisorAuth, (req, res) => {
  const supervisor = req.session.user;
  res.render('supervisor/manage-inventory', { supervisor });
});

app.get('/supervisor/profile', requireSupervisorAuth, async (req, res) => {
  try {
    const supervisor = await Supervisor.findOne({ user_id: req.session.user.userId }).lean();
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
    const pendingListings = await Promise.all([
      PhoneApplication.countDocuments({ status: 'pending' }),
      LaptopApplication.countDocuments({ status: 'pending' }),
    ]).then(counts => counts.reduce((sum, count) => sum + count, 0));

    const itemsAdded = await SupervisorActivity.countDocuments({
      supervisor_id: req.session.user.userId,
      action: /Added .* to inventory/,
    });

    const recentActivity = await SupervisorActivity.find({
      supervisor_id: req.session.user.userId,
    })
      .sort({ timestamp: -1 })
      .limit(5)
      .lean()
      .select('action');

    res.json({
      success: true,
      pendingListings,
      itemsAdded,
      recentActivity: recentActivity.map(row => row.action),
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ success: false, message: 'Error fetching dashboard data' });
  }
});

app.get('/api/supervisor/statistics', requireSupervisorAuth, async (req, res) => {
  try {
    const supervisorId = req.session.user.userId;

    const itemsAdded = await SupervisorActivity.countDocuments({
      supervisor_id: supervisorId,
      action: /Added .* to inventory/,
    });

    const listingsVerified = await SupervisorActivity.countDocuments({
      supervisor_id: supervisorId,
      action: /Updated .* application.* to (approved|rejected)/,
    });

    const pendingListings = await Promise.all([
      PhoneApplication.countDocuments({ status: 'pending' }),
      LaptopApplication.countDocuments({ status: 'pending' }),
    ]).then(counts => counts.reduce((sum, count) => sum + count, 0));

    const recentActivity = await SupervisorActivity.find({
      supervisor_id: supervisorId,
    })
      .sort({ timestamp: -1 })
      .limit(5)
      .lean()
      .select('action timestamp');

    res.json({
      success: true,
      statistics: {
        totalItemsAdded: itemsAdded,
        listingsVerified: listingsVerified,
        pendingListings: pendingListings,
        recentActivity: recentActivity.map(a => ({
          action: a.action,
          timestamp: new Date(a.timestamp).toLocaleString(),
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching supervisor statistics:', error);
    res.status(500).json({ success: false, message: 'Error fetching statistics' });
  }
});

app.get('/api/supervisor/inventory', requireSupervisorAuth, async (req, res) => {
  try {
    const dbFunctions = {
      phones: getAllPhones,
      laptops: getAllLaptops,
      earphones: getAllEarphones,
      chargers: getAllChargers,
      mouses: getAllMouses,
      smartwatches: getAllSmartwatches,
    };

    const allItems = [];
    for (const [type, fetchFunction] of Object.entries(dbFunctions)) {
      const items = await fetchFunction();
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
  console.log("route testing:" + specificData.Pin_type);

  try {
    let result;
    const typeLower = type.toLowerCase();
    if (typeLower === 'earphones') {
      result = await addEarphones({
        id,
        title: specificData.title,
        brand,
        pricing,
        image,
        design: specificData.design,
        battery_life: specificData.battery_life,
      });
    } else if (typeLower === 'chargers') {
      result = await addCharger({
        id,
        title: specificData.title,
        brand,
        pricing,
        image,
        wattage: specificData.wattage,
        type: specificData.Pin_type,
        outputCurrent: specificData.output_current,
      });
    } else if (typeLower === 'mouses') {
      result = await addMouse({
        id,
        title: specificData.title,
        brand,
        pricing,
        image,
        type: specificData.wire_type,
        connectivity: specificData.connectivity,
        resolution: specificData.resolution,
      });
    } else if (typeLower === 'smartwatches') {
      result = await addSmartwatch({
        id,
        title: specificData.title,
        brand,
        pricing,
        image,
        display_size: specificData.display_size,
        display_type: specificData.display_type,
        battery_runtime: specificData.battery_runtime,
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid item type' });
    }
    if (result.success) {
      await logSupervisorActivity(
        req.session.user.userId,
        `Added ${typeLower} #${result.id} to inventory`
      );
      res.json({ success: true, id: result.id });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ success: false, message: 'Failed to add item' });
  }
});

app.put('/api/supervisor/inventory/:type/:id', requireSupervisorAuth, async (req, res) => {
  const { type, id } = req.params;
  const { brand, pricing, image, ...specificData } = req.body;
  try {
    let result;
    if (type === 'phones') {
      result = await updatePhone(id, {
        brand,
        pricing,
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
        condition: specificData.condition,
      });
    } else if (type === 'laptops') {
      result = await updateLaptop(id, {
        brand,
        pricing,
        image,
        series: specificData.series,
        processor: {
          name: specificData.processor_name,
          generation: specificData.processor_generation,
        },
        memory: {
          ram: specificData.ram,
          storage: {
            type: specificData.storage_type,
            capacity: specificData.storage_capacity,
          },
        },
        display_size: specificData.display_size,
        weight: specificData.weight,
        condition: specificData.condition,
        os: specificData.os,
      });
    } else if (type === 'earphones') {
      result = await updateEarphones(id, {
        brand,
        pricing,
        image,
        title: specificData.title,
        design: specificData.design,
        battery_life: specificData.battery_life || 'N/A',
      });
    } else if (type === 'chargers') {
      result = await updateCharger(id, {
        brand,
        pricing,
        image,
        title: specificData.title,
        wattage: specificData.wattage,
        Pin_type: specificData.Pin_type,
        output_current: specificData.output_current,
      });
    } else if (type === 'mouses') {
      result = await updateMouse(id, {
        brand,
        pricing,
        image,
        title: specificData.title,
        wire_type: specificData.wire_type,
        connectivity: specificData.connectivity,
        resolution: specificData.resolution,
      });
    } else if (type === 'smartwatches') {
      result = await updateSmartwatch(id, {
        brand,
        pricing,
        image,
        title: specificData.title,
        display_size: specificData.display_size,
        display_type: specificData.display_type,
        battery_runtime: specificData.battery_runtime,
      });
    }
    if (result.success) {
      await logSupervisorActivity(
        req.session.user.userId,
        `Updated ${type} #${id} in inventory`
      );
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error(`Error updating ${type}:`, error);
    res.status(500).json({ success: false, message: `Failed to update ${type}` });
  }
});

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
      await logSupervisorActivity(
        req.session.user.userId,
        `Deleted ${type} #${id} from inventory`
      );
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
        role: 'supervisor',
      };
      return res.json({
        success: true,
        firstName: result.supervisor.first_name,
        lastName: result.supervisor.last_name,
      });
    } else {
      return res.status(401).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Supervisor login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

app.get('/api/supervisor/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ success: false, message: 'Error logging out' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

app.put('/api/supervisor/profile', requireSupervisorAuth, async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const { first_name, last_name, email, phone, username } = req.body;

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
      username,
    });

    if (result.success) {
      req.session.user.first_name = first_name;
      req.session.user.last_name = last_name;
      req.session.user.email = email;
      req.session.user.phone = phone;
      req.session.user.username = username;
      return res.json({ success: true, message: 'Profile updated successfully' });
    } else {
      return res.status(400).json({
        success: false,
        message: result.message || 'Error updating profile',
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

    const supervisor = await Supervisor.findOne({ user_id: userId }).lean();
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



app.post('/api/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, password } = req.body;

    const errors = {};
    if (!firstName || firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }
    if (!lastName || lastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address (e.g., user@example.com)';
    }
    if (!phone || phone.length < 10) {
      errors.phone = 'Please enter a valid phone number';
    }
    if (!address) {
      errors.address = 'Address is required';
    } else {
      if (!address.street) {
        errors.street = 'Street is required';
      }
      if (!address.city) {
        errors.city = 'City is required';
      }
      if (!address.state) {
        errors.state = 'State is required';
      }
      if (!address.postal_code) {
        errors.postalCode = 'Postal code is required';
      } else if (!/^\d{5,10}$/.test(address.postal_code)) {
        errors.postalCode = 'Postal code must be 5-10 digits';
      }
      if (!address.country) {
        errors.country = 'Country is required';
      }
    }
    if (!password || password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const result = await createCustomer(firstName, lastName, email, phone, address, password);
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
      if (result.message.includes('email')) {
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

app.get('/api/latest-laptops', async (req, res) => {
  try {
    const laptops = await getLatestLaptops(5);
    console.log(laptops);
    res.json(laptops);
  } catch (error) {
    console.error('Error fetching latest laptops:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/latest-phones', async (req, res) => {
  try {
    const phones = await getLatestPhones(5);
    res.json(phones);
  } catch (error) {
    console.error('Error in /api/latest-phones:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
app.get('/api/latest-accessories', async (req, res) => {
  try {
    const types = ['charger', 'earphone', 'mouse', 'smartwatch'];
    const accessories = [];

    for (const type of types) {
      let collection;
      switch (type) {
        case 'charger':
          collection = Charger;
          break;
        case 'earphone':
          collection = Earphone;
          break;
        case 'mouse':
          collection = Mouse;
          break;
        case 'smartwatch':
          collection = Smartwatch;
          break;
      }

      const items = await collection
        .find()
        .sort({ created_at: -1, _id: -1 })
        .limit(2)
        .lean();

      items.forEach(item => {
        accessories.push({
          type,
          id: item.id,
          brand: item.brand,
          title: item.title || item.model || item.series || 'Unknown',
          base_price: item.original_price || item.originalPrice || 0,
          discount: item.discount || 0,
          image: item.image || '/images/placeholder.jpg',
          condition: item.condition || 'N/A',
          specs: {
            wattage: item.wattage, // Charger
            battery_life: item.battery_life, // Earphone, Smartwatch
            display_size: item.display_size, // Smartwatch
            connectivity: item.connectivity, // Mouse
            resolution: item.resolution, // Mouse
          },
        });
      });
    }

    if (accessories.length === 0) {
      return res.json([]); 
    }
    accessories.sort((a, b) => new Date(b.created_at || b._id) - new Date(a.created_at || a._id));
    res.json(accessories);
  } catch (error) {
    console.error('Error fetching latest accessories:', error);
    res.status(500).json({ error: 'Failed to fetch accessories' });
  }
});

app.post('/api/sell-phone', upload.single('device-image'), async (req, res) => {
  try {
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: 'phone-applications',
    });

    const applicationData = {
      user_id: req.session.user ? req.session.user.userId : null,
      brand: req.body.brand,
      model: req.body.model,
      ram: req.body.ram,
      rom: req.body.rom,
      processor: req.body.processor,
      network: req.body.network,
      size: req.body.size,
      weight: req.body.weight,
      device_age: req.body.deviceAge, 
      switching_on: req.body.switchingOn,
      phone_calls: req.body.phoneCalls,
      cameras_working: req.body.camerasWorking,
      battery_issues: req.body.batteryIssues,
      physically_damaged: req.body.physicallyDamaged,
      sound_issues: req.body.soundIssues,
      location: req.body.location,
      email: req.body.email,
      phone: req.body.phone,
      battery: req.body.battery,
      camera: req.body.camera,
      os: req.body.os,
      imagepath: req.file ? `/uploads/${req.file.filename}` : '',
    };


    const requiredFields = [
      'brand', 'model', 'ram', 'rom', 'processor', 'network',
      'device_age', 'switching_on', 'phone_calls', 'cameras_working',
      'battery_issues', 'physically_damaged', 'sound_issues',
      'location', 'email', 'phone', 'battery', 'camera', 'os'
    ];

    for (const field of requiredFields) {
      if (!applicationData[field]) {
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
    if (!req.session.user) {
      return res.status(401).json({ success: false, message: 'Please log in to submit an application' });
    }
    console.log( req.session.user);
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: 'laptop-applications',
    });

    const applicationData = {
      user_id: req.session.user ? req.session.user.userId : null,
      brand: req.body.brand,
      model: req.body.model,
      ram: req.body.ram,
      storage: req.body.storage,
      processor: req.body.processor,
      generation: req.body.generation,
      display_size: req.body.displaySize,
      weight: req.body.weight,
      os: req.body.os,
      device_age: req.body.deviceAge,
      battery_issues: req.body.batteryIssues,
      location: req.body.location,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image_path: result.secure_url,
    };

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

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Device image is required',
      });
    }

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
    console.error('Laptop application submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

app.get('/supervisor/phone-applications', requireSupervisorAuth, (req, res) => {
  res.render('supervisor/phone-applications');
});

app.get('/api/supervisor/phone-applications', requireSupervisorAuth, async (req, res) => {
  try {
    const applications = await getAllPhoneApplications();
    console.log(applications);
    res.json({ success: true, applications });
  } catch (error) {
    console.error('Error fetching phone applications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
    });
  }
});

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
      message: 'Error fetching applications',
    });
  }
});

app.get('/api/customer/profile', requireCustomerAuth, async (req, res) => {
  try {
    const userId = req.session.user.userId;

    const user = await Customer.findOne({ user_id: userId })
      .lean()
      .select('first_name last_name email phone address password_last_changed orders_count');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const itemsSoldCount = await Promise.all([
      PhoneApplication.countDocuments({ user_id: userId, status: { $in: ['added_to_inventory', 'approved'] } }),
      LaptopApplication.countDocuments({ user_id: userId, status: { $in: ['added_to_inventory', 'approved'] } }),
    ]).then(counts => counts.reduce((sum, count) => sum + count, 0));

    res.json({
      success: true,
      user: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        address: user.address || {},
        password_last_changed: user.password_last_changed || null,
        orders_count: user.orders_count || 0,
        items_sold_count: itemsSoldCount,
      },
    });
  } catch (error) {
    console.error('Error fetching customer profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
app.delete('/api/customer/profile', requireCustomerAuth, async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const result = await deleteCustomer(userId);
    if (result.success) {
      req.session.destroy();
      res.json({ success: true, message: 'Account deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/customer/profile', requireCustomerAuth, async (req, res) => {
  try {
      const userId = req.session.user.userId;
      const { firstName, lastName, email, phone, address } = req.body;

      // Validation
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
      // Validate address fields
      if (!address || typeof address !== 'object') {
          errors.address = 'Address is required';
      } else {
          if (!address.street || address.street.length < 1) {
              errors.street = 'Street is required';
          }
          if (!address.city || address.city.length < 1) {
              errors.city = 'City is required';
          }
          if (!address.state || address.state.length < 1) {
              errors.state = 'State is required';
          }
          if (!address.postal_code || !/^\d{5,10}$/.test(address.postal_code)) {
              errors.postal_code = 'Postal code must be 5-10 digits';
          }
          if (!address.country || address.country.length < 1) {
              errors.country = 'Country is required';
          }
      }

      if (Object.keys(errors).length > 0) {
          return res.status(400).json({ success: false, errors });
      }

      const result = await updateCustomer(userId, {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          address: {
              street: address.street,
              city: address.city,
              state: address.state,
              postal_code: address.postal_code,
              country: address.country,
          },
      });

      if (result.success) {
          req.session.user.firstName = firstName;
          req.session.user.lastName = lastName;
          req.session.user.email = email;
          req.session.user.address = {
              street: address.street,
              city: address.city,
              state: address.state,
              postal_code: address.postal_code,
              country: address.country,
          };
          return res.json({ success: true, message: 'Profile updated successfully' });
      } else {
          return res.status(500).json({ success: false, message: result.message || 'Error updating profile' });
      }
  } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/customer/password', requireCustomerAuth, async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new passwords are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const user = await Customer.findOne({ user_id: userId }).lean();
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

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
    console.error('Error fetching customer listings:', error);
    res.status(500).json({ success: false, message: 'Error fetching listings: ' + error.message });
  }
});

app.get('/api/customer/phone-applications', requireCustomerAuth, async (req, res) => {
  try {
    const applications = await getPhoneApplicationsByUserId(req.session.user.userId);
    res.json({ success: true, applications });
  } catch (error) {
    console.error('Error fetching customer applications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
    });
  }
});

app.put('/api/supervisor/phone-applications/:id/status', requireSupervisorAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (!status || !['pending', 'approved', 'rejected', 'processing'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const result = await updatePhoneApplicationStatus(id, status);
    if (result.success) {
      await logSupervisorActivity(
        req.session.user.userId,
        `Updated phone application #${id} to ${status}`
      );
      return res.json({
        success: true,
        message: 'Status updated successfully',
      });
    } else {
      return res.status(500).json({
        success: false,
        message: result.message || 'Error updating status',
      });
    }
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

app.get('/api/laptop-applications/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const application = await getLaptopApplicationById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    if (
      !req.session.user ||
      (req.session.user.role !== 'supervisor' &&
        req.session.user.role !== 'admin' &&
        application.user_id !== req.session.user.userId)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    res.json({ success: true, application });
  } catch (error) {
    console.error('Error fetching laptop application:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching application',
    });
  }
});

app.get('/api/customer/laptop-applications', requireCustomerAuth, async (req, res) => {
  try {
    const applications = await getLaptopApplicationsByUserId(req.session.user.userId);
    res.json({ success: true, applications });
  } catch (error) {
    console.error('Error fetching customer applications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
    });
  }
});

app.put('/api/supervisor/laptop-applications/:id/status', requireSupervisorAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (!status || !['pending', 'approved', 'rejected', 'processing'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const result = await updateLaptopApplicationStatus(id, status);
    if (result.success) {
      await logSupervisorActivity(
        req.session.user.userId,
        `Updated laptop application #${id} to ${status}`
      );
      return res.json({
        success: true,
        message: 'Status updated successfully',
      });
    } else {
      return res.status(500).json({
        success: false,
        message: result.message || 'Error updating status',
      });
    }
  } catch (error) {
    console.error('Error updating laptop application status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

app.get('/api/customer/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ success: false, message: 'Error logging out' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

app.get('/', (req, res) => {
  res.render('homepage');
});

app.get('/sell-laptop', (req, res) => {
  res.render('sell-laptop');
});

app.get('/Accessories', (req, res) => {
  res.render('accessories');
});

app.get('/sell-phone-models', (req, res) => {
  res.render('sellphone-container');
});

app.get('/buy-phone', async (req, res) => {
  try {
    const phones = await getAllPhones();
    res.render('buy_phone', { phoneModels: phones });
  } catch (error) {
    console.error('Error fetching phones:', error);
    res.status(500).render('error', { message: 'Failed to load phones' });
  }
});

app.get('/buy-laptop', async (req, res) => {
  try {
    const laptops = await getAllLaptops();
    res.render('buy_laptop', { laptopModels: laptops });
  } catch (error) {
    console.error('Error fetching laptops:', error);
    res.status(500).render('error', { message: 'Failed to load laptops' });
  }
});

app.get('/chargers', async (req, res) => {
  try {
    const chargers = await getAllChargers();
    res.render('chargers', { chargers });
  } catch (error) {
    console.error('Error fetching chargers:', error);
    res.status(500).render('error', { message: 'Failed to load chargers' });
  }
});

app.get('/earbuds', async (req, res) => {
  try {
    const earphones = await getAllEarphones();
    res.render('earpods', { earphones });
  } catch (error) {
    console.error('Error fetching earphones:', error);
    res.status(500).render('error', { message: 'Failed to load earphones' });
  }
});

app.get('/mouses', async (req, res) => {
  try {
    const mouses = await getAllMouses();
    res.render('mouse', { mouses });
  } catch (error) {
    console.error('Error fetching mouses:', error);
    res.status(500).render('error', { message: 'Failed to load mouses' });
  }
});

app.get('/smartwatches', async (req, res) => {
  try {
    const smartwatches = await getAllSmartwatches();
    res.render('smartwatch', { smartwatches });
  } catch (error) {
    console.error('Error fetching smartwatches:', error);
    res.status(500).render('error', { message: 'Failed to load smartwatches' });
  }
});

app.get('/filter-buy-phone', async (req, res) => {
  try {
    const phones = await getAllPhones();
    res.render('filter-buy-phone', { phoneModels: phones });
  } catch (error) {
    console.error('Error fetching phones for filter:', error);
    res.status(500).render('error', { message: 'Failed to load phones' });
  }
});

app.get('/filter-buy-laptop', async (req, res) => {
  try {
    const laptops = await getAllLaptops();
    res.render('filter-buy-laptop', { laptopModels: laptops });
  } catch (error) {
    console.error('Error fetching laptops for filter:', error);
    res.status(500).render('error', { message: 'Failed to load laptops' });
  }
});

app.get('/cart', (req, res) => {
  res.render('cart');
});

app.get('/profile', requireCustomerAuth, async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const user = await Customer.findOne({ user_id: userId })
      .lean()
      .select('first_name last_name email phone address orders_count created_at');

    if (!user) {
      return res.status(404).render('404', { message: 'User not found' });
    }

    const itemsSoldCount = await Promise.all([
      PhoneApplication.countDocuments({ user_id: userId, status: { $in: ['added_to_inventory', 'approved'] } }),
      LaptopApplication.countDocuments({ user_id: userId, status: { $in: ['added_to_inventory', 'approved'] } }),
    ]).then(counts => counts.reduce((sum, count) => sum + count, 0));

    res.render('user-profile', {
      user: {
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        address: user.address || { street: '', city: '', state: '', postal_code: '', country: '' }
      },
      ordersCount: user.orders_count || 0,
      itemsSoldCount: itemsSoldCount,
    });
  } catch (error) {
    console.error('Error rendering profile:', error);
    res.status(500).render('error', { message: 'Failed to load profile' });
  }
});

app.put('/api/customer/profile', requireCustomerAuth, async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const { firstName, lastName, email, phone, address } = req.body;

    console.log('Profile update request data:', req.body); // Debug log

    // Validate required fields
    const errors = {};
    if (!firstName || firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }
    if (!lastName || lastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!phone || phone.length < 10) {
      errors.phone = 'Please enter a valid phone number';
    }
    if (!address) {
      errors.address = 'Address is required';
    } else {
      if (!address.street) {
        errors.street = 'Street is required';
      }
      if (!address.city) {
        errors.city = 'City is required';
      }
      if (!address.state) {
        errors.state = 'State is required';
      }
      if (!address.postal_code) {
        errors.postalCode = 'Postal code is required';
      } else if (!/^\d{5,10}$/.test(address.postal_code)) {
        errors.postalCode = 'Postal code must be 5-10 digits';
      }
      if (!address.country) {
        errors.country = 'Country is required';
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // Update the customer document
    const updatedCustomer = await Customer.findOneAndUpdate(
      { user_id: userId },
      {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
        address: {
          street: address.street,
          city: address.city,
          state: address.state,
          postal_code: address.postal_code,
          country: address.country
        }
      },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedCustomer) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        first_name: updatedCustomer.first_name,
        last_name: updatedCustomer.last_name,
        email: updatedCustomer.email,
        phone: updatedCustomer.phone,
        address: updatedCustomer.address,
        orders_count: updatedCustomer.orders_count,
        items_sold_count: updatedCustomer.items_sold_count,
        password_last_changed: updatedCustomer.password_last_changed,
        created_at: updatedCustomer.created_at
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error.name === 'ValidationError') {
      const errors = {};
      for (const field in error.errors) {
        const fieldName = field.startsWith('address.') ? field.split('.')[1] : field;
        errors[fieldName] = error.errors[field].message;
      }
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }
    res.status(500).json({ success: false, message: 'Error updating profile' });
  }
});

app.get('/login', (req, res) => {
  res.render('login-interfaces');
});

app.get('/customerlogin', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/listings', (req, res) => {
  res.render('listings');
});

app.get('/blog', (req, res) => {
  res.render('blog');
});

app.get('/contact_us', (req, res) => {
  res.render('contact_us');
});

app.get('/about_us', (req, res) => {
  res.render('about_us');
});

app.get('/supervisor/login', (req, res) => {
  res.render('supervisor/supervisor-login', { error: null });
});

app.get('/supervisor/home', requireSupervisorAuth, (req, res) => {
  res.render('supervisor/home', { user: req.session.user });
});

app.get('/api/supervisor/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/supervisor/login');
});

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
    const earphones = await getAllEarphones();
    res.json(earphones);
  } catch (error) {
    console.error('Error fetching earphones:', error);
    res.status(500).json({ error: 'Failed to fetch earphones' });
  }
});

app.get('/api/chargers', async (req, res) => {
  try {
    const chargers = await getAllChargers();
    res.json(chargers);
  } catch (error) {
    console.error('Error fetching chargers:', error);
    res.status(500).json({ error: 'Failed to fetch chargers' });
  }
});

app.get('/api/mouses', async (req, res) => {
  try {
    const mouses = await getAllMouses();
    res.json(mouses);
  } catch (error) {
    console.error('Error fetching mouses:', error);
    res.status(500).json({ error: 'Failed to fetch mouses' });
  }
});

app.get('/api/smartwatches', async (req, res) => {
  try {
    const smartwatches = await getAllSmartwatches();
    res.json(smartwatches);
  } catch (error) {
    console.error('Error fetching smartwatches:', error);
    res.status(500).json({ error: 'Failed to fetch smartwatches' });
  }
});

app.get('/laptop/:id', async (req, res) => {
  try {
    const laptopId = req.params.id;
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

app.get('/product/:id', async (req, res) => {
  try {
    const phoneId = req.params.id;
    const phone = await getPhoneById(phoneId);
    if (!phone) {
      return res.status(404).render('404', { message: 'Phone not found' });
    }
    res.render('product-details', { phone });
  } catch (error) {
    console.error('Error fetching phone details:', error);
    res.status(500).render('error', { message: 'Failed to load phone details' });
  }
});

app.get('/earphone/:id', async (req, res) => {
  try {
    const earphoneId = req.params.id;
    const earphone = await getEarphonesById(earphoneId);
    if (!earphone) {
      return res.status(404).render('404', { message: 'Earphone not found' });
    }
    res.render('earphones-details', { earphone });
  } catch (error) {
    console.error('Error fetching earphone details:', error);
    res.status(500).render('error', { message: 'Failed to load earphone details' });
  }
});

app.get('/api/earphone/:id', async (req, res) => {
  try {
    const earphoneId = req.params.id;
    const earphone = await getEarphonesById(earphoneId);
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
    const charger = await getChargerById(chargerId);
    if (!charger) {
      return res.status(404).render('404', { message: 'Charger not found' });
    }
    res.render('charger-details', { charger });
  } catch (error) {
    console.error('Error fetching charger details:', error);
    res.status(500).render('error', { message: 'Failed to load charger details' });
  }
});

app.get('/api/charger/:id', async (req, res) => {
  try {
    const chargerId = req.params.id;
    const charger = await getChargerById(chargerId);
    if (!charger) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(charger);
  } catch (error) {
    console.error('Error fetching charger:', error);
    res.status(500).json({ error: 'Failed to fetch charger' });
  }
});

app.get('/mouse/:id', async (req, res) => {
  try {
    const mouseId = req.params.id;
    const mouse = await getMouseById(mouseId);
    if (!mouse) {
      return res.status(404).render('404', { message: 'Product not found' });
    }
    res.render('mouse-details', { mouse });
  } catch (error) {
    console.error('Error fetching mouse details:', error);
    res.status(500).render('error', { message: 'Failed to load mouse details' });
  }
});

app.get('/api/mouse/:id', async (req, res) => {
  try {
    const mouseId = req.params.id;
    const mouse = await getMouseById(mouseId);
    if (!mouse) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(mouse);
  } catch (error) {
    console.error('Error fetching mouse:', error);
    res.status(500).json({ error: 'Failed to fetch mouse' });
  }
});

app.get('/smartwatch/:id', async (req, res) => {
  try {
    const smartwatchId = req.params.id;
    const smartwatch = await getSmartwatchById(smartwatchId);
    if (!smartwatch) {
      return res.status(404).render('404', { message: 'Product not found' });
    }
    res.render('smartwatch-details', { smartwatch });
  } catch (error) {
    console.error('Error fetching smartwatch details:', error);
    res.status(500).render('error', { message: 'Failed to load smartwatch details' });
  }
});

app.get('/api/smartwatch/:id', async (req, res) => {
  try {
    const smartwatchId = req.params.id;
    const smartwatch = await getSmartwatchById(smartwatchId);
    if (!smartwatch) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(smartwatch);
  } catch (error) {
    console.error('Error fetching smartwatch:', error);
    res.status(500).json({ error: 'Failed to fetch smartwatch' });
  }
});

app.get('/sell-phone', (req, res) => {
  res.render('sell-phone');
});

app.get('/supervisor/phone-applications', requireSupervisorAuth, (req, res) => {
  res.render('supervisor/phone-applications');
});

app.get('/customer/phone-applications', requireCustomerAuth, (req, res) => {
  res.render('customer/phone-applications');
});

app.get('/supervisor/verify-listings', requireSupervisorAuth, (req, res) => {
  res.render('supervisor/verify-listings', { supervisor: req.session.user });
});

app.get('/api/supervisor/verify-applications', async (req, res) => {
  try {
    const phoneApps = await getAllPhoneApplications();
    const laptopApps = await getAllLaptopApplications();

    const applications = [
      ...phoneApps.map(app => ({
        type: 'phone',
        id: app.id, 
        brand: app.brand,
        model: app.model,
        status: app.status,
        created_at: app.created_at,
        price: app.price,
      })),
      ...laptopApps.map(app => ({
        type: 'laptop',
        id: app.id, 
        brand: app.brand,
        model: app.model,
        status: app.status,
        created_at: app.created_at,
        price: app.price,
      })),
    ];

    res.json({ success: true, applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

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
      res.json({ success: true, application, type });
  } catch (error) {
      console.error('Error fetching application details:', error);
      res.status(500).json({ success: false, message: 'Error fetching application details' });
  }
});
app.put('/api/supervisor/application/:type/:id/status', requireSupervisorAuth, async (req, res) => {
  try {
    const { type, id } = req.params;
    const { status, rejectionReason, price } = req.body;

    // Validate inputs
    if (!status || !['pending', 'approved', 'rejected', 'processing'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    if (status === 'approved' && (!price || price <= 0)) {
      return res.status(400).json({ success: false, message: 'Valid price is required for approval' });
    }
    if (status === 'rejected' && !rejectionReason) {
      return res.status(400).json({ success: false, message: 'Rejection reason is required for rejected status' });
    }
    if (!['phone', 'laptop'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid application type' });
    }

    // Update application status
    let result;
    if (type === 'phone') {
      result = await updatePhoneApplicationStatus(id, status, rejectionReason, price);
    } else {
      result = await updateLaptopApplicationStatus(id, status, rejectionReason, price);
    }

    if (!result.success) {
      return res.status(404).json({ success: false, message: result.message || 'Application not found' });
    }

    // Log supervisor activity
    const logMessage = `Updated ${type} application #${id} to ${status}${
      status === 'rejected' ? `: ${rejectionReason}` : 
      status === 'approved' ? ` with price ₹${price}` : ''
    }`;
    const logResult = await logSupervisorActivity(req.session.user.userId, logMessage);
    if (!logResult.success) {
      console.error(`Failed to log supervisor activity: ${logResult.message}`);
      // Continue to avoid blocking the response, but log the issue
    }

    res.json({ success: true, message: 'Status updated successfully' });
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
      ...phoneApps
        .filter(app => ['approved', 'added_to_inventory'].includes(app.status))
        .map(app => ({ ...app, type: 'phone' })),
      ...laptopApps
        .filter(app => ['approved', 'added_to_inventory'].includes(app.status))
        .map(app => ({ ...app, type: 'laptop' })),
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

    if (type === 'phone') {
      
      const phoneData = {
        id: Date.now().toString(),
        brand: application.brand,
        model: application.model,
        color: 'N/A',
        image: application.image_path,
        processor: application.processor,
        display: application.size || 'N/A',
        battery: parseInt(application.battery) || 0,
        camera: application.camera,
        os: application.os,
        network: application.network,
        weight: application.weight || 'N/A',
        ram: application.ram,
        rom: application.rom,
        pricing: {
          originalPrice: parseFloat(application.price),
          discount: parseFloat(application.discount)|| 0,
        },
        condition: condition,
      };
      const result = await addPhone(phoneData);
      if (!result.success) {
        return res.status(500).json({ success: false, message: result.message });
      }
      await updatePhoneApplicationStatus(id, 'added_to_inventory');
    } else if (type === 'laptop') {
      const laptopData = {
        id: Date.now().toString(),
        brand: application.brand,
        series: application.model,
        processor: {
          name: application.processor,
          generation: application.generation || 'N/A',
        },
        pricing: {
          originalPrice: parseFloat(application.price),
          discount: parseFloat(discount) || 0,
        },
        memory: {
          ram: application.ram,
          storage: {
            type: 'SSD',
            capacity: application.storage,
          },
        },
        display_size: parseFloat(application.display_size) || 0,
        weight: parseFloat(application.weight) || 0,
        condition: condition,
        os: application.os || 'N/A',
        image: application.image_path,
      };
      console.log("testing");
      console.log(laptopData);
      const result = await addLaptop(laptopData);
      if (!result.success) {
        return res.status(500).json({ success: false, message: result.message });
      }
      await updateLaptopApplicationStatus(id, 'added_to_inventory');
    }

    await logSupervisorActivity(
      req.session.user.userId,
      `Added ${type} #${id} to inventory with price ₹${application.price}, condition ${condition}, and ${discount || 0}% discount`
    );
    res.json({ success: true, message: 'Added to inventory successfully' });
  } catch (error) {
    console.error('Error adding to inventory:', error);
    res.status(500).json({ success: false, message: 'Error adding to inventory' });
  }
});

// app.js
app.get('/buy/:type/:id', requireCustomerAuth, async (req, res) => {
  try {
    const accessoryType = req.params.type.toLowerCase();
    const accessoryId = req.params.id;
    const userId = req.session.user.userId;

    const fetchFunctions = {
      earphone: getEarphonesById,
      charger: getChargerById,
      mouse: getMouseById,
      smartwatch: getSmartwatchById,
      product: getPhoneById,
      laptop: getLaptopById,
    };

    if (!fetchFunctions[accessoryType]) {
      return res.status(400).render('404', { message: 'Invalid accessory type' });
    }
    const fetchFunction = fetchFunctions[accessoryType];
    const accessory = await fetchFunction(accessoryId);
    if (!accessory) {
      return res.status(404).render('404', { message: `${accessoryType} not found` });
    }

    const basePrice = accessory.pricing.originalPrice || accessory.pricing.basePrice;
    const finalPrice = parseFloat(basePrice) - parseFloat(basePrice) * (parseFloat(accessory.pricing.discount) / 100);

    res.render('dummy-payment', {
      price: finalPrice,
      type: accessoryType,
      id: accessoryId,
      accessory: accessory,
      userId: userId,
    });
  } catch (error) {
    console.error(`Error rendering payment page for ${req.params.type}:`, error);
    res.status(500).render('error', { message: 'Failed to load payment page' });
  }
});

app.get('/orders', requireCustomerAuth, async (req, res) => {
  try {
    const userId = req.session.user.userId;
    let order = null;
    let orders = [];

    if (req.query.order) {
      order = JSON.parse(req.query.order);
      order = {
        orderId: order.orderId || order.order_id,
        totalAmount: order.totalAmount || order.total_amount,
        paymentMethod: order.paymentMethod || order.payment_method,
        timestamp: order.timestamp || order.createdAt || new Date(),
        items: order.items || []
      };
    } else if (req.query.orderId) {
      const userOrders = await getOrdersByUserId(userId);
      order = userOrders.find(o => o.orderId === req.query.orderId);
      if (!order) {
        return res.status(404).render('404', { message: 'Order not found' });
      }
    } else {
      orders = await getOrdersByUserId(userId);
    }

    res.render('orders', { order, orders });
  } catch (error) {
    console.error('Error in /orders route:', error);
    res.status(500).render('error', { message: 'Failed to load orders' });
  }
});

app.get('/myorders', requireCustomerAuth, (req, res) => {
  try {
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
  res.render('checkout', { userId });
});

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
    const result = await authenticateAdmin(admin_id, password, security_token);
    if (result.success) {
      req.session.user = {
        adminId: result.admin.admin_id,
        name: result.admin.name,
        role: 'admin',
        loginTime: new Date().toISOString(),
      };
      return res.json({ success: true, name: result.admin.name, redirect: '/admin/home' });
    } else {
      console.log(`Failed admin login attempt: ${admin_id} at ${new Date().toISOString()}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. This attempt has been logged.',
      });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

app.get('/admin/manage-supervisors', requireAdminAuth, (req, res) => {
  res.render('admin/manage-supervisors', { admin: req.session.user });
});

app.get('/api/admin/supervisors', requireAdminAuth, async (req, res) => {
  try {
    const supervisors = await getAllSupervisors();
    res.json({ success: true, supervisors });
  } catch (error) {
    console.error('Error fetching supervisors:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch supervisors' });
  }
});

app.delete('/api/admin/supervisors/:userId', requireAdminAuth, async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await deleteSupervisor(userId);
    if (result.success) {
      res.json({ success: true, message: 'Supervisor deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Supervisor not found' });
    }
  } catch (error) {
    console.error('Error deleting supervisor:', error);
    res.status(500).json({ success: false, message: 'Failed to delete supervisor' });
  }
});

app.post('/api/admin/add-supervisor', requireAdminAuth, async (req, res) => {
  const { firstName, lastName, email, phone, username, password } = req.body;
  const userId = `supervisor_${Date.now()}`;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await Supervisor.create({
      user_id: userId,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      username,
      password: hashedPassword,
      created_at: new Date(),
    });
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
    const admin = await Admin.findOne({ admin_id: req.session.user.adminId })
      .lean()
      .select('admin_id name email');
    if (!admin) {
      return res.status(404).render('error', { message: 'Admin not found' });
    }
    res.render('admin/admin-profile', { admin });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).render('error', { message: 'Failed to load profile' });
  }
});

app.post('/api/orders', requireCustomerAuth, async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const { totalAmount, paymentMethod, items } = req.body;

    // Validate input
    if (!totalAmount || !paymentMethod || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid order data' });
    }

    // Validate each item
    for (const item of items) {
      if (!item.type || !item.id || !item.quantity || !item.amount || !item.accessory) {
        return res.status(400).json({ success: false, message: 'Invalid item data' });
      }
    }

    const result = await createOrder(userId, totalAmount, paymentMethod, items);
    if (!result.success) {
      return res.status(500).json({ success: false, message: result.message });
    }

    return res.status(201).json({ success: true, orderId: result.orderId });
  } catch (error) {
    console.error('Error processing order:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

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

app.get('/api/orders/:orderId', requireCustomerAuth, async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const orderId = req.params.orderId;
    const orders = await getOrdersByUserId(userId);
    const order = orders.find(o => o.orderId === orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error in /api/orders/:orderId:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/admin/statistics', requireAdminAuth, async (req, res) => {
  try {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Helper function to calculate week-over-week trend
    const calculateTrend = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous * 100).toFixed(2);
    };

    // Total Listings
    const [totalListings, prevTotalListings] = await Promise.all([
      Promise.all([
        PhoneApplication.countDocuments(),
        LaptopApplication.countDocuments(),
      ]).then(counts => counts.reduce((sum, count) => sum + count, 0)),
      Promise.all([
        PhoneApplication.countDocuments({ created_at: { $lte: oneWeekAgo } }),
        LaptopApplication.countDocuments({ created_at: { $lte: oneWeekAgo } }),
      ]).then(counts => counts.reduce((sum, count) => sum + count, 0)),
    ]);

    // Approved Listings
    const [approvedListings, prevApprovedListings] = await Promise.all([
      Promise.all([
        PhoneApplication.countDocuments({ status: 'approved' }),
        LaptopApplication.countDocuments({ status: 'approved' }),
      ]).then(counts => counts.reduce((sum, count) => sum + count, 0)),
      Promise.all([
        PhoneApplication.countDocuments({ status: 'approved', created_at: { $lte: oneWeekAgo } }),
        LaptopApplication.countDocuments({ status: 'approved', created_at: { $lte: oneWeekAgo } }),
      ]).then(counts => counts.reduce((sum, count) => sum + count, 0)),
    ]);

    // Total Sales (Inventory Items)
    const [totalSales, prevTotalSales] = await Promise.all([
      Promise.all([
        Phone.countDocuments(),
        Laptop.countDocuments(),
        Charger.countDocuments(),
        Earphone.countDocuments(),
        Mouse.countDocuments(),
        Smartwatch.countDocuments(),
      ]).then(counts => counts.reduce((sum, count) => sum + count, 0)),
      Promise.all([
        Phone.countDocuments({ created_at: { $lte: oneWeekAgo } }),
        Laptop.countDocuments({ created_at: { $lte: oneWeekAgo } }),
        Charger.countDocuments({ created_at: { $lte: oneWeekAgo } }),
        Earphone.countDocuments({ created_at: { $lte: oneWeekAgo } }),
        Mouse.countDocuments({ created_at: { $lte: oneWeekAgo } }),
        Smartwatch.countDocuments({ created_at: { $lte: oneWeekAgo } }),
      ]).then(counts => counts.reduce((sum, count) => sum + count, 0)),
    ]);

    // Total Sales Revenue (From Orders)
    const [orders, prevOrders] = await Promise.all([
      Order.aggregate([
        { $group: { _id: null, total: { $sum: '$total_amount' } } },
      ]),
      Order.aggregate([
        { $match: { created_at: { $lte: oneWeekAgo } } },
        { $group: { _id: null, total: { $sum: '$total_amount' } } },
      ]),
    ]);
    const totalSalesRevenue = orders[0]?.total || 0;
    const prevTotalSalesRevenue = prevOrders[0]?.total || 0;

    // Inventory Revenue Potential
    const [inventoryRevenue, prevInventoryRevenue] = await Promise.all([
      Promise.all([
        PhoneApplication.aggregate([
          { $match: { status: 'approved', price: { $exists: true, $ne: null } } },
          { $group: { _id: null, total: { $sum: '$price' } } },
        ]),
        LaptopApplication.aggregate([
          { $match: { status: 'approved', price: { $exists: true, $ne: null } } },
          { $group: { _id: null, total: { $sum: '$price' } } },
        ]),
      ]).then(results => results.reduce((sum, result) => sum + (result[0]?.total || 0), 0)),
      Promise.all([
        PhoneApplication.aggregate([
          { $match: { status: 'approved', price: { $exists: true, $ne: null }, created_at: { $lte: oneWeekAgo } } },
          { $group: { _id: null, total: { $sum: '$price' } } },
        ]),
        LaptopApplication.aggregate([
          { $match: { status: 'approved', price: { $exists: true, $ne: null }, created_at: { $lte: oneWeekAgo } } },
          { $group: { _id: null, total: { $sum: '$price' } } },
        ]),
      ]).then(results => results.reduce((sum, result) => sum + (result[0]?.total || 0), 0)),
    ]);

    // Sales by Category
    const salesByCategory = await Promise.all([
      Phone.countDocuments(),
      Laptop.countDocuments(),
      Charger.countDocuments(),
      Earphone.countDocuments(),
      Mouse.countDocuments(),
      Smartwatch.countDocuments(),
    ]).then(counts => ({
      phones: counts[0],
      laptops: counts[1],
      chargers: counts[2],
      earphones: counts[3],
      mouses: counts[4],
      smartwatches: counts[5],
    }));

    // Application Status Distribution
    const applicationStatus = {
      phone: await Promise.all([
        PhoneApplication.countDocuments({ status: 'pending' }),
        PhoneApplication.countDocuments({ status: 'approved' }),
        PhoneApplication.countDocuments({ status: 'rejected' }),
        PhoneApplication.countDocuments({ status: 'processing' }),
      ]).then(counts => ({
        pending: counts[0],
        approved: counts[1],
        rejected: counts[2],
        processing: counts[3],
      })),
      laptop: await Promise.all([
        LaptopApplication.countDocuments({ status: 'pending' }),
        LaptopApplication.countDocuments({ status: 'approved' }),
        LaptopApplication.countDocuments({ status: 'rejected' }),
        LaptopApplication.countDocuments({ status: 'processing' }),
      ]).then(counts => ({
        pending: counts[0],
        approved: counts[1],
        rejected: counts[2],
        processing: counts[3],
      })),
    };

    res.json({
      success: true,
      statistics: {
        totalSales,
        totalListings,
        approvedListings,
        totalSalesRevenue,
        totalInventoryRevenuePotential: inventoryRevenue,
        salesByCategory,
        applicationStatus,
        trends: {
          totalSales: calculateTrend(totalSales, prevTotalSales),
          totalListings: calculateTrend(totalListings, prevTotalListings),
          approvedListings: calculateTrend(approvedListings, prevApprovedListings),
          totalSalesRevenue: calculateTrend(totalSalesRevenue, prevTotalSalesRevenue),
          totalInventoryRevenuePotential: calculateTrend(inventoryRevenue, prevInventoryRevenue),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ success: false, message: 'Error fetching statistics' });
  }
});

app.put('/api/admin/profile', requireAdminAuth, async (req, res) => {
  try {
    const adminId = req.session.user.adminId;
    const { name, email } = req.body;

    const errors = {};
    if (!name || name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const result = await updateAdmin(adminId, { name, email });
    if (result.success) {
      req.session.user.name = name;
      return res.json({ success: true, message: 'Profile updated successfully' });
    } else {
      return res.status(500).json({ success: false, message: result.message || 'Error updating profile' });
    }
  } catch (error) {
    console.error('Error updating admin profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Error handling for undefined routes
app.use((req, res) => {
  res.status(404).render('404', { message: 'Page not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).render('error', { message: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});