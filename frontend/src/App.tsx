import { BrowserRouter, Route, Routes } from "react-router";
import AdminLayout from "./components/layout/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import UsersPage from "./pages/admin/UsersPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import AttributesPage from "./pages/admin/AttributesPage";
import ProductsPage from "./pages/admin/ProductsPage";
import AddOrEditProduct from "./pages/admin/AddOrEditProduct";
import CouponsPage from "./pages/admin/CouponsPage";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
