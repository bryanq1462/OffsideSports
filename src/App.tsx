import React, { useState, useEffect, useMemo } from 'react';
import { 
  Jersey, 
  CartItem, 
  Order, 
  Review, 
  FilterState, 
  Size, 
  CustomStamping,
  StoreSettings
} from './types';
import { 
  getStoredJerseys, 
  saveJerseys, 
  getStoredCart, 
  saveCart, 
  getStoredOrders, 
  saveOrders, 
  getStoredReviews, 
  saveReviews, 
  getStoredCurrency, 
  saveCurrency,
  getStoredSettings,
  saveSettings,
  formatPrice 
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { JerseyCard } from './components/JerseyCard';
import { JerseyDetailModal } from './components/JerseyDetailModal';
import { SearchFilters } from './components/SearchFilters';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminPanel } from './components/AdminPanel';
import { ContactSection } from './components/ContactSection';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { INITIAL_LEAGUES } from './data/mockData';

export default function App() {
  // Primary States with Persistence
  const [jerseys, setJerseys] = useState<Jersey[]>(() => getStoredJerseys());
  const [cart, setCart] = useState<CartItem[]>(() => getStoredCart());
  const [orders, setOrders] = useState<Order[]>(() => getStoredOrders());
  const [reviews, setReviews] = useState<Review[]>(() => getStoredReviews());
  const [currency, setCurrencyState] = useState<'CRC' | 'USD'>(() => getStoredCurrency());
  const [settings, setSettingsState] = useState<StoreSettings>(() => getStoredSettings());

  // UI View States
  const [activeTab, setActiveTab] = useState<string>('catalog');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedJerseyDetail, setSelectedJerseyDetail] = useState<Jersey | null>(null);
  const [appliedDiscountUSD, setAppliedDiscountUSD] = useState(0);

  // Search & Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedLeague: 'all',
    selectedTeam: 'all',
    selectedType: 'all',
    selectedSize: 'all',
    minPrice: 0,
    maxPrice: 200,
    sortBy: 'recommended'
  });

  // Save changes to localStorage on updates
  const handleSetCurrency = (curr: 'CRC' | 'USD') => {
    setCurrencyState(curr);
    saveCurrency(curr);
  };

  const handleUpdateSettings = (newSettings: StoreSettings) => {
    setSettingsState(newSettings);
    saveSettings(newSettings);
  };

  const handleUpdateJerseys = (newJerseys: Jersey[]) => {
    setJerseys(newJerseys);
    saveJerseys(newJerseys);
  };

  const handleUpdateOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    saveOrders(newOrders);
  };

  const handleUpdateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    saveCart(newCart);
  };

  const handleAddReview = (newReview: Review) => {
    const updated = [newReview, ...reviews];
    setReviews(updated);
    saveReviews(updated);
  };

  // Extract all available teams for filter dropdown
  const availableTeams = useMemo(() => {
    const teamsSet = new Set<string>();
    jerseys.forEach(j => teamsSet.add(j.team));
    return Array.from(teamsSet).sort();
  }, [jerseys]);

  // Filter & Sort Logic
  const filteredJerseys = useMemo(() => {
    return jerseys.filter((j) => {
      // 1. Text Search
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesName = j.name.toLowerCase().includes(query);
        const matchesTeam = j.team.toLowerCase().includes(query);
        const matchesLeague = j.league.toLowerCase().includes(query);
        const matchesYear = j.yearSeason.toLowerCase().includes(query);
        const matchesType = j.type.toLowerCase().includes(query);
        if (!matchesName && !matchesTeam && !matchesLeague && !matchesYear && !matchesType) {
          return false;
        }
      }

      // 2. League
      if (filters.selectedLeague !== 'all' && j.league !== filters.selectedLeague) {
        return false;
      }

      // 3. Team
      if (filters.selectedTeam !== 'all' && j.team !== filters.selectedTeam) {
        return false;
      }

      // 4. Type
      if (filters.selectedType !== 'all' && j.type !== filters.selectedType) {
        return false;
      }

      // 5. Size
      if (filters.selectedSize !== 'all' && !j.sizesAvailable.includes(filters.selectedSize as Size)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      // 'recommended' default: popular first, then rating
      return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || b.rating - a.rating;
    });
  }, [jerseys, filters]);

  // Cart Operations
  const handleQuickAdd = (jersey: Jersey, size: Size) => {
    const cartItemId = `${jersey.id}-${size}`;
    const existingIndex = cart.findIndex(i => i.cartItemId === cartItemId);

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      handleUpdateCart(updated);
    } else {
      const newItem: CartItem = {
        cartItemId,
        jersey,
        size,
        quantity: 1
      };
      handleUpdateCart([...cart, newItem]);
    }
  };

  const handleAddToCartWithCustom = (
    jersey: Jersey,
    size: Size,
    quantity: number,
    customStamping?: CustomStamping
  ) => {
    const stampTag = customStamping?.enabled
      ? `-${customStamping.name}-${customStamping.number}-${customStamping.patch || ''}`
      : '';
    const cartItemId = `${jersey.id}-${size}${stampTag}`;

    const existingIndex = cart.findIndex(i => i.cartItemId === cartItemId);

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      handleUpdateCart(updated);
    } else {
      const newItem: CartItem = {
        cartItemId,
        jersey,
        size,
        quantity,
        customStamping
      };
      handleUpdateCart([...cart, newItem]);
    }
  };

  const handleUpdateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }
    const updated = cart.map(i => i.cartItemId === cartItemId ? { ...i, quantity: newQty } : i);
    handleUpdateCart(updated);
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    const updated = cart.filter(i => i.cartItemId !== cartItemId);
    handleUpdateCart(updated);
  };

  // Direct WhatsApp Buy
  const handleBuyWhatsApp = (jersey: Jersey, size: Size, customStamping?: CustomStamping) => {
    let msg = `Hola OFFSIDE Sports! ⚽ Quisiera pedir la *${jersey.name}* en Talla *${size}*.`;
    if (customStamping?.enabled) {
      msg += `\n✨ *Estampado:* Nombre: ${customStamping.name} | Dorsal: #${customStamping.number}`;
      if (customStamping.patch) {
        msg += ` | Parche: ${customStamping.patch}`;
      }
    }
    const totalPrice = jersey.price + (customStamping?.enabled ? settings.customizationPriceUSD : 0);
    msg += `\n💰 *Precio:* ${formatPrice(totalPrice, currency)}`;
    msg += `\n¿Tienen disponibilidad para envío inmediato en Costa Rica?`;

    const cleanPhone = settings.contactPhone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone || '50685595192'}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Cart Totals
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalUSD = cart.reduce((sum, item) => {
    const stampExtra = item.customStamping?.enabled ? settings.customizationPriceUSD : 0;
    return sum + (item.jersey.price + stampExtra) * item.quantity;
  }, 0);

  const handleOrderCompleted = (newOrder: Order) => {
    handleUpdateOrders([newOrder, ...orders]);
    handleUpdateCart([]); // Clear cart after order
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 flex flex-col justify-between">
      
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        cartTotalUSD={cartTotalUSD}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={filters.searchQuery}
        setSearchQuery={(q) => setFilters(prev => ({ ...prev, searchQuery: q }))}
        currency={currency}
        setCurrency={handleSetCurrency}
        onOpenAdmin={() => setIsAdminOpen(true)}
        settings={settings}
      />

      {/* Main Container */}
      <main className="flex-1">
        
        {/* Hero Section */}
        {activeTab === 'catalog' && (
          <Hero
            selectedLeague={filters.selectedLeague}
            onSelectLeague={(leagueId) => {
              setFilters(prev => ({ ...prev, selectedLeague: leagueId, selectedTeam: 'all' }));
              setActiveTab('catalog');
            }}
            onExploreClick={() => {
              const el = document.getElementById('catalog-grid');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}

        {/* Section: Catalog Grid or Search Filters View */}
        <section id="catalog-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          
          {/* Advanced Search Bar Component */}
          {(activeTab === 'filters' || activeTab === 'catalog') && (
            <SearchFilters
              filters={filters}
              setFilters={setFilters}
              leagues={INITIAL_LEAGUES}
              availableTeams={availableTeams}
              totalResults={filteredJerseys.length}
              onReset={() => setFilters({
                searchQuery: '',
                selectedLeague: 'all',
                selectedTeam: 'all',
                selectedType: 'all',
                selectedSize: 'all',
                minPrice: 0,
                maxPrice: 200,
                sortBy: 'recommended'
              })}
            />
          )}

          {/* Jersey Grid */}
          {(activeTab === 'catalog' || activeTab === 'filters') && (
            <div>
              {filteredJerseys.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto my-12">
                  <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto text-2xl font-black">
                    ⚽
                  </div>
                  <h3 className="text-lg font-black text-white uppercase">No encontramos camisetas con estos filtros</h3>
                  <p className="text-xs text-slate-400">Intenta buscar con otro nombre de equipo, selecciona "Todas las Ligas" o limpia los filtros activos.</p>
                  <button
                    onClick={() => setFilters({
                      searchQuery: '',
                      selectedLeague: 'all',
                      selectedTeam: 'all',
                      selectedType: 'all',
                      selectedSize: 'all',
                      minPrice: 0,
                      maxPrice: 200,
                      sortBy: 'recommended'
                    })}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs uppercase cursor-pointer"
                  >
                    Mostrar Todas las Camisetas
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredJerseys.map((jersey) => (
                    <JerseyCard
                      key={jersey.id}
                      jersey={jersey}
                      currency={currency}
                      onQuickAdd={handleQuickAdd}
                      onOpenDetail={(j) => setSelectedJerseyDetail(j)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Verified Customer Reviews Section */}
          {activeTab === 'reviews' && (
            <ReviewsSection
              reviews={reviews}
              jerseys={jerseys}
              onAddReview={handleAddReview}
            />
          )}

          {/* Contact & WhatsApp Section */}
          {activeTab === 'contact' && (
            <ContactSection settings={settings} />
          )}

        </section>

      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        setActiveTab={setActiveTab}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Persistent Floating WhatsApp Action Button */}
      <WhatsAppFloatingButton settings={settings} />

      {/* Jersey Detail & Customizer Modal */}
      <JerseyDetailModal
        jersey={selectedJerseyDetail}
        currency={currency}
        settings={settings}
        onClose={() => setSelectedJerseyDetail(null)}
        onAddToCart={handleAddToCartWithCustom}
        onBuyWhatsApp={handleBuyWhatsApp}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        currency={currency}
        settings={settings}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={(discountUSD) => {
          setAppliedDiscountUSD(discountUSD);
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onWhatsAppOrder={() => {
          if (cart.length === 0) return;
          let text = `Hola OFFSIDE Sports! ⚽ Quisiera pedir los siguientes productos de mi carrito:\n`;
          cart.forEach((item, idx) => {
            text += `\n${idx + 1}. *${item.jersey.name}* - Talla: *${item.size}* (x${item.quantity})`;
            if (item.customStamping?.enabled) {
              text += `\n   Estampado: ${item.customStamping.name} #${item.customStamping.number}`;
            }
          });
          text += `\n\nTotal estimado: *${formatPrice(cartTotalUSD, currency)}*`;
          text += `\n¿Tienen servicio de envío o contra entrega en Costa Rica?`;

          const cleanPhone = settings.contactPhone.replace(/[^0-9]/g, '');
          window.open(`https://wa.me/${cleanPhone || '50685595192'}?text=${encodeURIComponent(text)}`, '_blank');
        }}
      />

      {/* Payment Gateway Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        discountUSD={appliedDiscountUSD}
        currency={currency}
        settings={settings}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Admin Panel Modal */}
      {isAdminOpen && (
        <AdminPanel
          jerseys={jerseys}
          orders={orders}
          currency={currency}
          settings={settings}
          onUpdateJerseys={handleUpdateJerseys}
          onUpdateOrders={handleUpdateOrders}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

    </div>
  );
}
