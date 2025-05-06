import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { console } from 'inspector';

export{
  PhoneApplication,
  LaptopApplication,
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
  createOrder
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// MongoDB connection
const connectToMongoDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/Smartexchange_test2');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};
// Mongoose Schemas
const supervisorSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const supervisorActivitySchema = new mongoose.Schema({
  supervisor_id: { type: String, required: true },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const adminSchema = new mongoose.Schema({
  admin_id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  security_token: { type: String, required: true },
  name: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const customerSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postal_code: { type: String, required: true },
    country: { type: String, required: true }
  },
  orders_count: { type: Number, default: 0 },
  items_sold_count: { type: Number, default: 0 },
  password_last_changed: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
});

const laptopSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  brand: { type: String, required: true },
  series: { type: String, required: true },
  processor_name: { type: String, required: true },
  processor_generation: { type: String, required: true },
  base_price: { type: Number, required: true },
  discount: { type: Number },
  ram: { type: String, required: true },
  storage_type: { type: String, required: true },
  storage_capacity: { type: String, required: true },
  display_size: { type: Number, required: true },
  weight: { type: Number, required: true },
  condition: { type: String, required: true },
  os: { type: String, required: true },
  image: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const phoneSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  color: { type: String },
  image: { type: String, required: true },
  processor: { type: String, required: true },
  display: { type: String, required: true },
  battery: { type: Number, required: true },
  camera: { type: String, required: true },
  os: { type: String, required: true },
  network: { type: String, required: true },
  weight: { type: String, required: true },
  ram: { type: String, required: true },
  rom: { type: String, required: true },
  base_price: { type: Number, required: true },
  discount: { type: Number },
  condition: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const phoneApplicationSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  user_id: { type: String },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  ram: { type: String, required: true },
  rom: { type: String, required: true },
  processor: { type: String, required: true },
  network: { type: String, required: true },
  size: { type: String },
  weight: { type: String },
  device_age: { type: String, required: true },
  switching_on: { type: String, required: true },
  phone_calls: { type: String, required: true },
  cameras_working: { type: String, required: true },
  battery_issues: { type: String, required: true },
  physically_damaged: { type: String, required: true },
  sound_issues: { type: String, required: true },
  location: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  battery: { type: String, required: true },
  camera: { type: String, required: true },
  os: { type: String, required: true },
  image_path: { type: String },
  status: { type: String, default: 'pending' },
  rejection_reason: { type: String },
  price: { type: Number },
  created_at: { type: Date, default: Date.now },
});

const laptopApplicationSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  user_id: { type: String },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  ram: { type: String, required: true },
  storage: { type: String, required: true },
  processor: { type: String, required: true },
  generation: { type: String },
  display_size: { type: String },
  weight: { type: String },
  os: { type: String },
  device_age: { type: String },
  battery_issues: { type: String },
  location: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  image_path: { type: String },
  status: { type: String, default: 'pending' },
  rejection_reason: { type: String },
  price: { type: Number },
  created_at: { type: Date, default: Date.now },
});

const earphoneSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  brand: { type: String, required: true },
  original_price: { type: Number, required: true },
  discount: { type: String, required: true },
  design: { type: String, required: true },
  battery_life: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const chargerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  brand: { type: String, required: true },
  wattage: { type: String, required: true },
  type: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  discount: { type: String, required: true },
  outputCurrent: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const mouseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  brand: { type: String, required: true },
  original_price: { type: Number, required: true },
  discount: { type: String, required: true },
  type: { type: String, required: true },
  connectivity: { type: String, required: true },
  resolution: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const smartwatchSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  brand: { type: String, required: true },
  original_price: { type: Number, required: true },
  discount: { type: String, required: true },
  display_size: { type: String, required: true },
  display_type: { type: String, required: true },
  battery_runtime: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const orderSchema = new mongoose.Schema({
  order_id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  total_amount: { type: Number, required: true },
  payment_method: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const orderItemSchema = new mongoose.Schema({
  order_id: { type: String, required: true },
  item_type: { type: String, required: true },
  item_id: { type: String, required: true },
  quantity: { type: Number, required: true },
  amount: { type: Number, required: true },
  accessory: { type: Object, required: true },
});

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

// Create Mongoose Models
const Counter = mongoose.model('Counter', counterSchema);
const Supervisor = mongoose.model('Supervisor', supervisorSchema);
const SupervisorActivity = mongoose.model('SupervisorActivity', supervisorActivitySchema);
const Admin = mongoose.model('Admin', adminSchema);
const Customer = mongoose.model('Customer', customerSchema);
const Laptop = mongoose.model('Laptop', laptopSchema);
const Phone = mongoose.model('Phone', phoneSchema);
const PhoneApplication = mongoose.model('PhoneApplication', phoneApplicationSchema);
const LaptopApplication = mongoose.model('LaptopApplication', laptopApplicationSchema);
const Earphone = mongoose.model('Earphone', earphoneSchema);
const Charger = mongoose.model('Charger', chargerSchema);
const Mouse = mongoose.model('Mouse', mouseSchema);
const Smartwatch = mongoose.model('Smartwatch', smartwatchSchema);
const Order = mongoose.model('Order', orderSchema);
const OrderItem = mongoose.model('OrderItem', orderItemSchema);

// Initialize Database
export async function initializeDatabase() {
  try {
    await connectToMongoDB();

    // Check and insert test supervisors
    const supervisorCount = await Supervisor.countDocuments();
    if (supervisorCount === 0) {
      const password1 = await bcrypt.hash('Supervisor@123', 10);
      await Supervisor.insertMany([
        {
          user_id: 'supervisor_1',
          first_name: 'Nikhil',
          last_name: 'Sai',
          email: 'nikhil.sai@project.com',
          phone: '1234567890',
          username: 'nikhil',
          password: password1,
        },
        // Add more if needed
      ]);
      console.log('Test supervisors added to database');
    }

    // Check and insert test admins
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const adminPassword1 = await bcrypt.hash('Admin@123', 10);
      const adminPassword2 = await bcrypt.hash('Admin@456', 10);
      await Admin.insertMany([
        {
          admin_id: 'ADMIN001',
          password: adminPassword1,
          security_token: 'TOKEN001',
          name: 'admin1',
        }
      ]);
      console.log('Test admins added to database');
    }

    // Check and insert test laptops
    const laptopCount = await Laptop.countDocuments();
    if (laptopCount === 0) {
      await Laptop.create({
        id: 1,
        brand: 'Dell',
        series: 'XPS 13',
        processor_name: 'Intel i7',
        processor_generation: '11th',
        base_price: 120000,
        discount: 10,
        ram: '16GB',
        storage_type: 'SSD',
        storage_capacity: '512GB',
        display_size: 13.4,
        weight: 1.2,
        condition: 'Good',
        os: 'Windows 11',
        image: '/images/buy_laptop/dell-xps13.webp',
      });
      console.log('Test laptops added to database');
    }

    // Check and insert test phone applications
    const phoneAppCount = await PhoneApplication.countDocuments();
    if (phoneAppCount === 0) {
      await PhoneApplication.insertMany([
        {id: await getNextSequence('phone_application_id'),
          user_id: 'user_123',
          brand: 'Samsung',
          model: 'Galaxy S20',
          ram: '8GB',
          rom: '128GB',
          processor: 'Exynos 990',
          network: '4G',
          size: '6.2"',
          weight: '163g',
          device_age: '2 years',
          switching_on: 'Yes',
          phone_calls: 'Yes',
          cameras_working: 'Yes',
          battery_issues: 'No',
          physically_damaged: 'No',
          sound_issues: 'No',
          location: 'New York',
          email: 'test@example.com',
          phone: '1234567890',
          battery: '4000mAh',
          camera: '12MP',
          os: 'Android 11',
          image_path: 'https://example.com/image1.jpg',
          status: 'pending',
          created_at: new Date('2025-03-20T10:00:00Z'),
        },
        {id: await getNextSequence('phone_application_id'),
          user_id: 'user_124',
          brand: 'Apple',
          model: 'iPhone 12',
          ram: '4GB',
          rom: '64GB',
          processor: 'A14 Bionic',
          network: '5G',
          size: '6.1"',
          weight: '164g',
          device_age: '1 year',
          switching_on: 'Yes',
          phone_calls: 'Yes',
          cameras_working: 'Yes',
          battery_issues: 'Yes',
          physically_damaged: 'No',
          sound_issues: 'No',
          location: 'California',
          email: 'test2@example.com',
          phone: '0987654321',
          battery: '2810mAh',
          camera: '12MP',
          os: 'iOS 14',
          image_path: 'https://example.com/image2.jpg',
          status: 'approved',
          created_at: new Date('2025-03-21T12:00:00Z'),
        },
      ]);
      console.log('Test phone applications added to database');
    }

    // Check and insert test laptop applications
    const laptopAppCount = await LaptopApplication.countDocuments();
    if (laptopAppCount === 0) {
      await LaptopApplication.insertMany([
        {id: await getNextSequence('laptop_application_id'),
          user_id: 'user_123',
          brand: 'Dell',
          model: 'XPS 13',
          ram: '16GB',
          storage: '512GB',
          processor: 'Intel i7',
          generation: '11th',
          display_size: '13.4"',
          weight: '1.2kg',
          os: 'Windows 11',
          device_age: '1.5 years',
          battery_issues: 'No',
          location: 'Texas',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1112223333',
          image_path: 'https://example.com/image3.jpg',
          status: 'pending',
          created_at: new Date('2025-03-22T09:00:00Z'),
        },
        {id: await getNextSequence('laptop_application_id'),
          user_id: 'user_124',
          brand: 'Apple',
          model: 'MacBook Air',
          ram: '8GB',
          storage: '256GB',
          processor: 'M1',
          generation: '',
          display_size: '13.3"',
          weight: '1.29kg',
          os: 'macOS',
          device_age: '2 years',
          battery_issues: 'Yes',
          location: 'Florida',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '4445556666',
          image_path: 'https://example.com/image4.jpg',
          status: 'rejected',
          created_at: new Date('2025-03-22T14:00:00Z'),
        },
      ]);
      console.log('Test laptop applications added to database');
    }

    // Check and insert test supervisor activity
    const activityCount = await SupervisorActivity.countDocuments();
    if (activityCount === 0) {
      await SupervisorActivity.insertMany([
        {
          supervisor_id: 'supervisor_1',
          action: 'Updated phone application #1 to approved with price 500',
          timestamp: new Date('2025-03-21T12:30:00Z'),
        },
        {
          supervisor_id: 'supervisor_1',
          action: 'Added phone #12345 to inventory with price ₹500, condition Used, and 10% discount',
          timestamp: new Date('2025-03-21T13:00:00Z'),
        },
        {
          supervisor_id: 'supervisor_1',
          action: 'Updated laptop application #2 to rejected: Damaged screen',
          timestamp: new Date('2025-03-22T14:30:00Z'),
        },
      ]);
      console.log('Test supervisor activity added to database');
    }

    // Check and insert test phones
    const phoneCount = await Phone.countDocuments();
    if (phoneCount === 0) {
      await Phone.insertMany([
        {
          id: 1,
          brand: 'APPLE',
          model: 'iphone 12',
          color: 'Black',
          image: '/images/best_in_value/Apple_iPhone_12webp.webp',
          processor: 'a 20 bionic',
          display: '4.9',
          battery: 1000,
          camera: '8MP + 8Mp',
          os: 'iOS',
          network: '5G',
          weight: '167',
          ram: '4',
          rom: '128',
          base_price: 45000,
          discount: 8,
          condition: 'Good',
        },
        {
          id: 2,
          brand: 'SAMSUNG',
          model: 'Galax S10 lite',
          color: 'Black',
          image: '/images/best_in_value/Samsung_Galaxy_S10_Lite.webp',
          processor: 'snapdragon 6gen',
          display: '5.9',
          battery: 2000,
          camera: '28MP + 28Mp',
          os: 'Android',
          network: '5G',
          weight: '200',
          ram: '4',
          rom: '128',
          base_price: 22800,
          discount: 10,
          condition: 'Good',
        },
        {
          id: 3,
          brand: 'REALME',
          model: '9',
          color: 'gold',
          image: '/images/best_in_value/realme 9.webp',
          processor: 'snapdragon 6gen',
          display: '5.9',
          battery: 2000,
          camera: '28MP + 28Mp',
          os: 'Android',
          network: '5G',
          weight: '200',
          ram: '4',
          rom: '128',
          base_price: 22999,
          discount: 57,
          condition: 'Very Good',
        },
        {
          id: 4,
          brand: 'ONEPLUS',
          model: 'Nord 2',
          color: 'Black',
          image: '/images/best_in_value/OnePlus_Nord_2.webp',
          processor: 'snapdragon 6gen',
          display: '5.9',
          battery: 2000,
          camera: '28MP + 28Mp',
          os: 'Android',
          network: '5G',
          weight: '200',
          ram: '4',
          rom: '128',
          base_price: 27999,
          discount: 50,
          condition: 'Good',
        },
        {
          id: 5,
          brand: 'GOOGLE',
          model: 'Pixel 7',
          color: 'white',
          image: '/images/best_in_value/Google pixel 7.webp',
          processor: 'snapdragon 6gen',
          display: '5.9',
          battery: 2000,
          camera: '28MP + 28Mp',
          os: 'Android',
          network: '5G',
          weight: '200',
          ram: '4',
          rom: '128',
          base_price: 28299,
          discount: 53,
          condition: 'Superb',
        },
      ]);
      console.log('Test phones added to database');
    }

    // Check and insert test mouses
    const mouseCount = await Mouse.countDocuments();
    if (mouseCount === 0) {
      await Mouse.insertMany([
        {
          id: 'logitech_m196_202',
          title: 'Logitech M196 Wireless Optical Mouse with Bluetooth',
          image: 'images/accessories/mouses/Logitech M196.webp',
          brand: 'Logitech',
          original_price: 1125,
          discount: '20%',
          type: 'Wireless',
          connectivity: 'Bluetooth & USB',
          resolution: '4600',
        },
        {
          id: 'logitech_g502_303',
          title: 'Logitech G502 Hero / Hero 25K Sensor, Adj DPI Upto 25600, RGB, 11 Programmable Buttons Wired Optical Gaming Mouse',
          image: 'images/accessories/mouses/Logotech G502 Hero.webp',
          brand: 'Logitech',
          original_price: 5495,
          discount: '25%',
          type: 'Wired',
          connectivity: 'USB',
          resolution: '5600',
        },
        {
          id: 'arctic_fox_breathing_404',
          title: 'Arctic Fox Breathing Lights and DPI Upto 3600 Wired Optical Gaming Mouse',
          image: 'images/accessories/mouses/Arctic Fox Breathing Lights.webp',
          brand: 'Arctic Fox',
          original_price: 599,
          discount: '35%',
          type: 'Wired',
          connectivity: 'USB',
          resolution: '3600',
        },
        {
          id: 'zebronics_jaguar_606',
          title: 'ZEBRONICS Zeb-Jaguar Wireless Optical Mouse',
          image: 'images/accessories/mouses/Zebronics Zeb Jaguar.webp',
          brand: 'ZEBRONICS',
          original_price: 1190,
          discount: '39%',
          type: 'Wireless',
          connectivity: 'USB',
          resolution: '1700',
        },
        {
          id: 'zebronics_rise_707',
          title: 'ZEBRONICS ZEB-RISE Wired Optical Mouse',
          image: 'images/accessories/mouses/Zebronics Zeb Rise.webp',
          brand: 'ZEBRONICS',
          original_price: 699,
          discount: '19%',
          type: 'Wired',
          connectivity: 'USB',
          resolution: '1200',
        },
        {
          id: 'zebronics_blanc_808',
          title: 'ZEBRONICS Zeb-Blanc /Dual Mode,Type C rechargeable built-in battery,upto 1600 DPI Wireless Optical Mouse',
          image: 'images/accessories/mouses/Zebronics Zeb Blanc.webp',
          brand: 'ZEBRONICS',
          original_price: 999,
          discount: '15%',
          type: 'Wireless',
          connectivity: 'Bluetooth & USB',
          resolution: '1600',
        },
        {
          id: 'dell_ms116_909',
          title: 'DELL MS 116-BK Wired Optical Mouse',
          image: 'images/accessories/mouses/Dell MS 116-BK.webp',
          brand: 'DELL',
          original_price: 650,
          discount: '30%',
          type: 'Wired',
          connectivity: 'USB',
          resolution: '1000',
        },
        {
          id: 'hp_m160_1010',
          title: 'HP M160 Wired Optical Gaming Mouse',
          image: 'images/accessories/mouses/HP M160.webp',
          brand: 'HP',
          original_price: 799,
          discount: '40%',
          type: 'Wired',
          connectivity: 'USB',
          resolution: '1000',
        },
        {
          id: 'hp_z3700_1111',
          title: 'HP Z3700 /Slim form with USB receiver,16 month battery life, 1200DPI Wireless Optical Mouse',
          image: 'images/accessories/mouses/HP Z3700.webp',
          brand: 'HP',
          original_price: 1499,
          discount: '30%',
          type: 'Wireless',
          connectivity: 'USB',
          resolution: '1200',
        },
        {
          id: 'logitech_b175_101',
          title: 'Logitech B175 / Optical Tracking, 12-Months Battery Life, Ambidextrous Wireless Optical Mouse',
          image: 'images/accessories/mouses/Logitech B175.webp',
          brand: 'Logitech',
          original_price: 995,
          discount: '49%',
          type: 'Wireless',
          connectivity: 'USB',
          resolution: '3000',
        },
      ]);
      console.log('Test mouses added to database');
    }

    // Check and insert test chargers
    const chargerCount = await Charger.countDocuments();
    if (chargerCount === 0) {
      await Charger.insertMany([
        {
          id: 'chg001',
          title: 'Apple 20W USB-C Power Adapter',
          image: 'images/accessories/chargers/apple_20w.webp',
          brand: 'Apple',
          wattage: '20',
          type: 'USB C',
          originalPrice: 1900,
          discount: '10%',
          outputCurrent: '3A',
        },
        {
          id: 'chg002',
          title: 'Samsung 25W Fast Charger',
          image: 'images/accessories/chargers/samsung_25.webp',
          brand: 'Samsung',
          wattage: '25',
          type: 'USB C',
          originalPrice: 1800,
          discount: '15%',
          outputCurrent: '2.5A',
        },
        {
          id: 'chg003',
          title: 'RoarX 33 W SuperVOOC 6 A Wall Charger for Mobile with Detachable Cable  (White, Cable Included)',
          image: 'images/accessories/chargers/roar_33v.webp',
          brand: 'RoarX',
          wattage: '33',
          type: 'USB C',
          originalPrice: 2999,
          discount: '87%',
          outputCurrent: '6A',
        },
        {
          id: 'chg004',
          title: 'EYNK 44 W Quick Charge 5 A Wall Charger for Mobile with Detachable Cable  (Supported All Flash Charge 2.0 devices, White, Cable Included)',
          image: 'images/accessories/chargers/eynk_44.webp',
          brand: 'EYNK',
          wattage: '44',
          type: 'USB C',
          originalPrice: 2999,
          discount: '71%',
          outputCurrent: '5A',
        },
        {
          id: 'chg005',
          title: 'Pacificdeals 44 W Supercharge 4 A Wall Charger for Mobile with Detachable Cable  (White, Cable Included)',
          image: 'images/accessories/chargers/PACIFIC.webp',
          brand: 'Pacificdeals',
          wattage: '44',
          type: 'USB C',
          originalPrice: 1999,
          discount: '63%',
          outputCurrent: '4A',
        },
        {
          id: 'chg006',
          title: 'SB 80 W SuperVOOC 7.3 A Wall Charger for Mobile with Detachable Cable  (White, Cable Included)',
          image: 'images/accessories/chargers/sb_80.webp',
          brand: 'SB',
          wattage: '80',
          type: 'USB C',
          originalPrice: 2499,
          discount: '86%',
          outputCurrent: '7.3A',
        },
        {
          id: 'chg007',
          title: 'Apple Lightning Cable 2 m MW2R3ZM/A  (Compatible with Mobile, Tablet, White)',
          image: 'images/accessories/chargers/apple_light.webp',
          brand: 'Apple',
          wattage: '20',
          type: 'lightning',
          originalPrice: 2900,
          discount: '0%',
          outputCurrent: '3A',
        },
      ]);
      console.log('Test chargers added to database');
    }

    // Check and insert test smartwatches
    const smartwatchCount = await Smartwatch.countDocuments();
    if (smartwatchCount === 0) {
      await Smartwatch.insertMany([
        {
          id: 'sw1',
          title: 'Apple Watch Series 8, 41mm GPS + Cellular ECG app, Temperature sensor, Crash Detection',
          image: 'images/accessories/smartwatches/Apple Watch Series8.webp',
          brand: 'Apple',
          original_price: 55900,
          discount: '5%',
          display_size: '41',
          display_type: 'Retina Display',
          battery_runtime: '18',
        },
        {
          id: 'sw2',
          title: 'Apple Watch Series 10 GPS 46mm Silver Aluminium with Denim Sport Band',
          image: 'images/accessories/smartwatches/Apple Watch Series10.webp',
          brand: 'Apple',
          original_price: 49900,
          discount: '15%',
          display_size: '46',
          display_type: 'Retina Display',
          battery_runtime: '18',
        },
        {
          id: 'sw3',
          title: 'Apple Watch Series 9 GPS 45mm Aluminium Case with Sport Band - S/M',
          image: 'images/accessories/smartwatches/Apple Watch Series9.webp',
          brand: 'Apple',
          original_price: 59900,
          discount: '18%',
          display_size: '45',
          display_type: 'Retina Display',
          battery_runtime: '18',
        },
        {
          id: 'sw8',
          title: 'Fire-Boltt Ninja Calling Pro Plus 46.5mm (1.83) Display Bluetooth Calling, AI Voice Smartwatch',
          image: 'images/accessories/smartwatches/Fire-Boltt Ninja.webp',
          brand: 'Fire-Boltt',
          original_price: 1999,
          discount: '50%',
          display_size: '46.5',
          display_type: 'HD Display',
          battery_runtime: '5',
        },
        {
          id: 'sw9',
          title: 'Fire-Boltt Hurricane 33.02mm (1.3) Curved Glass Display with BT Calling, 100+ Sports Modes Smartwatch',
          image: 'images/accessories/smartwatches/Fire-Boltt Hurricane.webp',
          brand: 'Fire-Boltt',
          original_price: 8999,
          discount: '86%',
          display_size: '33.02',
          display_type: 'Retina HD Color Display',
          battery_runtime: '15',
        },
        {
          id: 'sw12',
          title: 'Fire-Boltt Blizzard 32.5mm (1.28) Luxury watch with BT Calling, Stainless Steel Body Smartwatch',
          image: 'images/accessories/smartwatches/Fire-Boltt Blizzard.webp',
          brand: 'Fire-Boltt',
          original_price: 19999,
          discount: '93%',
          display_size: '32.5',
          display_type: 'circular 1.28 inch HD display',
          battery_runtime: '7',
        },
        {
          id: 'sw13',
          title: 'Fire-Boltt Gladiator 49.7mm Display, Stainless Steel, Bluetooth Call, 123 sports modes Smartwatch',
          image: 'images/accessories/smartwatches/Fire-Boltt Gladiator.webp',
          brand: 'Fire-Boltt',
          original_price: 9999,
          discount: '87%',
          display_size: '49.7',
          display_type: 'HD display',
          battery_runtime: '15',
        },
        {
          id: 'sw14',
          title: 'Fire-Boltt Clickk 54.1mm (2.12 inch) AMOLED Display, Front Camera, Nano SIM Slot, 1000mAh Smartwatch',
          image: 'images/accessories/smartwatches/Fire-Boltt Clickk.webp',
          brand: 'Fire-Boltt',
          original_price: 24999,
          discount: '84%',
          display_size: '54.1',
          display_type: 'AMOLED display',
          battery_runtime: '5',
        },
        {
          id: 'sw16',
          title: 'boAt Wave Fury with 1.83 HD Display, Bluetooth Calling & Functional Crown Smartwatch',
          image: 'images/accessories/smartwatches/boAt Wave Fury.webp',
          brand: 'boAt',
          original_price: 6999,
          discount: '64%',
          display_size: '48',
          display_type: 'HD display',
          battery_runtime: '7',
        },
        {
          id: 'sw17',
          title: 'boAt Storm Call 3 Plus w/ Turn by Turn Navigation, QR Tray, 4.97cm(1.96) HD Display Smartwatch',
          image: 'images/accessories/smartwatches/boAt Storm.webp',
          brand: 'boAt',
          original_price: 7499,
          discount: '84%',
          display_size: '49',
          display_type: 'HD display',
          battery_runtime: '7',
        },
        {
          id: 'sw18',
          title: 'boAt Lunar Discovery w/ Turn by Turn Navigation, 3.53 cm HD Display & BT Calling Smartwatch',
          image: 'images/accessories/smartwatches/boAt Lunar Discovery.webp',
          brand: 'boAt',
          original_price: 8499,
          discount: '83%',
          display_size: '35.3',
          display_type: 'HD display',
          battery_runtime: '7',
        },
        {
          id: 'sw23',
          title: "Noise Icon 2 1.8 Display with Bluetooth Calling, Women's Edition, AI Voice Assistant Smartwatch",
          image: 'images/accessories/smartwatches/Noise Icon2.webp',
          brand: 'Noise',
          original_price: 5999,
          discount: '80%',
          display_size: '48',
          display_type: 'HD display',
          battery_runtime: '7',
        },
        {
          id: 'sw24',
          title: 'Noise Colorfit Icon 2 1.8 Display with Bluetooth Calling, AI Voice Assistant Smartwatch',
          image: 'images/accessories/smartwatches/Noise Colorfit Icon2.webp',
          brand: 'Noise',
          original_price: 5999,
          discount: '81%',
          display_size: '48',
          display_type: 'HD display',
          battery_runtime: '7',
        },
        {
          id: 'sw25',
          title: 'Noise Loop 1.85 Display with Advanced Bluetooth Calling, 550 Nits Brightness Smartwatch',
          image: 'images/accessories/smartwatches/Noise Loop.webp',
          brand: 'Noise',
          original_price: 6999,
          discount: '85%',
          display_size: '49',
          display_type: 'TFT LCD display',
          battery_runtime: '7',
        },
        {
          id: 'sw31',
          title: 'SAMSUNG Galaxy Fit3 | AMOLED Display & Aluminium Body | Upto 13Day Battery | 5ATM & IP68',
          image: 'images/accessories/smartwatches/Samsung Galaxy Fit3.webp',
          brand: 'Samsung',
          original_price: 9999,
          discount: '65%',
          display_size: '40.64',
          display_type: 'AMOLED display',
          battery_runtime: '13',
        },
        {
          id: 'sw32',
          title: 'SAMSUNG Galaxy Watch FE, 40mm BT, Sapphire Crystal Display, Sleep Coach, Fall Detection',
          image: 'images/accessories/smartwatches/Samsung Galaxy WatchFE.webp',
          brand: 'Samsung',
          original_price: 29999,
          discount: '66%',
          display_size: '40',
          display_type: 'Sapphire Crystal display',
          battery_runtime: '40',
        },
        {
          id: 'sw33',
          title: 'SAMSUNG Watch7 40mm BT',
          image: 'images/accessories/smartwatches/Samsung Watch7.webp',
          brand: 'Samsung',
          original_price: 32999,
          discount: '10%',
          display_size: '40',
          display_type: 'AMOLED display',
          battery_runtime: '20',
        },
        {
          id: 'sw34',
          title: 'SAMSUNG Galaxy Watch6 Bluetooth',
          image: 'images/accessories/smartwatches/Samsung Galaxy Watch6.webp',
          brand: 'Samsung',
          original_price: 36999,
          discount: '56%',
          display_size: '44',
          display_type: 'AMOLED display',
          battery_runtime: '40',
        },
        {
          id: 'sw35',
          title: 'SAMSUNG Galaxy Watch Ultra LTE',
          image: 'images/accessories/smartwatches/Samsung Galaxy Ultra.webp',
          brand: 'Samsung',
          original_price: 69999,
          discount: '14%',
          display_size: '47',
          display_type: 'AMOLED display',
          battery_runtime: '20',
        },
      ]);
      console.log('Test smartwatches added to database');
    }

    // Check and insert test earphones
    const earphoneCount = await Earphone.countDocuments();
    if (earphoneCount === 0) {
      await Earphone.insertMany([
        {
          id: 'boat_airdopes_456',
          title: 'boAt Airdopes 181 Pro w/ 100 HRS Playback, 4 Mics ENx Technology & ASAP Charge Bluetooth  (Frosted Mint, True Wireless)',
          image: 'images/accessories/earphones/boat_airdopes.webp',
          brand: 'Boat',
          original_price: 4990,
          discount: '81%',
          design: 'Earbuds',
          battery_life: '100',
        },
        {
          id: 'boult_y1_789',
          title: 'Boult Y1 with Zen ENC Mic, 50H Battery, Fast Charging, Pro+ Calling, Knurled Design Bluetooth  (Black, True Wireless)',
          image: 'images/accessories/earphones/boult_y1.webp',
          brand: 'Boult',
          original_price: 5499,
          discount: '85%',
          design: 'Earbuds',
          battery_life: '50',
        },
        {
          id: 'oneplus_bullet_404',
          title: 'OnePlus Bullets Wireless Z2 Bluetooth 5.0 in Ear Earphones, Bombastic Bass E310A Bluetooth  (Blue, In the Ear)',
          image: 'images/accessories/earphones/oneplus_bullet.webp',
          brand: 'OnePlus',
          original_price: 2999,
          discount: '10%',
          design: 'behind the neck',
          battery_life: '50',
        },
        {
          id: 'realme_neo_505',
          title: 'realme Buds Air Neo Bluetooth  (White, True Wireless)',
          image: 'images/accessories/earphones/realme_neo.webp',
          brand: 'realme',
          original_price: 3999,
          discount: '25%',
          design: 'Earbuds',
          battery_life: '17',
        },
        {
          id: 'realme_t110_606',
          title: 'realme Buds T110 (RMA2306) with AI ENC for calls, 38 hours of Playback and Deep Bass Bluetooth  (Jazz Blue, True Wireless)',
          image: 'images/accessories/earphones/realme_t110.webp',
          brand: 'realme',
          original_price: 2999,
          discount: '63%',
          design: 'Earbuds',
          battery_life: '38',
        },
        {
          id: 'realme_neckneo_707',
          title: 'realme Buds Wireless 3 Neo with 13.4mm Driver, 32 hrs Playback, Dual Device Connection Bluetooth  (Black, In the Ear)',
          image: 'images/accessories/earphones/realme_neckneo.webp',
          brand: 'realme',
          original_price: 2499,
          discount: '60%',
          design: 'behind the neck',
          battery_life: '32',
        },
        {
          id: 'samsung_sm_808',
          title: 'SAMSUNG SM-R400NZ Bluetooth  (Graphite, True Wireless)',
          image: 'images/accessories/earphones/samsung_sm.webp',
          brand: 'SAMSUNG',
          original_price: 12999,
          discount: '52%',
          design: 'Earbuds',
          battery_life: '43',
        },
        {
          id: 'noise_vs_222',
          title: 'Noise Buds VS102 Plus with 70 Hrs Playtime, Environmental Noise Cancellation, Quad Mic Bluetooth  (Deep Wine, True Wireless)',
          image: 'images/accessories/earphones/noise_vs.webp',
          brand: 'Noise',
          original_price: 3999,
          discount: '75%',
          design: 'Earbuds',
          battery_life: '70',
        },
        {
          id: 'noise_airwave_333',
          title: 'Noise Airwave Pro with ANC, 60 Hrs of Playtime, Low latency(Up to 40ms), 3 EQ Modes Bluetooth  (Metallic Blue, In the Ear)',
          image: 'images/accessories/earphones/noise_airwave.webp',
          brand: 'Noise',
          original_price: 3999,
          discount: '62%',
          design: 'behind the neck',
          battery_life: '60',
        },
        {
          id: 'portronics_s16_444',
          title: 'Portronics Twins S16 in Ear Earbuds Bluetooth  (Green, In the Ear)',
          image: 'images/accessories/earphones/portronics_s16.webp',
          brand: 'Portronics',
          original_price: 1999,
          discount: '62%',
          design: 'Earbuds',
          battery_life: '24',
        },
        {
          id: 'portronics_s5_555',
          title: 'Portronics Harmonics Twins S5 Smart TWS Earbuds,15Hrs Playtime, LED Display, Game Mode,5.2v Bluetooth  (Black, In the Ear)',
          image: 'images/accessories/earphones/portronics_s5.webp',
          brand: 'Portronics',
          original_price: 2999,
          discount: '82%',
          design: 'Earbuds',
          battery_life: '15',
        },
        {
          id: 'jbl_beam_888',
          title: 'JBL Wave Beam TWS, 32Hr Playtime, IP54, Smart Ambient & TalkThru Mode, JBL App Bluetooth  (Beige, In the Ear)',
          image: 'images/accessories/earphones/jbl_beam.webp',
          brand: 'JBL',
          original_price: 4999,
          discount: '50%',
          design: 'Earbuds',
          battery_life: '32',
        },
        {
          id: 'jbl_125bt_999',
          title: 'JBL Tune 125BT Flex Neckband with 16 Hour Playtime, Quick Charge, Multipoint Connect Bluetooth  (Grey, In the Ear)',
          image: 'images/accessories/earphones/jbl_125bt.webp',
          brand: 'JBL',
          original_price: 2999,
          discount: '33%',
          design: 'behind the neck',
          battery_life: '16',
        },
      ]);
      console.log('Test earphones added to database');
    }

    return mongoose.connection;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Function to get the database connection
export async function getDb() {
  if (mongoose.connection.readyState === 0) {
    await initializeDatabase();
  }
  return mongoose.connection;
}

// Supervisor Authentication
export async function authenticateSupervisor(username, password) {
  try {
    console.log(`Attempting to authenticate supervisor with username: ${username}`);
    const supervisor = await Supervisor.findOne({ username }).lean();
    
    if (!supervisor) {
      console.log(`No supervisor found with username: ${username}`);
      return { success: false, message: 'Invalid username or password' };
    }
    
    console.log(`Supervisor found: ${JSON.stringify(supervisor)}`);
    const passwordMatch = await bcrypt.compare(password, supervisor.password);
    
    if (!passwordMatch) {
      console.log(`Password does not match for username: ${username}`);
      return { success: false, message: 'Invalid username or password' };
    }
    
    console.log(`Authentication successful for username: ${username}`);
    const { password: _, ...supervisorData } = supervisor;
    return { success: true, supervisor: supervisorData };
  } catch (error) {
    console.error('Supervisor authentication error:', error);
    return { success: false, message: 'Authentication error' };
  }
}

// Supervisor Profile Updating
export async function updateSupervisorProfile(userId, updates) {
  try {
    const { first_name, last_name, email, phone, username } = updates;
    
    // Check if email or username already exists for another supervisor
    const emailCheck = await Supervisor.findOne({ email, user_id: { $ne: userId } });
    if (emailCheck) {
      return { success: false, message: 'Email already in use by another supervisor' };
    }

    const usernameCheck = await Supervisor.findOne({ username, user_id: { $ne: userId } });
    if (usernameCheck) {
      return { success: false, message: 'Username already in use by another supervisor' };
    }

    await Supervisor.updateOne(
      { user_id: userId },
      { $set: { first_name, last_name, email, phone, username } }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error updating supervisor profile:', error);
    return { success: false, message: error.message };
  }
}

// Supervisor Password Update
export async function updateSupervisorPassword(userId, newPassword) {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await Supervisor.updateOne(
      { user_id: userId },
      { $set: { password: hashedPassword } }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error updating supervisor password:', error);
    return { success: false, message: error.message };
  }
}

// Laptop Data Functions
export async function getAllLaptops() {
  try {
    const laptops = await Laptop.find().lean();
    
    return laptops.map(laptop => ({
      id: laptop.id,
      brand: laptop.brand,
      series: laptop.series,
      processor: {
        name: laptop.processor_name,
        generation: laptop.processor_generation,
      },
      pricing: {
        basePrice: laptop.base_price,
        discount: laptop.discount,
      },
      memory: {
        ram: laptop.ram,
        storage: {
          type: laptop.storage_type,
          capacity: laptop.storage_capacity,
        },
      },
      displaysize: laptop.display_size,
      weight: laptop.weight,
      condition: laptop.condition,
      os: laptop.os,
      image: laptop.image,
    }));
  } catch (error) {
    console.error('Error getting laptops:', error);
    throw error;
  }
}

export async function getLaptopById(id) {
  try {
    const laptop = await Laptop.findOne({ id }).lean();
    
    if (!laptop) {
      return null;
    }
    
    return {
      id: laptop.id,
      brand: laptop.brand,
      series: laptop.series,
      processor: {
        name: laptop.processor_name,
        generation: laptop.processor_generation,
      },
      pricing: {
        basePrice: laptop.base_price,
        discount: laptop.discount,
      },
      memory: {
        ram: laptop.ram,
        storage: {
          type: laptop.storage_type,
          capacity: laptop.storage_capacity,
        },
      },
      displaysize: laptop.display_size,
      weight: laptop.weight,
      condition: laptop.condition,
      os: laptop.os,
      image: laptop.image,
    };
  } catch (error) {
    console.error('Error getting laptop by id:', error);
    throw error;
  }
}

export async function addLaptop(laptopData) {
  try {
    let Base_Price = (laptopData.pricing.originalPrice * 1.2) / (1 - laptopData.pricing.discount / 100);

    await Laptop.create({
      id: laptopData.id,
      brand: laptopData.brand,
      series: laptopData.series,
      processor_name: laptopData.processor.name,
      processor_generation: laptopData.processor.generation,
      base_price: Base_Price.toFixed(0),
      discount: laptopData.pricing.discount,
      ram: laptopData.memory.ram,
      storage_type: laptopData.memory.storage.type,
      storage_capacity: laptopData.memory.storage.capacity,
      display_size: laptopData.display_size,
      weight: laptopData.weight,
      condition: laptopData.condition,
      os: laptopData.os,
      image: laptopData.image,
    });
    console.log('Laptop added');
    return { success: true, id: laptopData.id };
  } catch (error) {
    console.error('Error adding laptop:', error);
    return { success: false, message: error.message };
  }
}

export async function updateLaptop(id, laptopData) {
  try {
    await Laptop.updateOne(
      { id },
      {
        $set: {
          brand: laptopData.brand,
          series: laptopData.series,
          processor_name: laptopData.processor.name,
          processor_generation: laptopData.processor.generation,
          base_price: laptopData.pricing.basePrice,
          discount: laptopData.pricing.discount,
          ram: laptopData.memory.ram,
          storage_type: laptopData.memory.storage.type,
          storage_capacity: laptopData.memory.storage.capacity,
          display_size: laptopData.displaysize,
          weight: laptopData.weight,
          condition: laptopData.condition,
          os: laptopData.os,
          image: laptopData.image,
        },
      }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error updating laptop:', error);
    return { success: false, message: error.message };
  }
}

export async function deleteLaptop(id) {
  try {
    const result = await Laptop.deleteOne({ id });
    return { success: result.deletedCount > 0 };
  } catch (error) {
    console.error('Error deleting laptop:', error);
    return { success: false, message: error.message };
  }
}

// Phone Data Functions
export async function getAllPhones() {
  try {
    const phones = await Phone.find().lean();
    
    return phones.map(phone => ({
      id: phone.id,
      brand: phone.brand,
      model: phone.model,
      color: phone.color,
      image: phone.image,
      specs: {
        processor: phone.processor,
        display: phone.display,
        battery: phone.battery,
        camera: phone.camera,
        os: phone.os,
        network: phone.network,
        weight: phone.weight,
      },
      ram: phone.ram,
      rom: phone.rom,
      pricing: {
        basePrice: phone.base_price,
        discount: phone.discount,
      },
      condition: phone.condition,
    }));
  } catch (error) {
    console.error('Error getting phones:', error);
    throw error;
  }
}

export async function getPhoneById(id) {
  try {
    const phone = await Phone.findOne({ id }).lean();
    
    if (!phone) {
      return null;
    }
    
    return {
      id: phone.id,
      brand: phone.brand,
      model: phone.model,
      color: phone.color,
      image: phone.image,
      specs: {
        processor: phone.processor,
        display: phone.display,
        battery: phone.battery,
        camera: phone.camera,
        os: phone.os,
        network: phone.network,
        weight: phone.weight,
      },
      ram: phone.ram,
      rom: phone.rom,
      pricing: {
        basePrice: phone.base_price,
        discount: phone.discount,
      },
      condition: phone.condition,
    };
  } catch (error) {
    console.error('Error getting phone by id:', error);
    throw error;
  }
}

export async function addPhone(phoneData) {
  try {
    let Base_Price = (phoneData.pricing.originalPrice * 1.2) / (1 - phoneData.pricing.discount / 100);
    await Phone.create({
      id: phoneData.id,
      brand: phoneData.brand,
      model: phoneData.model,
      color: phoneData.color,
      image: phoneData.image,
      processor: phoneData.processor,
      display: phoneData.display,
      battery: phoneData.battery,
      camera: phoneData.camera,
      os: phoneData.os,
      network: phoneData.network,
      weight: phoneData.weight,
      ram: phoneData.ram,
      rom: phoneData.rom,
      base_price: Base_Price,
      discount: phoneData.pricing.discount,
      condition: phoneData.condition,
    });
    return { success: true, id: phoneData.id };
  } catch (error) {
    console.error('Error adding phone:', error);
    return { success: false, message: error.message };
  }
}

export async function updatePhone(id, phoneData) {
  try {
    await Phone.updateOne(
      { id },
      {
        $set: {
          brand: phoneData.brand,
          model: phoneData.model,
          color: phoneData.color,
          image: phoneData.image,
          processor: phoneData.processor,
          display: phoneData.display,
          battery: phoneData.battery,
          camera: phoneData.camera,
          os: phoneData.os,
          network: phoneData.network,
          weight: phoneData.weight,
          ram: phoneData.ram,
          rom: phoneData.rom,
          base_price: phoneData.pricing.basePrice,
          discount: phoneData.pricing.discount,
          condition: phoneData.condition,
        },
      }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error updating phone:', error);
    return { success: false, message: error.message };
  }
}

export async function deletePhone(id) {
  try {
    const result = await Phone.deleteOne({ id });
    return { success: result.deletedCount > 0 };
  } catch (error) {
    console.error('Error deleting phone:', error);
    return { success: false, message: error.message };
  }
}

// Customer Authentication Functions
export async function createCustomer(firstName, lastName, email, phone, address, password) {
  try {
    // Check if user already exists
    const existingUser = await Customer.findOne({ email });
    if (existingUser) {
      return { success: false, message: 'Email already registered' };
    }
    
    const userId = 'user_' + Date.now();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await Customer.create({
      user_id: userId,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      address: {
        street: address.street,
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        country: address.country
      },
      password: hashedPassword,
      orders_count: 0,
      items_sold_count: 0,
      password_last_changed: new Date(),
      created_at: new Date()
    });
    
    return { success: true, userId };
  } catch (error) {
    console.error('Error creating customer:', error);
    if (error.name === 'ValidationError') {
      const errors = {};
      for (const field in error.errors) {
        // Map nested address fields (e.g., 'address.street' to 'street')
        const fieldName = field.startsWith('address.') ? field.split('.')[1] : field;
        errors[fieldName] = error.errors[field].message;
      }
      return { success: false, message: 'Validation failed', errors };
    }
    return { success: false, message: 'Database error' };
  }
}

export async function authenticateCustomer(email, password) {
  try {
    const user = await Customer.findOne({ email }).lean();
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return { success: false, message: 'Invalid password' };
    }
    
    const { password: _, ...userData } = user;
    return { success: true, user: userData };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, message: 'Authentication error' };
  }
}
async function getNextSequence(name) {
  const counter = await Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

export async function createPhoneApplication(applicationData) {
  try {
    const id = await getNextSequence('phone_application_id');
    const application = await PhoneApplication.create({
      id,
      user_id: applicationData.user_id || null,
      brand: applicationData.brand,
      model: applicationData.model,
      ram: applicationData.ram,
      rom: applicationData.rom,
      processor: applicationData.processor,
      network: applicationData.network,
      size: applicationData.size || '',
      weight: applicationData.weight || '',
      device_age: applicationData.device_age,
      switching_on: applicationData.switching_on,
      phone_calls: applicationData.phone_calls,
      cameras_working: applicationData.cameras_working,
      battery_issues: applicationData.battery_issues,
      physically_damaged: applicationData.physically_damaged,
      sound_issues: applicationData.sound_issues,
      location: applicationData.location,
      email: applicationData.email,
      phone: applicationData.phone,
      battery: applicationData.battery,
      camera: applicationData.camera,
      os: applicationData.os,
      image_path: applicationData.imagepath || '',
    });

    return { success: true, id: application._id };
  } catch (error) {
    console.error('Error creating phone application:', error);
    return { success: false, message: error.message };
  }
}

export async function getAllPhoneApplications() {
  try {
    const applications = await PhoneApplication.find().sort({ created_at: -1 }).lean();
    // console.log()
    return applications;
  } catch (error) {
    console.error('Error getting phone applications:', error);
    throw error;
  }
}

export async function getPhoneApplicationsByUserId(userId) {
  try {
    const applications = await PhoneApplication.find({ user_id: userId })
      .sort({ created_at: -1 })
      .lean();
    console.log(`Fetched ${applications.length} phone applications for user ${userId}`);
    return applications;
  } catch (error) {
    console.error('Error getting user phone applications:', error.message, error.stack);
    throw error;
  }
}



export async function deletePhoneApplication(id) {
  try {
    const result = await PhoneApplication.deleteOne({ _id: id });
    return { success: result.deletedCount > 0 };
  } catch (error) {
    console.error('Error deleting phone application:', error);
    return { success: false, message: error.message };
  }
}

export async function createLaptopApplication(applicationData) {
  try {
    const id = await getNextSequence('laptop_application_id');
    const application = await LaptopApplication.create({
      id,
      user_id: applicationData.user_id || null,
      brand: applicationData.brand,
      model: applicationData.model,
      ram: applicationData.ram,
      storage: applicationData.storage,
      processor: applicationData.processor,
      generation: applicationData.generation || '',
      display_size: applicationData.display_size || '',
      weight: applicationData.weight || '',
      os: applicationData.os || '',
      device_age: applicationData.device_age || '',
      battery_issues: applicationData.battery_issues || '',
      location: applicationData.location,
      name: applicationData.name,
      email: applicationData.email,
      phone: applicationData.phone,
      image_path: applicationData.image_path || '',
    });

    return { success: true, id: application._id };
  } catch (error) {
    console.error('Error creating laptop application:', error);
    return { success: false, message: error.message };
  }
}

export async function getAllLaptopApplications() {
  try {
    const applications = await LaptopApplication.find().sort({ created_at: -1 }).lean();
    return applications;
  } catch (error) {
    console.error('Error getting laptop applications:', error);
    throw error;
  }
}

export async function getLaptopApplicationsByUserId(userId) {
  try {
    const applications = await LaptopApplication.find({ user_id: userId })
      .sort({ created_at: -1 })
      .lean();
    console.log(`Fetched ${applications.length} laptop applications for user ${userId}`);
    return applications;
  } catch (error) {
    console.error('Error getting user laptop applications:', error.message, error.stack);
    throw error;
  }
}

export async function getPhoneApplicationById(id) {
  try {
    const numericId = parseInt(id); // Convert to number
    const application = await PhoneApplication.findOne({ id: numericId }).lean();
    return application;
  } catch (error) {
    console.error('Error getting phone application by id:', error);
    throw error;
  }
}

export async function getLaptopApplicationById(id) {
  try {
    const numericId = parseInt(id); // Convert to number
    const application = await LaptopApplication.findOne({ id: numericId }).lean();
    return application;
  } catch (error) {
    console.error('Error getting laptop application by id:', error);
    throw error;
  }
}

export async function updatePhoneApplicationStatus(id, status, rejectionReason = null, price = null) {
  try {
    const numericId = parseInt(id);
    const result = await PhoneApplication.updateOne(
      { id: numericId },
      { $set: { status, rejection_reason: rejectionReason, price } }
    );
    console.log(`Updated phone application #${numericId} with price: ${price}`);
    return result.modifiedCount > 0
      ? { success: true }
      : { success: false, message: 'Application not found' };
  } catch (error) {
    console.error('Error updating phone application status:', error);
    return { success: false, message: 'Database error' };
  }
}

export async function updateLaptopApplicationStatus(id, status, rejectionReason = null, price = null) {
  try {
    const numericId = parseInt(id);
    const result = await LaptopApplication.updateOne(
      { id: numericId },
      { $set: { status, rejection_reason: rejectionReason, price } }
    );
    console.log(`Updated laptop application #${numericId} with price: ${price}`);
    return result.modifiedCount > 0
      ? { success: true }
      : { success: false, message: 'Application not found' };
  } catch (error) {
    console.error('Error updating laptop application status:', error);
    return { success: false, message: 'Database error' };
  }
}

export async function deleteLaptopApplication(id) {
  try {
    const result = await LaptopApplication.deleteOne({ _id: id });
    return { success: result.deletedCount > 0 };
  } catch (error) {
    console.error('Error deleting laptop application:', error);
    return { success: false, message: error.message };
  }
}

export async function updateCustomer(userId, updates) {
  try {
      const { first_name, last_name, email, phone, address } = updates;

      await Customer.updateOne(
          { user_id: userId },
          {
              $set: {
                  first_name,
                  last_name,
                  email,
                  phone,
                  'address.street': address.street,
                  'address.city': address.city,
                  'address.state': address.state,
                  'address.postal_code': address.postal_code,
                  'address.country': address.country,
              },
          }
      );

      return { success: true };
  } catch (error) {
      console.error('Error updating customer:', error);
      return { success: false, message: error.message };
  }
}
export async function updateCustomerPassword(userId, newPassword) {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await Customer.updateOne(
      { user_id: userId },
      { $set: { password: hashedPassword, password_last_changed: new Date() } }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error updating customer password:', error);
    return { success: false, message: error.message };
  }
}

// Earphone Functions
export async function getAllEarphones() {
  try {
    const earphones = await Earphone.find().lean();
    
    return earphones.map(earphone => ({
      id: earphone.id,
      title: earphone.title,
      image: earphone.image,
      brand: earphone.brand,
      originalPrice: earphone.original_price,
      discount: earphone.discount,
      design: earphone.design,
      batteryLife: earphone.battery_life,
    }));
  } catch (error) {
    console.error('Error getting earphones:', error);
    throw error;
  }
}

export async function getEarphonesById(id) {
  try {
    const earphone = await Earphone.findOne({ id }).lean();
    
    if (!earphone) {
      return null;
    }
    
    return {
      id: earphone.id,
      title: earphone.title,
      image: earphone.image,
      brand: earphone.brand,
      pricing: {
        originalPrice: Number(earphone.original_price),
        discount: earphone.discount,
      },
      design: earphone.design,
      batteryLife: earphone.battery_life,
    };
  } catch (error) {
    console.error('Error getting earphones by ID:', error);
    throw error;
  }
}

export async function addEarphones(earphonesData) {
  try {
    const { id, title, image, brand, pricing, design, battery_life } = earphonesData;
    
    await Earphone.create({
      id,
      title,
      image,
      brand,
      original_price: pricing.originalPrice,
      discount: pricing.discount,
      design,
      battery_life: battery_life,
    });
    
    return { success: true, id };
  } catch (error) {
    console.error('Error adding earphones:', error);
    return { success: false, message: error.message };
  }
}

export async function updateEarphones(id, earphonesData) {
  try {
    const { title, image, brand, pricing, design, battery_life } = earphonesData;
    
    await Earphone.updateOne(
      { id },
      {
        $set: {
          title,
          image,
          brand,
          original_price: pricing.originalPrice,
          discount: pricing.discount,
          design,
          battery_life,
        },
      }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error updating earphones:', error);
    return { success: false, message: error.message };
  }
}

export async function deleteEarphones(id) {
  try {
    const result = await Earphone.deleteOne({ id });
    return { success: result.deletedCount > 0 };
  } catch (error) {
    console.error('Error deleting earphones:', error);
    return { success: false, message: error.message };
  }
}

// Charger Functions
export async function getAllChargers() {
  try {
    const chargers = await Charger.find().lean();
    
    return chargers.map(charger => ({
      id: charger.id,
      title: charger.title,
      image: charger.image,
      brand: charger.brand,
      wattage: charger.wattage,
      type: charger.type,
      originalPrice: charger.originalPrice,
      discount: charger.discount,
      outputCurrent: charger.outputCurrent,
    }));
  } catch (error) {
    console.error('Error getting chargers:', error);
    throw error;
  }
}

export async function getChargerById(id) {
  try {
    const charger = await Charger.findOne({ id }).lean();
    
    if (!charger) {
      return null;
    }
    
    return {
      id: charger.id,
      title: charger.title,
      image: charger.image,
      brand: charger.brand,
      wattage: charger.wattage,
      type: charger.type,
      pricing: {
        originalPrice: Number(charger.originalPrice),
        discount: charger.discount,
      },
      outputCurrent: charger.outputCurrent,
    };
  } catch (error) {
    console.error('Error getting charger by ID:', error);
    throw error;
  }
}

export async function addCharger(chargerData) {
  try {
    const { id, title, image, brand, wattage, type, pricing, outputCurrent } = chargerData;
    
    await Charger.create({
      id,
      title,
      image,
      brand,
      wattage,
      type,
      originalPrice: pricing.originalPrice,
      discount: pricing.discount,
      outputCurrent,
    });
    
    return { success: true, id };
  } catch (error) {
    console.error('Error adding charger:', error);
    return { success: false, message: error.message };
  }
}

export async function updateCharger(id, chargerData) {
  try {
    const { title, image, brand, wattage, type, pricing, outputCurrent } = chargerData;
    
    await Charger.updateOne(
      { id },
      {
        $set: {
          title,
          image,
          brand,
          wattage,
          type,
          originalPrice: pricing.originalPrice,
          discount: pricing.discount,
          outputCurrent,
        },
      }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error updating charger:', error);
    return { success: false, message: error.message };
  }
}

export async function deleteCharger(id) {
  try {
    const result = await Charger.deleteOne({ id });
    return { success: result.deletedCount > 0 };
  } catch (error) {
    console.error('Error deleting charger:', error);
    return { success: false, message: error.message };
  }
}

// Mouse Functions
export async function getAllMouses() {
  try {
    const mouses = await Mouse.find().lean();
    
    return mouses.map(mouse => ({
      id: mouse.id,
      title: mouse.title,
      image: mouse.image,
      brand: mouse.brand,
      originalPrice: mouse.original_price,
      discount: mouse.discount,
      type: mouse.type,
      connectivity: mouse.connectivity,
      resolution: mouse.resolution,
    }));
  } catch (error) {
    console.error('Error getting mouses:', error);
    throw error;
  }
}

export async function getMouseById(id) {
  try {
    const mouse = await Mouse.findOne({ id }).lean();
    
    if (!mouse) {
      return null;
    }
    
    return {
      id: mouse.id,
      title: mouse.title,
      image: mouse.image,
      brand: mouse.brand,
      pricing: {
        originalPrice: Number(mouse.original_price),
        discount: mouse.discount,
      },
      type: mouse.type,
      connectivity: mouse.connectivity,
      resolution: mouse.resolution,
    };
  } catch (error) {
    console.error('Error getting mouse by ID:', error);
    throw error;
  }
}

export async function addMouse(mouseData) {
  try {
    const { id, title, image, brand, pricing, type, connectivity, resolution } = mouseData;
    
    await Mouse.create({
      id,
      title,
      image,
      brand,
      original_price: pricing.originalPrice,
      discount: pricing.discount,
      type,
      connectivity,
      resolution,
    });
    
    return { success: true, id };
  } catch (error) {
    console.error('Error adding mouse:', error);
    return { success: false, message: error.message };
  }
}

export async function updateMouse(id, mouseData) {
  try {
    const { title, image, brand, pricing, type, connectivity, resolution } = mouseData;
    
    await Mouse.updateOne(
      { id },
      {
        $set: {
          title,
          image,
          brand,
          original_price: pricing.originalPrice,
          discount: pricing.discount,
          type,
          connectivity,
          resolution,
        },
      }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error updating mouse:', error);
    return { success: false, message: error.message };
  }
}

export async function deleteMouse(id) {
  try {
    const result = await Mouse.deleteOne({ id });
    return { success: result.deletedCount > 0 };
  } catch (error) {
    console.error('Error deleting mouse:', error);
    return { success: false, message: error.message };
  }
}

// Smartwatch Functions
export async function getAllSmartwatches() {
  try {
    const smartwatches = await Smartwatch.find().lean();
    
    return smartwatches.map(smartwatch => ({
      id: smartwatch.id,
      title: smartwatch.title,
      image: smartwatch.image,
      brand: smartwatch.brand,
      originalPrice: smartwatch.original_price,
      discount: smartwatch.discount,
      display_size: smartwatch.display_size,
      display_type: smartwatch.display_type,
      battery_runtime: smartwatch.battery_runtime,
    }));
  } catch (error) {
    console.error('Error getting smartwatches:', error);
    throw error;
  }
}

export async function getSmartwatchById(id) {
  try {
    const smartwatch = await Smartwatch.findOne({ id }).lean();
    
    if (!smartwatch) {
      return null;
    }
    
    return {
      id: smartwatch.id,
      title: smartwatch.title,
      image: smartwatch.image,
      brand: smartwatch.brand,
      pricing: {
        originalPrice: Number(smartwatch.original_price),
        discount: smartwatch.discount,
      },
      display_size: smartwatch.display_size,
      display_type: smartwatch.display_type,
      battery_runtime: smartwatch.battery_runtime,
    };
  } catch (error) {
    console.error('Error getting smartwatch by ID:', error);
    throw error;
  }
}

export async function addSmartwatch(smartwatchData) {
  try {
    const { id, title, image, brand, pricing, display_size, display_type, battery_runtime } = smartwatchData;
    
    await Smartwatch.create({
      id,
      title,
      image,
      brand,
      original_price: pricing.originalPrice,
      discount: pricing.discount,
      display_size,
      display_type,
      battery_runtime,
    });
    
    return { success: true, id };
  } catch (error) {
    console.error('Error adding smartwatch:', error);
    return { success: false, message: error.message };
  }
}

export async function updateSmartwatch(id, smartwatchData) {
  try {
    const { title, image, brand, pricing, display_size, display_type, battery_runtime } = smartwatchData;
    
    await Smartwatch.updateOne(
      { id },
      {
        $set: {
          title,
          image,
          brand,
          original_price: pricing.originalPrice,
          discount: pricing.discount,
          display_size,
          display_type,
          battery_runtime,
        },
      }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error updating smartwatch:', error);
    return { success: false, message: error.message };
  }
}

export async function deleteSmartwatch(id) {
  try {
    const result = await Smartwatch.deleteOne({ id });
    return { success: result.deletedCount > 0 };
  } catch (error) {
    console.error('Error deleting smartwatch:', error);
    return { success: false, message: error.message };
  }
}

// db.js
async function createOrder(userId, totalAmount, paymentMethod, items) {
  try {
    // Validate inputs
    if (!userId || !totalAmount || !paymentMethod || !items || !Array.isArray(items)) {
      console.error('Invalid order data:', { userId, totalAmount, paymentMethod, items });
      return { success: false, message: 'Invalid order data' };
    }

    // Generate order ID
    const counter = await Counter.findOneAndUpdate(
      { _id: 'order_id' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const orderId = `order_${counter.seq}`;

    // Create order items
    const orderItems = [];
    for (const item of items) {
      if (!item.type || !item.id || !item.quantity || !item.amount) {
        console.error('Invalid item data:', item);
        return { success: false, message: 'Invalid item data' };
      }

      // Normalize ID to string
      const itemId = String(item.id);

      // Verify item exists in inventory
      let product;
      switch (item.type.toLowerCase()) {
        case 'phone':
          product = await Phone.findOne({ id: itemId });
          break;
        case 'laptop':
          product = await Laptop.findOne({ id: itemId });
          break;
        case 'charger':
          product = await Charger.findOne({ id: itemId });
          break;
        case 'earphone':
          product = await Earphone.findOne({ id: itemId });
          break;
        case 'mouse':
          product = await Mouse.findOne({ id: itemId });
          break;
        case 'smartwatch':
          product = await Smartwatch.findOne({ id: itemId });
          break;
        default:
          console.error('Invalid item type:', item.type);
          return { success: false, message: `Invalid item type: ${item.type}` };
      }

      if (!product) {
        console.error(`Item not found: type=${item.type}, id=${itemId}`);
        return { success: false, message: `${item.type} with ID ${itemId} not found` };
      }

      orderItems.push({
        order_id: orderId,
        item_type: item.type,
        item_id: itemId,
        quantity: item.quantity,
        amount: item.amount,
        accessory: item.accessory,
      });
    }

    // Save order
    const order = new Order({
      order_id: orderId,
      user_id: userId,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      status: 'pending',
      created_at: new Date(),
    });
    await order.save();
    console.log(`Order saved: ${orderId}`);

    // Save order items
    await OrderItem.insertMany(orderItems);
    console.log(`Order items saved for order: ${orderId}`);

    // Delete items from inventory
    for (const item of items) {
      const itemId = String(item.id);
      console.log(`Attempting to delete item: type=${item.type}, id=${itemId}`);
      let deleteResult;
      switch (item.type.toLowerCase()) {
        case 'phone':
          deleteResult = await Phone.deleteOne({ id: itemId });
          break;
        case 'laptop':
          deleteResult = await Laptop.deleteOne({ id: itemId });
          break;
        case 'charger':
          deleteResult = await Charger.deleteOne({ id: itemId });
          break;
        case 'earphone':
          deleteResult = await Earphone.deleteOne({ id: itemId });
          break;
        case 'mouse':
          deleteResult = await Mouse.deleteOne({ id: itemId });
          break;
        case 'smartwatch':
          deleteResult = await Smartwatch.deleteOne({ id: itemId });
          break;
      }
      console.log(`Deletion result for ${item.type} id=${itemId}:`, deleteResult);
      if (deleteResult.deletedCount === 0) {
        console.warn(`No item deleted: type=${item.type}, id=${itemId}`);
      }
    }

    // Update customer's order count
    await Customer.updateOne(
      { user_id: userId },
      { $inc: { orders_count: 1 } }
    );

    return { success: true, orderId };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, message: 'Failed to create order: ' + error.message };
  }
}
export async function getOrdersByUserId(userId) {
  try {
    const orders = await Order.find({ user_id: userId })
      .sort({ createdAt: -1 }) // Use createdAt (Mongoose default)
      .lean();
    
    const orderIds = orders.map(order => order.order_id);
    const orderItems = await OrderItem.find({ order_id: { $in: orderIds } }).lean();
    
    return orders.map(order => ({
      orderId: order.order_id,          // Rename to orderId
      totalAmount: order.total_amount,  // Rename to totalAmount
      paymentMethod: order.payment_method, // Rename to paymentMethod
      timestamp: order.createdAt,       // Rename createdAt to timestamp
      items: orderItems
        .filter(item => item.order_id === order.order_id)
        .map(item => ({
          type: item.item_type,           // Rename to type
          id: item.item_id,               // Rename to id
          quantity: item.quantity,
          amount: item.amount,
          accessory: item.accessory
        }))
    }));
  } catch (error) {
    console.error('Error getting orders by user ID:', error);
    return []; // Return empty array instead of throwing
  }
}

export async function getAllOrders() {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .lean();
    
    const orderIds = orders.map(order => order.order_id);
    const orderItems = await OrderItem.find({ order_id: { $in: orderIds } }).lean();
    
    return orders.map(order => ({
      orderId: order.order_id,
      totalAmount: order.total_amount,
      paymentMethod: order.payment_method,
      timestamp: order.createdAt,
      items: orderItems
        .filter(item => item.order_id === order.order_id)
        .map(item => ({
          type: item.item_type,
          id: item.item_id,
          quantity: item.quantity,
          amount: item.amount,
          accessory: item.accessory
        }))
    }));
  } catch (error) {
    console.error('Error getting all orders:', error);
    return [];
  }
}

// Admin Functions
export async function authenticateAdmin(adminId, password, securityToken) {
  try {
    const admin = await Admin.findOne({ admin_id: adminId }).lean();
    
    if (!admin) {
      return { success: false, message: 'Invalid admin ID' };
    }
    
    const passwordMatch = await bcrypt.compare(password, admin.password);
    
    if (!passwordMatch) {
      return { success: false, message: 'Invalid password' };
    }
    
    if (admin.security_token !== securityToken) {
      return { success: false, message: 'Invalid security token' };
    }
    
    const { password: _, ...adminData } = admin;
    return { success: true, admin: adminData };
  } catch (error) {
    console.error('Admin authentication error:', error);
    return { success: false, message: 'Authentication error' };
  }
}

export async function updateAdmin(adminId, updates) {
  try {
    const { name, password, security_token } = updates;
    const updateFields = { name, security_token };
    
    if (password) {
      updateFields.password = await bcrypt.hash(password, 10);
    }
    
    await Admin.updateOne(
      { admin_id: adminId },
      { $set: updateFields }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error updating admin:', error);
    return { success: false, message: error.message };
  }
}

// Supervisor Activity Functions
export async function logSupervisorActivity(supervisorId, action) {
  try {
    await SupervisorActivity.create({
      supervisor_id: supervisorId,
      action,
    });
    return { success: true };
  } catch (error) {
    console.error('Error logging supervisor activity:', error);
    return { success: false, message: error.message };
  }
}

export async function getSupervisorActivity(supervisorId) {
  try {
    const activities = await SupervisorActivity.find({ supervisor_id: supervisorId })
      .sort({ timestamp: -1 })
      .lean();
    return activities;
  } catch (error) {
    console.error('Error getting supervisor activity:', error);
    throw error;
  }
}

export async function deleteSupervisor(userId) {
  try {
    const result = await Supervisor.deleteOne({ user_id: userId });
    if (result.deletedCount === 0) {
      return { success: false, message: 'Supervisor not found' };
    }
    return { success: true };
  } catch (error) {
    console.error('Error deleting supervisor:', error);
    throw error; 
  }
}

export async function getAllSupervisors() {
  try {
    const supervisors = await Supervisor.find()
      .lean()
      .select('user_id first_name last_name email phone username created_at');
    return supervisors;
  } catch (error) {
    console.error('Error fetching supervisors:', error);
    throw error;
  }
}

// Get Latest Phones
export async function getLatestPhones(limit = 5) {
  try {
    const phones = await Phone.find()
      .sort({ created_at: -1 }) // Sort by newest first
      .limit(limit)
      .lean()
      .select('id brand model base_price condition discount image');
    return phones;
  } catch (error) {
    console.error('Error fetching latest phones:', error);
    throw error;
  }
}

// Get Latest Laptops
export async function getLatestLaptops(limit = 5) {
  try {
    const laptops = await Laptop.find()
      .sort({ created_at: -1 }) // Sort by newest first
      .limit(limit)
      .lean()
      .select('id brand series base_price discount image');
    return laptops;
  } catch (error) {
    console.error('Error fetching latest laptops:', error);
    throw error;
  }
}
async function deleteCustomer(userId) {
  try {
    const result = await Customer.deleteOne({ user_id: userId });
    if (result.deletedCount === 0) {
      return { success: false, message: 'Customer not found' };
    }
    return { success: true };
  } catch (error) {
    throw new Error(`Failed to delete customer: ${error.message}`);
  }
}
// Close Database Connection
export async function closeDatabase() {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing database:', error);
    throw error;
  }
}