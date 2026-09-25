import { useEffect, lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { initTrafficTracking } from '@/lib/tracking';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from '@/lib/cart-context';
import StoreLayout from '@/components/storefront/StoreLayout';
import Home from '@/pages/Home';

// Lazy load secondary routes & heavy admin dependencies
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));
const Cart = lazy(() => import('@/pages/Cart'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const Confirmation = lazy(() => import('@/pages/Confirmation'));
const OrderTracking = lazy(() => import('@/pages/OrderTracking'));
const Reviews = lazy(() => import('@/pages/Reviews'));
const Contact = lazy(() => import('@/pages/Contact'));
const ShippingReturns = lazy(() => import('@/pages/ShippingReturns'));
const SizeGuide = lazy(() => import('@/pages/SizeGuide'));
const Payment = lazy(() => import('@/pages/Payment'));
const FAQ = lazy(() => import('@/pages/FAQ'));
const Legal = lazy(() => import('@/pages/Legal'));
const Admin = lazy(() => import('@/pages/Admin'));
const PourquoiNous = lazy(() => import('@/pages/PourquoiNous'));

const PageFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-8 h-8 border-3 border-slate-700 border-t-amber-400 rounded-full animate-spin"></div>
  </div>
);

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#070b14]/80 backdrop-blur-sm z-50">
        <div className="w-8 h-8 border-4 border-slate-700 border-t-amber-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <CartProvider>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/:tab" element={<Admin />} />
          <Route element={<StoreLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Navigate to="/notre-boxer" replace />} />
            <Route path="/notre-boxer" element={<ProductDetail />} />
            <Route path="/produit/:slug" element={<ProductDetail />} />
            <Route path="/panier" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/suivi-commande" element={<OrderTracking />} />
            <Route path="/a-propos" element={<Navigate to="/pourquoi-nous" replace />} />
            <Route path="/pourquoi-nous" element={<PourquoiNous />} />
            <Route path="/avis" element={<Reviews />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/livraison-retours" element={<ShippingReturns />} />
            <Route path="/guide-des-tailles" element={<SizeGuide />} />
            <Route path="/paiement" element={<Payment />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/cgv" element={<Legal type="cgv" />} />
            <Route path="/confidentialite" element={<Legal type="confidentialite" />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </CartProvider>
  );
};

function App() {
  useEffect(() => {
    initTrafficTracking();
  }, []);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App