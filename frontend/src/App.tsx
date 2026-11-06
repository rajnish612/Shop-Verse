import { BrowserRouter, Route, Routes } from "react-router";
import AdminLayout from "./components/layout/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import UsersPage from "./pages/admin/UsersPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import AttributesPage from "./pages/admin/AttributesPage";
import ProductsPage from "./pages/admin/ProductsPage";
import AddOrEditProduct from "./pages/admin/AddOrEditProduct";
import CouponsPage from "./pages/admin/CouponsPage";
import UserLayout from "./components/layout/UserLayout";
import HomePage from "./pages/user/HomePage";
import ShopPage from "./pages/user/ShopPage";
import ProductDetailsPage from "./pages/user/ProductDetailsPage";
import CartPage from "./pages/user/CartPage";
import AddressPage from "./pages/user/AddressPage";
import CheckoutPage from "./pages/user/CheckoutPage";
import OrdersPage from "./pages/user/OrderPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin workspace */}
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/create" element={<AddOrEditProduct />} />
          <Route path="orders" element={<div></div>} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="coupons" element={<CouponsPage />} />
          <Route path="attributes" element={<AttributesPage />} />
        </Route>
        {/* User interface */}
        <Route element={<UserLayout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="product/:id" element={<ProductDetailsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="addresses" element={<AddressPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<OrdersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
