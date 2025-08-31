import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  ShoppingCart,
  Star,
  ChevronRight,
  Plus,
  Minus,
  Tag,
  Truck,
  Gift,
  Clock
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

const CATEGORIES = ['All', 'Supplements', 'Accessories', 'Apparel', 'Equipment'];
const sampleProducts = [
  { 
    id: 's1', 
    name: 'Whey Protein Isolate', 
    price: 39.99, 
    stock: 23, 
    rating: 4.6, 
    category: 'Supplements', 
    brand: 'BioLift', 
    images: ['https://m.media-amazon.com/images/I/61IqOJ0JJQL._AC_SL1500_.jpg'], 
    desc: 'High quality isolate with fast absorption.' 
  },
  { 
    id: 's2', 
    name: 'Resistance Bands Set', 
    price: 19.99, 
    stock: 48, 
    rating: 4.4, 
    category: 'Accessories', 
    brand: 'FlexFit', 
    images: ['https://th.bing.com/th?id=OPAC.ZigxuglFgq7%2fMg474C474&w=220&h=220&c=17&o=5&pid=21.1'], 
    desc: 'Multi-resistance bands for full-body workouts.' 
  },
  { 
    id: 's3', 
    name: 'Dry-Fit Tee', 
    price: 24.99, 
    stock: 120, 
    rating: 4.2, 
    category: 'Apparel', 
    brand: 'BioLift', 
    images: ['https://5.imimg.com/data5/SELLER/Default/2022/10/MN/ML/BD/7313559/mens-sports-dry-fit-t-shirts-1000x1000.png'], 
    desc: 'Breathable, moisture-wicking training tee.' 
  },
  { 
    id: 's4', 
    name: 'Adjustable Dumbbells', 
    price: 249.99, 
    stock: 8, 
    rating: 4.8, 
    category: 'Equipment', 
    brand: 'IronPro', 
    images: ['https://m.media-amazon.com/images/I/81-5vsFdaJL._AC_SL1500_.jpg'], 
    desc: 'Space-saving adjustable dumbbells (5-52.5 lb).' 
  }
];

const ProductCard = ({ product, onAdd }) => (
  <Card className="p-4">
    {/* Product Image */}
    <div className="aspect-square rounded-lg overflow-hidden bg-day-border dark:bg-night-border mb-3 flex items-center justify-center">
      {product.images && product.images.length > 0 ? (
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-xs text-day-text-secondary dark:text-night-text-secondary">
          No Image
        </span>
      )}
    </div>

    {/* Product Name + Brand */}
    <div className="flex items-start justify-between mb-1">
      <h3 className="font-semibold text-day-text-primary dark:text-night-text-primary line-clamp-1">
        {product.name}
      </h3>
      <Badge variant="ghost" size="sm">{product.brand}</Badge>
    </div>

    {/* Rating */}
    <div className="flex items-center gap-1 text-yellow-500 mb-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < Math.round(product.rating) ? "fill-yellow-500" : "opacity-30"
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-day-text-secondary dark:text-night-text-secondary">
        {product.rating}
      </span>
    </div>

    {/* Price + Add to Cart */}
    <div className="flex items-center justify-between">
      <div className="text-lg font-bold text-day-text-primary dark:text-night-text-primary">
        ${product.price.toFixed(2)}
      </div>
      <Button size="sm" onClick={() => onAdd(product)}>
        Add to Cart
      </Button>
    </div>

    {/* Stock */}
    <div className="text-xs text-day-text-secondary dark:text-night-text-secondary mt-1">
      {product.stock} in stock
    </div>
  </Card>
);



const FiltersBar = ({ q, setQ, category, setCategory, sort, setSort, price, setPrice }) => (
  <Card className="p-4">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      <div className="md:col-span-2">
        <Input placeholder="Search products..." icon={<Search className="w-4 h-4" />} value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div>
        <select className="w-full border rounded-lg p-3 bg-day-card dark:bg-night-card border-day-border dark:border-night-border" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <select className="border rounded-lg p-3 bg-day-card dark:bg-night-card border-day-border dark:border-night-border" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
        <select className="border rounded-lg p-3 bg-day-card dark:bg-night-card border-day-border dark:border-night-border" value={price} onChange={(e) => setPrice(e.target.value)}>
          <option value="all">All Prices</option>
          <option value="0-25">$0 - $25</option>
          <option value="25-50">$25 - $50</option>
          <option value=">50">$50+</option>
        </select>
      </div>
    </div>
  </Card>
);

