import type { Product } from '../types/marketplace';

const productImages = {
  phone: require('../../assets/products/smartphone.jpg'),
  laptop: require('../../assets/products/laptop.jpg'),
  headphones: require('../../assets/products/headphones.jpg'),
  smartwatch: require('../../assets/products/smartwatch.jpg'),
  tablet: require('../../assets/products/tablet.jpg'),
  tv: require('../../assets/products/tv.jpg'),
  coffeeMaker: require('../../assets/products/coffee_maker.jpg'),
};

export const marketplaceProducts: Product[] = [
  {
    id: 'nova-x1-phone',
    name: 'Nova X1 5G Smartphone',
    description: 'A slim everyday smartphone with a bright display, dependable battery life, and fast charging support.',
    image: {
      type: 'asset',
      source: productImages.phone,
      label: 'Phone',
      backgroundColor: '#F5F5F7',
    },
    price: 29999,
    category: 'Smartphone',
    variants: [
      { id: 'nova-x1-128-black', type: 'Storage', label: '128 GB', value: 'Black', available: true, price: 29999 },
      { id: 'nova-x1-256-black', type: 'Storage', label: '256 GB', value: 'Black', available: true, price: 34999 },
      { id: 'nova-x1-256-blue', type: 'Color', label: 'Blue', value: '256 GB', available: true, price: 34999 },
    ],
    emiPlans: [
      { id: 'nova-x1-3m', durationMonths: 3, monthlyAmount: 10000, totalAmount: 30000, interestRate: 0, processingFee: 199, available: true },
      { id: 'nova-x1-6m', durationMonths: 6, monthlyAmount: 5000, totalAmount: 30000, interestRate: 0, processingFee: 299, available: true },
      { id: 'nova-x1-12m', durationMonths: 12, monthlyAmount: 2584, totalAmount: 31008, interestRate: 6.5, processingFee: 399, available: true },
    ],
    details: ['6.5-inch AMOLED display', '5000 mAh battery', 'Dual camera system'],
  },
  {
    id: 'orbitbook-air-14',
    name: 'OrbitBook Air 14 Laptop',
    description: 'A lightweight laptop for study, office work, streaming, and smooth multitasking on the go.',
    image: {
      type: 'asset',
      source: productImages.laptop,
      label: 'Laptop',
      backgroundColor: '#F5F5F7',
    },
    price: 64999,
    category: 'Laptop',
    variants: [
      { id: 'orbitbook-8-512', type: 'RAM', label: '8 GB', value: '512 GB SSD', available: true, price: 64999 },
      { id: 'orbitbook-16-512', type: 'RAM', label: '16 GB', value: '512 GB SSD', available: true, price: 72999 },
      { id: 'orbitbook-16-1tb', type: 'Storage', label: '1 TB SSD', value: '16 GB RAM', available: false, price: 81999 },
    ],
    emiPlans: [
      { id: 'orbitbook-6m', durationMonths: 6, monthlyAmount: 10834, totalAmount: 65004, interestRate: 0, processingFee: 499, available: true },
      { id: 'orbitbook-9m', durationMonths: 9, monthlyAmount: 7389, totalAmount: 66501, interestRate: 3.5, processingFee: 599, available: true },
      { id: 'orbitbook-12m', durationMonths: 12, monthlyAmount: 5688, totalAmount: 68256, interestRate: 6.5, processingFee: 699, available: true },
    ],
    details: ['14-inch full HD display', 'Backlit keyboard', 'All-day battery profile'],
  },
  {
    id: 'sonicbuds-pro',
    name: 'SonicBuds Pro Wireless Headphones',
    description: 'Comfortable wireless headphones with rich sound, clear calls, and active noise cancellation.',
    image: {
      type: 'asset',
      source: productImages.headphones,
      label: 'Headphones',
      backgroundColor: '#F5F5F7',
    },
    price: 8999,
    category: 'Headphones',
    variants: [
      { id: 'sonicbuds-black', type: 'Color', label: 'Black', value: 'Matte Black', available: true, price: 8999 },
      { id: 'sonicbuds-white', type: 'Color', label: 'White', value: 'Pearl White', available: true, price: 8999 },
    ],
    emiPlans: [
      { id: 'sonicbuds-3m', durationMonths: 3, monthlyAmount: 3000, totalAmount: 9000, interestRate: 0, processingFee: 99, available: true },
      { id: 'sonicbuds-6m', durationMonths: 6, monthlyAmount: 1530, totalAmount: 9180, interestRate: 4.5, processingFee: 149, available: true },
      { id: 'sonicbuds-9m', durationMonths: 9, monthlyAmount: 1040, totalAmount: 9360, interestRate: 6.5, processingFee: 149, available: false },
    ],
    details: ['Active noise cancellation', 'Up to 32 hours battery', 'Fast pair support'],
  },
  {
    id: 'pulsefit-watch-3',
    name: 'PulseFit Watch 3',
    description: 'A polished smartwatch for daily health tracking, notifications, workouts, and long battery life.',
    image: {
      type: 'asset',
      source: productImages.smartwatch,
      label: 'Watch',
      backgroundColor: '#F5F5F7',
    },
    price: 12999,
    category: 'Smartwatch',
    variants: [
      { id: 'pulsefit-graphite', type: 'Color', label: 'Graphite', value: 'Silicone strap', available: true, price: 12999 },
      { id: 'pulsefit-rose', type: 'Color', label: 'Rose Gold', value: 'Silicone strap', available: true, price: 13499 },
    ],
    emiPlans: [
      { id: 'pulsefit-3m', durationMonths: 3, monthlyAmount: 4333, totalAmount: 12999, interestRate: 0, processingFee: 99, available: true },
      { id: 'pulsefit-6m', durationMonths: 6, monthlyAmount: 2209, totalAmount: 13254, interestRate: 4, processingFee: 149, available: true },
      { id: 'pulsefit-9m', durationMonths: 9, monthlyAmount: 1502, totalAmount: 13518, interestRate: 6, processingFee: 199, available: true },
    ],
    details: ['AMOLED touch display', 'Heart rate and SpO2 tracking', 'Bluetooth calling'],
  },
  {
    id: 'canvas-tab-11',
    name: 'Canvas Tab 11',
    description: 'A thin tablet made for notes, video calls, reading, and entertainment at home or college.',
    image: {
      type: 'asset',
      source: productImages.tablet,
      label: 'Tablet',
      backgroundColor: '#F5F5F7',
    },
    price: 23999,
    category: 'Tablet',
    variants: [
      { id: 'canvas-64-wifi', type: 'Storage', label: '64 GB', value: 'Wi-Fi', available: true, price: 23999 },
      { id: 'canvas-128-wifi', type: 'Storage', label: '128 GB', value: 'Wi-Fi', available: true, price: 27999 },
      { id: 'canvas-128-lte', type: 'Connectivity', label: 'LTE', value: '128 GB', available: true, price: 32999 },
    ],
    emiPlans: [
      { id: 'canvas-3m', durationMonths: 3, monthlyAmount: 8000, totalAmount: 24000, interestRate: 0, processingFee: 199, available: true },
      { id: 'canvas-6m', durationMonths: 6, monthlyAmount: 4099, totalAmount: 24594, interestRate: 4.5, processingFee: 249, available: true },
      { id: 'canvas-12m', durationMonths: 12, monthlyAmount: 2099, totalAmount: 25188, interestRate: 6.5, processingFee: 299, available: true },
    ],
    details: ['11-inch 2K display', 'Quad speakers', 'Stylus compatible'],
  },
  {
    id: 'viewmax-43-tv',
    name: 'ViewMax 43-inch Smart TV',
    description: 'A compact smart television with crisp visuals, streaming apps, and room-friendly sound.',
    image: {
      type: 'asset',
      source: productImages.tv,
      label: 'TV',
      backgroundColor: '#F5F5F7',
    },
    price: 36999,
    category: 'Television',
    variants: [
      { id: 'viewmax-43', type: 'Size', label: '43 inch', value: '4K UHD', available: true, price: 36999 },
      { id: 'viewmax-50', type: 'Size', label: '50 inch', value: '4K UHD', available: true, price: 45999 },
    ],
    emiPlans: [
      { id: 'viewmax-6m', durationMonths: 6, monthlyAmount: 6167, totalAmount: 37002, interestRate: 0, processingFee: 299, available: true },
      { id: 'viewmax-9m', durationMonths: 9, monthlyAmount: 4210, totalAmount: 37890, interestRate: 4.5, processingFee: 399, available: true },
      { id: 'viewmax-12m', durationMonths: 12, monthlyAmount: 3240, totalAmount: 38880, interestRate: 6.5, processingFee: 499, available: true },
    ],
    details: ['4K UHD panel', 'Built-in streaming apps', 'Dolby Audio support'],
  },
  {
    id: 'brewmate-mini',
    name: 'BrewMate Mini Coffee Maker',
    description: 'A compact coffee maker for quick morning brews, small kitchens, and work desks.',
    image: {
      type: 'asset',
      source: productImages.coffeeMaker,
      label: 'Coffee Maker',
      backgroundColor: '#F5F5F7',
    },
    price: 6999,
    category: 'Home Appliance',
    variants: [
      { id: 'brewmate-black', type: 'Color', label: 'Black', value: '600 ml', available: true, price: 6999 },
      { id: 'brewmate-steel', type: 'Color', label: 'Steel', value: '600 ml', available: true, price: 7499 },
    ],
    emiPlans: [
      { id: 'brewmate-3m', durationMonths: 3, monthlyAmount: 2333, totalAmount: 6999, interestRate: 0, processingFee: 79, available: true },
      { id: 'brewmate-6m', durationMonths: 6, monthlyAmount: 1190, totalAmount: 7140, interestRate: 4, processingFee: 99, available: true },
    ],
    details: ['600 ml capacity', 'Reusable filter', 'Auto shut-off'],
  },
];
