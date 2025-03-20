// app.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import session from 'express-session';
import bcrypt from 'bcrypt';
import { initializeDatabase, getDb } from './db.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


import { mobileModels } from './public/scripts/buy-mobile-data.js';
import laptopModels from './public/scripts/buy-laptop-data.js';
import { accessoriesData } from './public/scripts/accessories-data.js';  
const app = express();
const port = 3000;

let db;
(async () => {
  try {
    db = await initializeDatabase();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
})();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));


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

// Your existing routes
app.get('/', (req, res) => {
    res.render("homepage");
});

app.get('/sell-phone', (req, res) => {
    res.render("sell_phone");
});

app.get('/sell-laptop', (req, res) => {
    res.render("sell_laptop");
});

app.get('/sell-laptop-models', (req, res) => {
    res.render("sell-laptop-models");
});

app.get('/Accessories', (req, res) => {
    res.render("accessories");
});

app.get('/sell-phone-models', (req, res) => {
    res.render("sellphone-container");
});

app.get('/buy-phone', (req, res) => {
    res.render("buy_phone");
});

app.get('/buy-laptop', (req, res) => {
    res.render("buy_laptop");
});

app.get('/chargers', (req, res) => {
    res.render("chargers");
});

app.get('/earbuds', (req, res) => {
    res.render("earpods");
});

app.get('/mouses', (req, res) => {
    res.render("mouse");
});

app.get('/smartwatches', (req, res) => {
    res.render("smartwatch");
});

app.get('/filter-buy-phone', (req, res) => {
    res.render("filter-buy-phone");
});

app.get('/filter-buy-laptop', (req, res) => {
    res.render("filter-buy-laptop");
});

app.get('/cart', (req, res) => {
    res.render("cart");
});

app.get('/profile', (req, res) => {
    res.render("user-profile");
});
app.get('/orders', (req, res) => {
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


app.post('/api/admin/login', async (req, res) => {
    const { admin_id, password, security_token } = req.body;
    
    try {
        // Get database connection
        const db = await getDb();
        
        // Find admin by admin_id
        const admin = await db.get(
            'SELECT * FROM admins WHERE admin_id = ?',
            [admin_id]
        );
        
        if (!admin) {
            console.log(`Failed admin login attempt: ${admin_id} at ${new Date().toISOString()}`);
            return res.status(401).json({ success: false, message: 'Invalid credentials. This attempt has been logged.' });
        }
        
        // Check password
        const passwordMatch = await bcrypt.compare(password, admin.password);
        
        // Check security token (exact match)
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


app.get('/product/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = mobileModels.find(p => p.id === productId);
    
    if (!product) {
        return res.status(404).render('404', { message: 'Product not found' });
    }
    
    res.render('product-details', { product });
});

app.get('/api/product/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = mobileModels.find(p => p.id === productId);
    
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
});

app.get('/laptop/:id', (req, res) => {
    console.log('Looking for laptop with ID:', req.params.id);
    console.log('laptopModels type:', typeof laptopModels);
    console.log('Is array?', Array.isArray(laptopModels));
    
    const laptopId = req.params.id;
    

    let laptop = laptopModels.find(p => p.id === laptopId);

    if (!laptop) {
        const numericId = parseInt(laptopId);
        laptop = laptopModels.find(p => p.id === numericId);
    }
    
    if (!laptop) {
        return res.status(404).render('404', { message: 'Laptop not found' });
    }
    
    res.render('laptop-details', { laptop });
});

app.get('/api/laptop/:id', (req, res) => {
    const laptopId = req.params.id;
    

    let laptop = laptopModels.find(l => l.id === laptopId);
    

    if (!laptop) {
        const numericId = parseInt(laptopId);
        laptop = laptopModels.find(l => l.id === numericId);
    }
    
    if (!laptop) {
        return res.status(404).json({ error: 'Laptop not found' });
    }
    
    res.json(laptop);
});

app.get('/earphone/:id', (req, res) => {
    const earphoneId = req.params.id;
    const earphone = accessoriesData.earphones.find(e => e.id === earphoneId);
    
    if (!earphone) {
        return res.status(404).render('404', { message: 'Product not found' });
    }
    
    res.render('earphones-details', { earphone });
});


app.get('/api/earphone/:id', (req, res) => {
    const earphoneId = req.params.id;
    const earphone = accessoriesData.earphones.find(p => p.id === earphoneId);
    
    if (!earphone) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(earphone);
});


app.get('/charger/:id', (req, res) => {
    const chargerId = req.params.id;
    const charger = accessoriesData.chargers.find(e => e.id === chargerId);
    
    if (!charger) {
        return res.status(404).render('404', { message: 'Product not found' });
    }
    
    res.render('charger-details', { charger });
});


app.get('/api/charger/:id', (req, res) => {
    const chargerId = req.params.id;
    const charger = accessoriesData.chargers.find(p => p.id === chargerId);
    
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