// app.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import session from 'express-session'; // You'll need to install this: npm install express-session

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import data using ES modules
import { mobileModels } from './public/scripts/buy-mobile-data.js';
import laptopModels from './public/scripts/buy-laptop-data.js';
import { accessoriesData } from './public/scripts/accessories-data.js';  
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

// Add session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Middleware to make user data available to all views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Middleware for protected supervisor routes
function requireSupervisorAuth(req, res, next) {
    if (req.session.user && req.session.user.role === 'supervisor') {
        next();
    } else {
        res.redirect('/supervisor/login');
    }
}

// Middleware for protected admin routes
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

// User type selection page
app.get('/login', (req, res) => {
    res.render("login-interfaces");
});

// Customer login routes
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

// Supervisor API endpoints
app.post('/api/supervisor/login', (req, res) => {
    const { employee_id, password } = req.body;
    
    // Your test credentials (should be in a database in production)
    const testCredentials = [
        { employeeId: 'sv1', password: 'sv@123', name: 'test1' },
        { employeeId: 'sv2', password: 'sv@456', name: 'test2' },
    ];
    
    const user = testCredentials.find(cred => 
        cred.employeeId === employee_id && cred.password === password
    );
    
    if (user) {
        // Set user in session
        req.session.user = {
            employeeId: user.employeeId,
            name: user.name,
            role: 'supervisor'
        };
        
        return res.json({ success: true, name: user.name });
    } else {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
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

// Admin API endpoints
// Admin API endpoints
app.post('/api/admin/login', (req, res) => {
    const { admin_id, password, security_token } = req.body;
    
    // Admin test credentials
    const adminCredentials = [
        { 
            adminId: 'ADMIN001', 
            password: 'Admin@123', 
            securityToken: 'TOKEN001',
            name: 'admin1'
        },
        { 
            adminId: 'ADMIN002', 
            password: 'Admin@456', 
            securityToken: 'TOKEN002',
            name: 'admin2'
        },
    ];
    
    const admin = adminCredentials.find(cred => 
        cred.adminId === admin_id && 
        cred.password === password && 
        cred.securityToken === security_token
    );
    
    if (admin) {
        req.session.user = {
            adminId: admin.adminId,
            name: admin.name,
            role: 'admin',
            loginTime: new Date().toISOString()
        };
        
        return res.json({ success: true, name: admin.name });
    } else {
        // Log failed login attempt (in a real app)
        console.log(`Failed admin login attempt: ${admin_id} at ${new Date().toISOString()}`);
        
        return res.status(401).json({ success: false, message: 'Invalid credentials. This attempt has been logged.' });
    }
});

app.get('/api/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

// Product routes
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
    
    // Try to find with string comparison first
    let laptop = laptopModels.find(p => p.id === laptopId);
    
    // If not found, try numeric comparison
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
    
    // Try string comparison first
    let laptop = laptopModels.find(l => l.id === laptopId);
    
    // If not found, try numeric comparison
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

//API route to get product details
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

//API route to get product details
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

//API route to get product details
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

//API route to get product details
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