const CartDrawer = ({ open, onClose, items, setItems }) => {
  const total = items.reduce((s, it) => s + it.price * it.qty, 0);
  const updateQty = (id, delta) => setItems((arr) => arr.map((it) => it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it));
  const remove = (id) => setItems((arr) => arr.filter((it) => it.id !== id));
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-day-card dark:bg-night-card border-l border-day-border dark:border-night-border p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-day-text-primary dark:text-night-text-primary">Your Cart</h3>
              <Badge variant="primary">${total.toFixed(2)}</Badge>
            </div>
            <div className="space-y-3">
              {items.length === 0 && <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">Cart is empty</div>}
              {items.map((it) => (
                <Card key={it.id} className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-day-border dark:bg-night-border rounded" />
                    <div className="flex-1">
                      <div className="font-semibold text-day-text-primary dark:text-night-text-primary line-clamp-1">{it.name}</div>
                      <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">${it.price.toFixed(2)}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" variant="ghost" onClick={() => updateQty(it.id, -1)}><Minus className="w-4 h-4" /></Button>
                        <span>{it.qty}</span>
                        <Button size="sm" variant="ghost" onClick={() => updateQty(it.id, 1)}><Plus className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => remove(it.id)}>Remove</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-4">
              <Button variant="primary" fullWidth disabled={items.length === 0}>Checkout</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PromotionsStrip = () => (
  <Card className="p-4 bg-gradient-to-r from-day-accent-primary/10 to-day-accent-secondary/10 dark:from-night-accent/10 dark:to-red-600/10">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Tag className="w-5 h-5 text-day-accent-primary dark:text-night-accent" />
        <div>
          <div className="font-semibold text-day-text-primary dark:text-night-text-primary">Flash Deal: 20% off apparel</div>
          <div className="text-xs text-day-text-secondary dark:text-night-text-secondary">Ends in 02:14:47</div>
        </div>
      </div>
      <Button variant="outline" size="sm">Shop Now</Button>
    </div>
  </Card>
);

const Shop = () => {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');
  const [price, setPrice] = useState('all');
  const [cartOpen, setCartOpen] = useState(false);
  const [items, setItems] = useState([]);

  const filtered = useMemo(() => {
    let list = [...sampleProducts];
    if (category !== 'All') list = list.filter((p) => p.category === category);
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    if (price !== 'all') {
      if (price === '0-25') list = list.filter((p) => p.price <= 25);
      else if (price === '25-50') list = list.filter((p) => p.price > 25 && p.price <= 50);
      else list = list.filter((p) => p.price > 50);
    }
    switch (sort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }
    return list;
  }, [q, category, sort, price]);

  const addToCart = (product) => {
    setItems((arr) => {
      const existing = arr.find((it) => it.id === product.id);
      if (existing) return arr.map((it) => it.id === product.id ? { ...it, qty: it.qty + 1 } : it);
      return [...arr, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-day-text-primary dark:text-night-text-primary">Marketplace</h1>
            <p className="text-day-text-secondary dark:text-night-text-secondary">Personalized shop for members</p>
          </div>
          <Button variant="primary" onClick={() => setCartOpen(true)} icon={<ShoppingCart className="w-5 h-5" />}>Cart</Button>
        </div>
      </motion.div>

      <PromotionsStrip />

      <FiltersBar q={q} setQ={setQ} category={category} setCategory={setCategory} sort={sort} setSort={setSort} price={price} setPrice={setPrice} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={addToCart} />
          ))}
        </div>
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold text-day-text-primary dark:text-night-text-primary mb-3">Recommendations</h3>
            <div className="space-y-3">
              {sampleProducts.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="text-sm text-day-text-primary dark:text-night-text-primary line-clamp-1">{p.name}</div>
                  <Button size="sm" variant="ghost" onClick={() => addToCart(p)}>Add</Button>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold text-day-text-primary dark:text-night-text-primary mb-2">Order Tracking</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> Pending</div>
              <div className="flex items-center gap-2"><Truck className="w-4 h-4" /> Shipped</div>
              <div className="flex items-center gap-2"><Gift className="w-4 h-4" /> Delivered</div>
            </div>
          </Card>
        </div>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={items} setItems={setItems} />
    </div>
  );
};

export default Shop;


