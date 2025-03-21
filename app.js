import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import session from 'express-session';
import bcrypt from 'bcrypt';
import { 
  initializeDatabase, 
  getDb, 
  createCustomer, 
  authenticateCustomer, 
  getAllLaptops, 
  getLaptopById, 
  getAllEarphones,
  getEarphonesById,
  getAllPhones,
  getPhoneById,
  getChargerById,
  getAllChargers,
  
} from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const app = express();
const port = 5000;

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

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

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
                role: 'customer'
            };
            
            return res.status(201).json({ 
                success: true, 
                message: 'Account created successfully',
                userId: result.userId
            });
        } else {
            // Handle database errors or duplicate email
            if (result.message === 'Email already registered') {
                return res.status(409).json({ 
                    success: false, 
                    errors: { email: 'Email is already registered' }
                });
            }
            
            return res.status(500).json({ 
                success: false, 
                message: 'Error creating account'
            });
        }
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
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

// Customer logout route
app.get('/api/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Your existing routes
app.get('/', (req, res) => {
    res.render("homepage");
});

app.get('/sell-phone', (req, res) => {
    res.render("sell-phone");
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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});