import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from '@/lib/cart-context';
import StoreLayout from '@/components/storefront/StoreLayout';
import Home from '@/pages/Home';
import Collection from '@/pages/Collection';
import ProductDetail from '@/pages/ProductDetail';
import Packs from '@/pages/Packs';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import Confirmation from '@/pages/Confirmation';
import About from '@/pages/About';
import Quality from '@/pages/Quality';
import Reviews from '@/pages/Reviews';
import Contact from '@/pages/Contact';
import ShippingReturns from '@/pages/ShippingReturns';
import SizeGuide from '@/pages/SizeGuide';
import Payment from '@/pages/Payment';
import FAQ from '@/pages/FAQ';
import Legal from '@/pages/Legal';
// Add page imports here

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
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
      <Routes>
        <Route element={<StoreLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/produit/:slug" element={<ProductDetail />} />
          <Route path="/packs" element={<Packs />} />
          <Route path="/panier" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/qualite" element={<Quality />} />
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
    </CartProvider>
  );
};

function App() {

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