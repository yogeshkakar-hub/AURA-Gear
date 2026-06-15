import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin12345',
    isAdmin: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'user12345',
    isAdmin: false,
  },
];

const sampleProducts = [
  {
    name: 'Quantum Chronograph Black',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    description: 'An elegant timepiece engineered for accuracy. Featuring a sleek glass-morphic dial, brushed steel chassis, and comfortable high-end leather strap. Perfect for tech enthusiasts and collectors alike.',
    brand: 'AetherTech',
    category: 'Electronics',
    price: 249.99,
    countInStock: 8,
  },
  {
    name: 'SonicBuds Pro ANC',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    description: 'Immerse yourself in acoustic bliss. Our flagship headphones feature industry-leading active noise cancelling (ANC), customizable ambient modes, spatial audio tracking, and a massive 40-hour battery life.',
    brand: 'SonicAcoustics',
    category: 'Electronics',
    price: 189.99,
    countInStock: 12,
  },
  {
    name: 'Aura Ambient Lightbar',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    description: 'Elevate your workspace setup with dynamic, screen-synced ambient lighting. Designed to clip onto the top of your monitor to reduce eye strain, this lightbar offers full RGB customization via software controls.',
    brand: 'LumenLabs',
    category: 'Home Office',
    price: 89.99,
    countInStock: 5,
  },
  {
    name: 'Pro Carbon 100 Field Hockey Stick',
    image: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=600&auto=format&fit=crop&q=80',
    description: 'Engineered for elite players, this hockey stick features a 100% premium carbon composite weave for maximum hitting power, a high bow profile for 3D skills, and an anti-vibration gel handle.',
    brand: 'Gryphon',
    category: 'Sports',
    price: 299.99,
    countInStock: 6,
  },
  {
    name: 'New Balance 608v5 Cross-Training Sneakers',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=80',
    description: 'Classic leather cross-training shoes designed for all-day comfort and support. Features a premium ABZORB heel crash pad for impact absorption, a flexible outsole, and a durable leather upper.',
    brand: 'New Balance',
    category: 'Footwear',
    price: 74.99,
    countInStock: 15,
  },
  {
    name: 'Batman Edition Wireless Gaming Headset',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80',
    description: 'Unleash the Dark Knight within your battle station. Equipped with custom-tuned 50mm drivers, stealth black matte finish with yellow Batman insignia, ultra-low latency wireless audio, and noise-cancelling microphone.',
    brand: 'WayneTech',
    category: 'Electronics',
    price: 159.99,
    countInStock: 4,
  },
  {
    name: 'TVS Apache RTR 200 4V Replacement Rider Footrest Bracket',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80',
    description: 'High-durability aluminum replacement rider footrest bracket (left/right mounting) for TVS Apache RTR 200 4V motorcycles. Cast with exact OEM dimensions for seamless replacement and riding stability.',
    brand: 'TVS Genuine Parts',
    category: 'Automotive',
    price: 39.50,
    countInStock: 22,
  },
  {
    name: 'AeroGlow AI/ML Developer Workstation Laptop',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80',
    description: 'The ultimate powerhouse for artificial intelligence and machine learning engineers. Outfitted with a 16-core workstation processor, 64GB DDR5 RAM, 2TB PCIe Gen4 NVMe SSD, and a dedicated mobile graphics accelerator optimized for local tensor operations.',
    brand: 'TensorCore',
    category: 'Electronics',
    price: 2499.00,
    countInStock: 3,
  },
];

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(sampleUsers);

    // Get the Admin user's ObjectId if needed, but not strictly required
    // since products don't reference a user in this simple model.
    await Product.insertMany(sampleProducts);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data destruction: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
