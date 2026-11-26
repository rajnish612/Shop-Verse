import { BrowserRouter, Route, Routes } from "react-router";
import AdminLayout from "./components/layout/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import UsersPage from "./pages/admin/UsersPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import AttributesPage from "./pages/admin/AttributesPage";
import ProductsPage from "./pages/admin/ProductsPage";
import CouponsPage from "./pages/admin/CouponsPage";
import UserLayout from "./components/layout/UserLayout";
import HomePage from "./pages/user/HomePage";
import ShopPage from "./pages/user/ShopPage";
import ProductDetailsPage from "./pages/user/ProductDetailsPage";
import CartPage from "./pages/user/CartPage";
import AddressPage from "./pages/user/AddressPage";
import CheckoutPage from "./pages/user/CheckoutPage";
import OrdersPage from "./pages/user/OrderPage";
import OrdersAdminPage from "./pages/admin/OrdersAdminPage";
import AddProduct from "./pages/admin/AddProduct";
import DealsPage from "./pages/user/DealsPage";
import LoginPage from "./pages/user/LoginPage";
import RegisterPage from "./pages/user/RegisterPage";
import { AuthProvider } from "./context/AuthContext";
import RequireRole from "./components/auth/RequireRole";
import RequireAuth from "./components/auth/RequireAuth";
import ProfilePage from "./pages/user/ProfilePage";
import { Toaster } from "sonner";
import UsedCouponsPage from "./pages/user/UsedCouponsPage";
import VerifyEmailPage from "./pages/user/VerifyEmailPage";
import ForgotPasswordPage from "./pages/user/ForgotPasswordPage";
import ResetPasswordPage from "./pages/user/ResetPasswordPage";
function App() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Admin workspace */}
            <Route
              path="admin"
              element={<RequireRole allowedRoles={["ADMIN"]} />}
            >
              <Route element={<AdminLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/create" element={<AddProduct />} />
                <Route path="orders" element={<OrdersAdminPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="coupons" element={<CouponsPage />} />
                <Route path="attributes" element={<AttributesPage />} />
              </Route>
            </Route>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="verify-email" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            {/* User interface */}
            <Route element={<UserLayout />}>
              <Route index element={<HomePage />} />
              <Route path="shop" element={<ShopPage />} />
              <Route path="deals" element={<DealsPage />} />
              <Route path="product/:id" element={<ProductDetailsPage />} />
              {/* Authenticated user routes */}
              <Route element={<RequireAuth />}>
                <Route path="cart" element={<CartPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="addresses" element={<AddressPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="coupons" element={<UsedCouponsPage />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
