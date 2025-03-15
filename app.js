// app.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import data using ES modules
import { mobileModels } from './public/scripts/buy-mobile-data.js';
import laptopModels from './public/scripts/buy-laptop-data.js';

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

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

app.get('/login', (req, res) => {
    res.render("login");
});

app.get('/signup', (req, res) => {
    res.render("signup");
});

// New route for product details
app.get('/product/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = mobileModels.find(p => p.id === productId);
    
    if (!product) {
        return res.status(404).render('404', { message: 'Product not found' });
    }
    
    res.render('product-details', { product });
});

//API route to get product details
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

// API endpoint for laptop details
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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});