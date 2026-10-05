import React, { useState, useEffect, useMemo } from 'react';
import { 
  Jersey, 
  CartItem, 
  Order, 
  Review, 
  FilterState, 
  Size, 
  CustomStamping,
  StoreSettings,
  DiscountCode,
  Ball
} from './types';
import { 
  getStoredJerseys, 
  saveJerseys, 
  getStoredBalls,
  saveBalls,
  ballToJerseyAdapter,
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
  getStoredDiscountCodes,
  saveDiscountCodes,
  formatPrice 
} from './utils/storage';
import { 
  subscribeToJerseys,
  syncAllJerseysToCloud,
  saveJerseyToCloud,
  deleteJerseyFromCloud,
  subscribeToBalls,
  saveBallToCloud,
  deleteBallFromCloud,
  syncAllBallsToCloud,
  subscribeToSettings,
  saveSettingsToCloud,
  subscribeToOrders,
  saveOrderToCloud,
  updateOrderStatusInCloud,
  subscribeToDiscountCodes,
  saveDiscountCodesToCloud,
  subscribeToReviews,
  saveReviewToCloud
} from './services/firebase';
import { Instagram, MessageCircle } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { JerseyCard } from './components/JerseyCard';
import { JerseyDetailModal } from './components/JerseyDetailModal';
import { BallsSection } from './components/BallsSection';
import { BallDetailModal } from './components/BallDetailModal';
import { SearchFilters } from './components/SearchFilters';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminPanel } from './components/AdminPanel';
import { ContactSection } from './components/ContactSection';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { CustomerOrderHistoryModal } from './components/CustomerOrderHistoryModal';
import { HalloweenDecorations } from './components/HalloweenDecorations';
import { INITIAL_LEAGUES } from './data/mockData';
import { getJerseyVersionInfo } from './utils/jerseyUtils';

