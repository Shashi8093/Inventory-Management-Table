import React, { useState } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { InventoryItem, SortField } from '../types';

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
  onSort: (field: SortField) => void;
}

export function InventoryTable({ items, onEdit, onDelete, onSort }: InventoryTableProps) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    setSortField(field);
    onSort(field);
  };

  const SortButton = ({ field }: { field: SortField }) => (
    <button
      onClick={() => handleSort(field)}
      className="inline-flex items-center hover:text-blue-600 transition-colors duration-200"
    >
      <ArrowUpDown className="h-4 w-4 ml-1" />
    </button>
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
              Name <SortButton field="name" />
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
              Category <SortButton field="category" />
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
              Quantity <SortButton field="quantity" />
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
              Price <SortButton field="price" />
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
              Last Updated <SortButton field="lastUpdated" />
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item) => (
            <tr
              key={item.id}
              className={`
                transition-all duration-200 animate-slide-in
                ${item.quantity < 10 ? 'bg-red-50' : 'hover:bg-blue-50'}
                ${hoveredRow === item.id ? 'scale-[1.01]' : ''}
              `}
              onMouseEnter={() => setHoveredRow(item.id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                {item.name}
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  {item.category}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`${
                    item.quantity < 10
                      ? 'text-red-600 font-semibold'
                      : 'text-gray-600'
                  }`}
                >
                  {item.quantity}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                ${item.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(item.lastUpdated).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm">
                <div className="flex space-x-3">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors duration-200"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}