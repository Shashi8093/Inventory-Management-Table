import React, { useState, useCallback, useMemo } from 'react';
import { Plus, Search, Package2 } from 'lucide-react';
import { InventoryTable } from './components/InventoryTable';
import { InventoryForm } from './components/InventoryForm';
import { InventoryItem, SortField } from './types';

const initialItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Laptop',
    category: 'Electronics',
    quantity: 15,
    price: 999.99,
    lastUpdated: new Date(),
  },
  {
    id: '2',
    name: 'Desk Chair',
    category: 'Furniture',
    quantity: 8,
    price: 199.99,
    lastUpdated: new Date(),
  },
  {
    id: '3',
    name: 'Coffee Maker',
    category: 'Appliances',
    quantity: 12,
    price: 79.99,
    lastUpdated: new Date(),
  },
];

function App() {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    direction: 'asc' | 'desc';
  }>({ field: 'name', direction: 'asc' });

  const categories = useMemo(
    () => [...new Set(items.map((item) => item.category))],
    [items]
  );

  const totalItems = items.length;
  const lowStockItems = items.filter((item) => item.quantity < 10).length;
  const totalValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleAddItem = (
    newItem: Omit<InventoryItem, 'id' | 'lastUpdated'>
  ) => {
    const item: InventoryItem = {
      ...newItem,
      id: Date.now().toString(),
      lastUpdated: new Date(),
    };
    setItems((prev) => [...prev, item]);
    setIsFormOpen(false);
  };

  const handleEditItem = (
    updatedItem: Omit<InventoryItem, 'id' | 'lastUpdated'>
  ) => {
    if (!editingItem) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === editingItem.id
          ? { ...item, ...updatedItem, lastUpdated: new Date() }
          : item
      )
    );
    setEditingItem(undefined);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSort = (field: SortField) => {
    setSortConfig((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const filteredAndSortedItems = useMemo(() => {
    return items
      .filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (categoryFilter === '' || item.category === categoryFilter)
      )
      .sort((a, b) => {
        const aValue = a[sortConfig.field];
        const bValue = b[sortConfig.field];
        const modifier = sortConfig.direction === 'asc' ? 1 : -1;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue) * modifier;
        }
        return ((aValue as number) - (bValue as number)) * modifier;
      });
  }, [items, searchTerm, categoryFilter, sortConfig]);

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-8"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234b5563' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}
    >
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header Section */}
        <div className="glass-effect rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-blue-500 rounded-lg text-white">
              <Package2 className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Inventory Dashboard
              </h1>
              <p className="text-gray-500">Manage your inventory efficiently</p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="gradient-border p-4 hover-scale">
              <div className="text-sm text-gray-500">Total Items</div>
              <div className="text-2xl font-bold text-gray-900">{totalItems}</div>
            </div>
            <div className="gradient-border p-4 hover-scale">
              <div className="text-sm text-gray-500">Low Stock Items</div>
              <div className="text-2xl font-bold text-red-600">{lowStockItems}</div>
            </div>
            <div className="gradient-border p-4 hover-scale">
              <div className="text-sm text-gray-500">Total Value</div>
              <div className="text-2xl font-bold text-gray-900">
                ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
              </div>
            </div>
            <div className="w-48">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="glass-effect rounded-xl shadow-lg overflow-hidden">
          <InventoryTable
            items={filteredAndSortedItems}
            onEdit={setEditingItem}
            onDelete={handleDeleteItem}
            onSort={handleSort}
          />
        </div>
      </div>

      {/* Modal Form */}
      {(isFormOpen || editingItem) && (
        <InventoryForm
          item={editingItem}
          onSubmit={editingItem ? handleEditItem : handleAddItem}
          onClose={() => {
            setIsFormOpen(false);
            setEditingItem(undefined);
          }}
        />
      )}
    </div>
  );
}

export default App;