export default function App() {
  // Primary States with Persistence
  const [jerseys, setJerseys] = useState<Jersey[]>(() => getStoredJerseys());
  const [balls, setBalls] = useState<Ball[]>(() => getStoredBalls());
  const [cart, setCart] = useState<CartItem[]>(() => getStoredCart());
  const [orders, setOrders] = useState<Order[]>(() => getStoredOrders());
  const [reviews, setReviews] = useState<Review[]>(() => getStoredReviews());
  const [currency, setCurrencyState] = useState<'CRC' | 'USD'>(() => getStoredCurrency());
  const [settings, setSettingsState] = useState<StoreSettings>(() => getStoredSettings());
  const [discountCodes, setDiscountCodesState] = useState<DiscountCode[]>(() => getStoredDiscountCodes());

  // UI View States
  const [activeTab, setActiveTab] = useState<string>('catalog');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<'inventory' | 'balls' | 'settings' | 'orders' | 'stats' | 'coupons' | 'hero'>('hero');
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [selectedJerseyDetail, setSelectedJerseyDetail] = useState<Jersey | null>(null);
  const [selectedBallDetail, setSelectedBallDetail] = useState<Ball | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  // Search & Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedSport: 'all',
    selectedLeague: 'all',
    selectedTeam: 'all',
    selectedType: 'all',
    selectedVersion: 'all',
    selectedSize: 'all',
    minPrice: 0,
    maxPrice: 200,
    sortBy: 'recommended'
  });

  // Real-time synchronization with Cloud Firestore
  useEffect(() => {
    const unsubJerseys = subscribeToJerseys((cloudJerseys) => {
      if (cloudJerseys) {
        setJerseys(cloudJerseys);
        saveJerseys(cloudJerseys);
      }
    });

    const unsubBalls = subscribeToBalls((cloudBalls) => {
      if (cloudBalls) {
        setBalls(cloudBalls);
        saveBalls(cloudBalls);
      }
    });

    const unsubSettings = subscribeToSettings((cloudSettings) => {
      if (cloudSettings) {
        setSettingsState(cloudSettings);
        saveSettings(cloudSettings);
      }
    });

    const unsubOrders = subscribeToOrders((cloudOrders) => {
      if (cloudOrders) {
        setOrders(cloudOrders);
        saveOrders(cloudOrders);
      }
    });

    const unsubDiscounts = subscribeToDiscountCodes((cloudCodes) => {
      if (cloudCodes && cloudCodes.length > 0) {
        setDiscountCodesState(cloudCodes);
        saveDiscountCodes(cloudCodes);
      }
    });

    const unsubReviews = subscribeToReviews((cloudReviews) => {
      if (cloudReviews && cloudReviews.length > 0) {
        setReviews(cloudReviews);
        saveReviews(cloudReviews);
      }
    });

    return () => {
      unsubJerseys();
      unsubBalls();
      unsubSettings();
      unsubOrders();
      unsubDiscounts();
      unsubReviews();
    };
  }, []);

  // Save changes to localStorage and Cloud Firestore
  const handleSetCurrency = (curr: 'CRC' | 'USD') => {
    setCurrencyState(curr);
    saveCurrency(curr);
  };

  const handleUpdateSettings = async (newSettings: StoreSettings) => {
    setSettingsState(newSettings);
    saveSettings(newSettings);
    try {
      await saveSettingsToCloud(newSettings);
    } catch (e) {
      console.warn('Could not sync settings to cloud:', e);
    }
  };

  const handleUpdateDiscountCodes = async (newCodes: DiscountCode[]) => {
    setDiscountCodesState(newCodes);
    saveDiscountCodes(newCodes);
    try {
      await saveDiscountCodesToCloud(newCodes);
    } catch (e) {
      console.warn('Could not sync discount codes to cloud:', e);
    }
  };

  const handleUpdateJerseys = async (newJerseys: Jersey[]) => {
    setJerseys(newJerseys);
    saveJerseys(newJerseys);
    try {
      await syncAllJerseysToCloud(newJerseys);
    } catch (e) {
      console.warn('Could not sync jerseys to cloud:', e);
    }
  };

  const handleSaveSingleJersey = async (jersey: Jersey) => {
    setJerseys(prev => {
      const exists = prev.some(j => j.id === jersey.id);
      const updated = exists ? prev.map(j => j.id === jersey.id ? jersey : j) : [jersey, ...prev];
      saveJerseys(updated);
      return updated;
    });
    await saveJerseyToCloud(jersey);
  };

  const handleDeleteSingleJersey = async (jerseyId: string) => {
    setJerseys(prev => {
      const updated = prev.filter(j => j.id !== jerseyId);
      saveJerseys(updated);
      return updated;
    });
    await deleteJerseyFromCloud(jerseyId);
  };

  const handleUpdateBalls = async (newBalls: Ball[]) => {
    setBalls(newBalls);
    saveBalls(newBalls);
    try {
      await syncAllBallsToCloud(newBalls);
    } catch (e) {
      console.warn('Could not sync balls to cloud:', e);
    }
  };

  const handleSaveSingleBall = async (ball: Ball) => {
    setBalls(prev => {
      const exists = prev.some(b => b.id === ball.id);
      const updated = exists ? prev.map(b => b.id === ball.id ? ball : b) : [ball, ...prev];
      saveBalls(updated);
      return updated;
    });
    await saveBallToCloud(ball);
  };

  const handleDeleteSingleBall = async (ballId: string) => {
    setBalls(prev => {
      const updated = prev.filter(b => b.id !== ballId);
      saveBalls(updated);
      return updated;
    });
    await deleteBallFromCloud(ballId);
  };

  const handleUpdateOrders = async (newOrders: Order[]) => {
    setOrders(newOrders);
    saveOrders(newOrders);
    try {
      for (const ord of newOrders) {
        updateOrderStatusInCloud(ord.id, ord.status).catch(() => {});
      }
    } catch (e) {
      console.warn('Could not sync order statuses to cloud:', e);
    }
  };

  const handleUpdateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    saveCart(newCart);
  };

  const handleAddReview = async (newReview: Review) => {
    const updated = [newReview, ...reviews];
    setReviews(updated);
    saveReviews(updated);
    try {
      await saveReviewToCloud(newReview);
    } catch (e) {
      console.warn('Could not sync review to cloud:', e);
    }
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
        const matchesVersion = (j.version || '').toLowerCase().includes(query);
        const matchesGender = (j.genderCategory || '').toLowerCase().includes(query);
        if (!matchesName && !matchesTeam && !matchesLeague && !matchesYear && !matchesType && !matchesVersion && !matchesGender) {
          return false;
        }
      }

      // 2. Sport Category
      if (filters.selectedSport && filters.selectedSport !== 'all') {
        const itemSport = j.sportCategory || 'Fútbol';
        if (itemSport !== filters.selectedSport) {
          return false;
        }
      }

      // 3. League
      if (filters.selectedLeague !== 'all' && j.league !== filters.selectedLeague) {
        return false;
      }

      // 4. Team
      if (filters.selectedTeam !== 'all' && j.team !== filters.selectedTeam) {
        return false;
      }

      // 5. Type
      if (filters.selectedType !== 'all' && j.type !== filters.selectedType) {
        return false;
      }

      // 6. Version
      if (filters.selectedVersion && filters.selectedVersion !== 'all') {
        const jerseyVersion = getJerseyVersionInfo(j.version).label;
        if (jerseyVersion !== filters.selectedVersion) {
          return false;
        }
      }

      // 7. Size
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

  const handleQuickAddBall = (ball: Ball, size: string) => {
    const cartItemId = `ball-${ball.id}-${size}`;
    const existingIndex = cart.findIndex(i => i.cartItemId === cartItemId);
    const jerseyEquivalent = ballToJerseyAdapter(ball);

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      handleUpdateCart(updated);
    } else {
      const newItem: CartItem = {
        cartItemId,
        jersey: jerseyEquivalent,
        size,
        quantity: 1,
        itemType: 'ball',
        ball
      };
      handleUpdateCart([...cart, newItem]);
    }
  };

  const handleAddToCartBall = (ball: Ball, size: string, quantity: number) => {
    const cartItemId = `ball-${ball.id}-${size}`;
    const existingIndex = cart.findIndex(i => i.cartItemId === cartItemId);
    const jerseyEquivalent = ballToJerseyAdapter(ball);

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      handleUpdateCart(updated);
    } else {
      const newItem: CartItem = {
        cartItemId,
        jersey: jerseyEquivalent,
        size,
        quantity,
        itemType: 'ball',
        ball
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
      msg += `\n✨ *Estampado (GRATIS 🎁):* Nombre: ${customStamping.name} | Dorsal: #${customStamping.number}`;
      if (customStamping.patch) {
        msg += ` | Parche: ${customStamping.patch}`;
      }
    }
    const totalPrice = jersey.price;
    msg += `\n💰 *Precio:* ${formatPrice(totalPrice, currency)} (¡Personalización Gratuita!)`;
    msg += `\n¿Tienen disponibilidad para envío inmediato en Costa Rica?`;

    const cleanPhone = settings.contactPhone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone || '50685595192'}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Cart Totals
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalUSD = cart.reduce((sum, item) => {
    return sum + item.jersey.price * item.quantity;
  }, 0);

  const isHalloween = settings?.themeMode === 'halloween';

  const handleOrderCompleted = async (newOrder: Order) => {
    handleUpdateOrders([newOrder, ...orders]);
    handleUpdateCart([]); // Clear cart after order
    try {
      await saveOrderToCloud(newOrder);
    } catch (e) {
      console.warn('Could not save order to cloud:', e);
    }
  };

  return (
    <div className={`min-h-screen ${
      isHalloween 
        ? 'bg-[#0a050d] text-orange-50 font-sans selection:bg-orange-500 selection:text-black' 
        : 'bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950'
    } flex flex-col justify-between relative`}>
      {isHalloween && <HalloweenDecorations />}
      
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
        onOpenOrderHistory={() => setIsOrderHistoryOpen(true)}
        settings={settings}
      />

      {/* Main Container */}
      <main className="flex-1">
        
        {/* Hero Section */}
        {activeTab === 'catalog' && (
          <Hero
            selectedLeague={filters.selectedLeague}
            settings={settings}
            onSelectLeague={(leagueId) => {
              setFilters(prev => ({ ...prev, selectedLeague: leagueId, selectedTeam: 'all' }));
              setActiveTab('catalog');
            }}
            onExploreClick={() => {
              const el = document.getElementById('catalog-grid');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onExploreBalls={() => {
              setActiveTab('balls');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAdminToHero={() => {
              setAdminInitialTab('hero');
              setIsAdminOpen(true);
            }}
          />
        )}

        {/* Section: Balones a la Venta */}
        {activeTab === 'balls' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <BallsSection
              balls={balls}
              currency={currency}
              settings={settings}
              onQuickAdd={handleQuickAddBall}
              onOpenDetail={(b) => setSelectedBallDetail(b)}
              onOpenAdminToBalls={() => {
                setAdminInitialTab('balls');
                setIsAdminOpen(true);
              }}
            />
          </section>
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
              settings={settings}
              onReset={() => setFilters({
                searchQuery: '',
                selectedSport: 'all',
                selectedLeague: 'all',
                selectedTeam: 'all',
                selectedType: 'all',
                selectedVersion: 'all',
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
                      selectedSport: 'all',
                      selectedLeague: 'all',
                      selectedTeam: 'all',
                      selectedType: 'all',
                      selectedVersion: 'all',
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
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                  {filteredJerseys.map((jersey) => (
                    <JerseyCard
                      key={jersey.id}
                      jersey={jersey}
                      currency={currency}
                      onQuickAdd={handleQuickAdd}
                      onOpenDetail={(j) => setSelectedJerseyDetail(j)}
                      isHalloween={isHalloween}
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
        onOpenOrderHistory={() => setIsOrderHistoryOpen(true)}
      />

      {/* Customer Order History / Tracking Modal */}
      {isOrderHistoryOpen && (
        <CustomerOrderHistoryModal
          isOpen={isOrderHistoryOpen}
          onClose={() => setIsOrderHistoryOpen(false)}
          orders={orders}
          currency={currency}
          settings={settings}
        />
      )}

      {/* Persistent Floating WhatsApp Action Button */}
      <WhatsAppFloatingButton settings={settings} />

      {/* Jersey Detail & Customizer Modal */}
      {selectedJerseyDetail && (
        <JerseyDetailModal
          jersey={selectedJerseyDetail}
          currency={currency}
          settings={settings}
          onClose={() => setSelectedJerseyDetail(null)}
          onAddToCart={handleAddToCartWithCustom}
          onBuyWhatsApp={handleBuyWhatsApp}
        />
      )}

      {/* Ball Detail & Purchase Modal */}
      {selectedBallDetail && (
        <BallDetailModal
          ball={selectedBallDetail}
          currency={currency}
          settings={settings}
          onClose={() => setSelectedBallDetail(null)}
          onAddToCart={handleAddToCartBall}
        />
      )}

      {/* Shopping Cart Drawer */}
      {isCartOpen && (
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          currency={currency}
          settings={settings}
          discountCodes={discountCodes}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onProceedToCheckout={(discountCRC) => {
            setAppliedDiscount(discountCRC);
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
          }}
          onWhatsAppOrder={() => {
            if (cart.length === 0) return;
            let text = `Hola OFFSIDE Sports! ⚽ Quisiera pedir los siguientes productos de mi carrito:\n`;
            cart.forEach((item, idx) => {
              const label = item.itemType === 'ball' ? '⚽ Balón' : 'Camiseta';
              text += `\n${idx + 1}. *${item.jersey.name}* (${label}) - Talla: *${item.size}* (x${item.quantity})`;
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
      )}

      {/* Payment Gateway Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cart={cart}
          discount={appliedDiscount}
          currency={currency}
          settings={settings}
          onOrderCompleted={handleOrderCompleted}
        />
      )}

      {/* Admin Panel Modal */}
      {isAdminOpen && (
        <AdminPanel
          jerseys={jerseys}
          balls={balls}
          orders={orders}
          currency={currency}
          settings={settings}
          discountCodes={discountCodes}
          onUpdateJerseys={handleUpdateJerseys}
          onSaveJersey={handleSaveSingleJersey}
          onDeleteJersey={handleDeleteSingleJersey}
          onUpdateBalls={handleUpdateBalls}
          onSaveBall={handleSaveSingleBall}
          onDeleteBall={handleDeleteSingleBall}
          onUpdateOrders={handleUpdateOrders}
          onUpdateSettings={handleUpdateSettings}
          onUpdateDiscountCodes={handleUpdateDiscountCodes}
          onClose={() => setIsAdminOpen(false)}
          initialTab={adminInitialTab}
        />
      )}

      {/* Floating Instagram & WhatsApp Quick Access Buttons */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
        <a
          href="https://www.instagram.com/offside_sports22?igsh=MXZib2J3cjV2bnl1YQ=="
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:scale-105 text-white font-black px-4 py-3 rounded-full shadow-2xl transition-all cursor-pointer border border-white/20"
          title="Visítanos en Instagram @offside_sports22"
        >
          <Instagram className="w-5 h-5 stroke-[2.5]" />
          <span className="hidden sm:inline text-xs uppercase tracking-wider">Instagram @offside_sports22</span>
        </a>

        <a
          href={`https://wa.me/${(settings.contactPhone || '+506 8559 5192').replace(/[^0-9]/g, '') || '50685595192'}?text=${encodeURIComponent('Hola OFFSIDE Sports! ⚽ Quisiera consultar sobre disponibilidad de camisetas.')}`}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-2 bg-[#00e652] hover:bg-white text-black font-black px-4 py-3 rounded-full shadow-2xl hover:scale-105 transition-all cursor-pointer border border-black/10"
          title="Atención por WhatsApp"
        >
          <MessageCircle className="w-5 h-5 stroke-[2.5]" />
          <span className="hidden sm:inline text-xs uppercase tracking-wider">WhatsApp Directo</span>
        </a>
      </div>

    </div>
  );
}
