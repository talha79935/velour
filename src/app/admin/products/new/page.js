import AdminLayout from '../../AdminLayout';
import ProductForm from '../ProductForm';

export const metadata = { title: 'Add New Product | VELOUR Admin' };

export default function NewProductPage() {
  return (
    <AdminLayout>
      <ProductForm />
    </AdminLayout>
  );
}
