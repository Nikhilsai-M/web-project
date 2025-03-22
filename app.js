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
  getAllEarphones,
  getEarphonesById,
  createPhoneApplication,
  getAllPhoneApplications,
  getPhoneApplicationsByUserId,
  getPhoneApplicationById,
  updatePhoneApplicationStatus,
  deletePhoneApplication,
} from './db.js';

import {
    createLaptopApplication,
    getAllLaptopApplications,
    getLaptopApplicationsByUserId,
    getLaptopApplicationById,
    updateLaptopApplicationStatus,
    deleteLaptopApplication,
  } from './db.js'; 

// Import only the accessoriesData since laptops and phones are now in the database
import { accessoriesData } from './public/scripts/accessories-data.js';

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
    cb(null, path.join(__dirname, 'public', 'uploads')); // Temporary storage
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append the file extension
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

function requireAdminAuth(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    res.redirect('/admin/login');
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

// Customer signup route
app.post('/api/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

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

    if (!password || password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    // Return errors if validation fails
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // Create new customer using the function from db.js
    const result = await createCustomer(firstName, lastName, email, phone, password);

    if (result.success) {
      // Set session for automatic login (optional)
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
      // Handle database errors or duplicate email
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

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Authenticate customer
    const result = await authenticateCustomer(email, password);

    if (result.success) {
      // Set session
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
      console.log('Request body:', req.body); // Log form data
      console.log('Uploaded file:', req.file); // Log uploaded file
  
      // Upload image to Cloudinary
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'phone-applications',
      });
  
      console.log('Cloudinary upload result:', result); // Log Cloudinary response
  
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
        deviceAge: req.body.device-age,
        switchingOn: req.body.switching-on,
        phoneCalls: req.body.phone-calls,
        camerasWorking: req.body.cameras-working,
        batteryIssues: req.body.battery-issues,
        physicallyDamaged: req.body.physically-damaged,
        soundIssues: req.body.sound-issues,
        location: req.body.location,
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
        'rom',
        'processor',
        'network',
        'deviceAge',
        'switchingOn',
        'phoneCalls',
        'camerasWorking',
        'batteryIssues',
        'physicallyDamaged',
        'soundIssues',
        'location',
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
      console.error('Phone application submission error:', error); // Log the full error
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

  // Route to get all applications (for supervisors)
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
  
  // Route to get a specific application
  app.get('/api/phone-applications/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const application = await getPhoneApplicationById(id);
      
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
      console.error('Error fetching phone application:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching application' 
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
  
      // Fetch laptop applications
      const laptopApplications = await getLaptopApplicationsByUserId(userId);
      // Fetch phone applications
      const phoneApplications = await getPhoneApplicationsByUserId(userId);
  
      // Add a type field to distinguish between laptops and phones
      const listings = [
        ...laptopApplications.map(app => ({ ...app, type: 'laptop' })),
        ...phoneApplications.map(app => ({ ...app, type: 'phone' })),
      ];
  
      res.json({ success: true, listings });
    } catch (error) {
      console.error('Error fetching customer listings:', error);
      res.status(500).json({ success: false, message: 'Error fetching listings' });
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
  

  // Route to get all laptop applications (for supervisors)
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

// Updated route to get phones from database
app.get('/buy-phone', async (req, res) => {
    try {
        const phones = await getAllPhones();
        res.render("buy_phone", { phoneModels: phones });
    } catch (error) {
        console.error('Error fetching phones:', error);
        res.status(500).render('error', { message: 'Failed to load phones' });
    }
});

// Updated route to get laptops from database
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

app.get('/mouses', (req, res) => {
    res.render("mouse");
});

app.get('/smartwatches', (req, res) => {
    res.render("smartwatch");
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

app.get('/orders', requireCustomerAuth, (req, res) => {
    res.render("orders");
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

app.post('/api/supervisor/login', async (req, res) => {
    const { employee_id, password } = req.body;
    
    try {
        const db = await getDb();
        
        const supervisor = await db.get(
            'SELECT * FROM supervisors WHERE employee_id = ?',
            [employee_id]
        );
        
        if (!supervisor) {
            return res.status(401).json({ success: false, message: 'Invalid employee ID or password' });
        }

        const passwordMatch = await bcrypt.compare(password, supervisor.password);
        
        if (passwordMatch) {
            req.session.user = {
                employeeId: supervisor.employee_id,
                name: supervisor.name,
                role: 'supervisor'
            };
            console.log("Login request received: ",req.session.user);
            
            return res.json({ success: true, name: supervisor.name });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid employee ID or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'Server error during login' });
    }
});

app.get('/api/supervisor/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/supervisor/login');
});

// Admin routes
app.get('/admin/login', (req, res) => {
    res.render("admin/admin-login", { error: null });
});

app.get('/admin/home', requireAdminAuth, (req, res) => {
    res.render("admin/home", { user: req.session.user });
});

// Admin laptop management routes

app.post('/api/admin/login', async (req, res) => {
    const { admin_id, password, security_token } = req.body;
    
    try {
        const db = await getDb();
        
        const admin = await db.get(
            'SELECT * FROM admins WHERE admin_id = ?',
            [admin_id]
        );
        
        if (!admin) {
            console.log(`Failed admin login attempt: ${admin_id} at ${new Date().toISOString()}`);
            return res.status(401).json({ success: false, message: 'Invalid credentials. This attempt has been logged.' });
        }
        
        const passwordMatch = await bcrypt.compare(password, admin.password);
        const tokenMatch = (security_token === admin.security_token);
        
        if (passwordMatch && tokenMatch) {
            req.session.user = {
                adminId: admin.admin_id,
                name: admin.name,
                role: 'admin',
                loginTime: new Date().toISOString()
            };
            
            return res.json({ success: true, name: admin.name });
        } else {
            console.log(`Failed admin login attempt: ${admin_id} at ${new Date().toISOString()}`);
            return res.status(401).json({ success: false, message: 'Invalid credentials. This attempt has been logged.' });
        }
    } catch (error) {
        console.error('Admin login error:', error);
        return res.status(500).json({ success: false, message: 'Server error during login' });
    }
});

app.get('/api/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
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
    const charger = await getChargerById();
    
    if (!charger) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(charger);
});

app.get('/mouse/:id', (req, res) => {
    const mouseId = req.params.id;
    const mouse = accessoriesData.mouses.find(e => e.id === mouseId);
    
    if (!mouse) {
        return res.status(404).render('404', { message: 'Product not found' });
    }
    
    res.render('mouse-details', { mouse });
});

app.get('/api/mouse/:id', (req, res) => {
    const mouseId = req.params.id;
    const mouse = accessoriesData.mouses.find(p => p.id === mouseId);
    
    if (!mouse) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(mouse);
});

app.get('/smartwatch/:id', (req, res) => {
    const smartwatchId = req.params.id;
    const smartwatch = accessoriesData.smartwatches.find(e => e.id === smartwatchId);
    
    if (!smartwatch) {
        return res.status(404).render('404', { message: 'Product not found' });
    }
    
    res.render('smartwatch-details', { smartwatch });
});

app.get('/api/smartwatch/:id', (req, res) => {
    const smartwatchId = req.params.id;
    const smartwatch = accessoriesData.smartwatches.find(p => p.id === smartwatchId);
    
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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});