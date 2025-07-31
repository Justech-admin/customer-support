import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ProductsInventoryPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductDetails, setSelectedProductDetails] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [showEditUnit, setShowEditUnit] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(false);  
  const [productDetailsMap, setProductDetailsMap] = useState({});
  const [showAvailable, setShowAvailable] = useState(false);
  const [showSold, setShowSold] = useState(false);
  
  const router = useRouter();

  const [products, setProducts] = useState([]);
  
  // New unit state
  const [newUnit, setNewUnit] = useState({
    serial_number: '',
    location_id: '',
    user_id: '',
    type: '',
    manufacturing_date: '',
    delivery_date: '',
    status: 0 // 0 for available, 1 for sold
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  const [newProduct, setNewProduct] = useState({
    name: '',
    tableName: ''
  });

  useEffect(() => {
    const loadAllDetails = async () => {
      const detailsMap = {};
      for (const product of products) {
        try {
          const res = await fetch(`/api/products/fetch?name=${encodeURIComponent(product.name)}`);
          const data = await res.json();
          detailsMap[product.name] = data;
        } catch (e) {
          detailsMap[product.name] = [];
        }
      }
      setProductDetailsMap(detailsMap);
    };

    if (products.length > 0) {
      loadAllDetails();
    }
  }, [products]);

  // Calculate statistics for each product
  const getProductStats = (productName) => {
    const details = productDetailsMap[productName];
    if (!Array.isArray(details)) return { total: 0, available: 0, sold: 0 };

    const total = details.length;
    const available = details.filter(item => item.status == 0).length;
    const sold = details.filter(item => item.status == 1).length;

    return { total, available, sold };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'sold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProducts = products.filter(product => {
    const stats = getProductStats(product.name);
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'available' && stats.available > 0) ||
                         (filterType === 'sold' && stats.sold > 0);
    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = async (product) => {
    setSelectedProduct(product);
    const details = productDetailsMap[product.name] || [];
    setSelectedProductDetails(details);
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.tableName) {
      alert("Please fill in both display name and table name.");
      return;
    }

    try {
      const response = await fetch('/api/products/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProduct.name,
          tableName: newProduct.tableName,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add product');
      }

      alert(result.message);
      setShowAddProduct(false);
      setNewProduct({ name: '', tableName: '' });
      // Refresh product list
      const refreshResponse = await fetch('/api/products');
      const refreshData = await refreshResponse.json();
      setProducts(refreshData);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleAddUnit = async () => {
    if (!newUnit.serial_number || !newUnit.location_id || !newUnit.type) {
      alert("Please fill in at least serial number, location, and type.");
      return;
    }

    try {
      const response = await fetch(`/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableName: selectedProduct.name,
          ...newUnit
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add unit');
      }

      alert(result.message);
      setShowAddUnit(false);
      setNewUnit({
        serial_number: '',
        location_id: '',
        user_id: '',
        type: '',
        manufacturing_date: '',
        delivery_date: '',
        status: 0
      });
      
      // Refresh product details
      const res = await fetch(`/api/products/fetch?name=${encodeURIComponent(selectedProduct.name)}`);
      const data = await res.json();
      setSelectedProductDetails(data);
      
      // Update the details map
      setProductDetailsMap(prev => ({
        ...prev,
        [selectedProduct.name]: data
      }));
      
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleEditUnit = (unit) => {
    setEditingUnit({ ...unit });
    setShowEditUnit(true);
  };

  const handleUpdateUnit = async () => {
    if (!editingUnit.location_id || !editingUnit.user_id) {
      alert("Please fill in required fields.");
      return;
    }

    try {
      const response = await fetch(`/api/products`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableName: selectedProduct.name,
          id: editingUnit.id,
          location_id: editingUnit.location_id,
          user_id: editingUnit.user_id,
          status: editingUnit.status
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update unit');
      }

      alert(result.message);
      setShowEditUnit(false);
      setEditingUnit(null);
      
      // Refresh product details
      const res = await fetch(`/api/products/fetch?name=${encodeURIComponent(selectedProduct.name)}`);
      const data = await res.json();
      setSelectedProductDetails(data);
      
      // Update the details map
      setProductDetailsMap(prev => ({
        ...prev,
        [selectedProduct.name]: data
      }));
      
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleDelete = async (serial_number) => {
  if (confirm("Are you sure you want to delete this product?")) {
    try {
      const res = await fetch(
        `/api/products?table=${encodeURIComponent(selectedProduct.name)}&serial_number=${encodeURIComponent(serial_number)}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        alert("Product deleted");

        // Refresh product details
        const response = await fetch(`/api/products/fetch?name=${encodeURIComponent(selectedProduct.name)}`);
        const data = await response.json();
        setSelectedProductDetails(data);
        setProductDetailsMap(prev => ({
          ...prev,
          [selectedProduct.name]: data
        }));
      } else {
        const result = await res.json();
        alert("Failed to delete: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Something went wrong");
    }
  }
};

  const availableUnits = selectedProductDetails.filter(item => item.status === 0);
  const soldUnits = selectedProductDetails.filter(item => item.status === 1);

  const formatProductName = (name) => {
    return name.replace(/_/g, ' ');
  };

  if (selectedProduct) {
    const stats = getProductStats(selectedProduct.name);
    
    return (
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setSelectedProduct(null);
                setSelectedProductDetails([]);
              }}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft size={20} />
              Back to Inventory
            </button>
          </div>
          <button
            onClick={() => setShowAddUnit(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Unit
          </button>
        </div>

        {/* Product Details Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {formatProductName(selectedProduct.name)} details
              </h1>
              <p className="text-gray-600">Table: {selectedProduct.name}</p>
              <p className="text-gray-600">Total Units: {stats.total}</p>
            </div>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor('available')}`}>
                {stats.available} Available
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor('sold')}`}>
                {stats.sold} Sold
              </span>
            </div>
          </div>
        </div>

        {/* Individual Units Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Individual Units</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading product details...</p>
            </div>
          ) : (
            <>
            {/* Available Units Tile */}
            <div
              className="cursor-pointer border rounded-lg shadow bg-green-50 p-6 transition hover:shadow-md"
              onClick={() => setShowAvailable(!showAvailable)}
            >
              <h3 className="text-lg font-semibold text-green-800 mb-2">Available Units</h3>
              <p className="text-4xl font-bold text-green-700">{availableUnits.length}</p>
              <p className="text-gray-600 mt-2">Click to {showAvailable ? 'hide' : 'view'} list</p>
            </div>

            {/* Available Units Table */}
            {showAvailable && (
              <div className="border rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-green-100 text-green-900">
                    <tr>
                      <th className="px-4 py-2">Serial</th>
                      <th className="px-4 py-2">Location</th>
                      <th className="px-4 py-2">User ID</th>
                      <th className="px-4 py-2">Type</th>
                      <th className="px-4 py-2">Manufacturing Date</th>
                      <th className="px-4 py-2">Delivery Date</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {availableUnits.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2">
                          <Link
                            href={`/admin/jammer/${encodeURIComponent(item.serial_number)}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {item.serial_number}
                          </Link>
                        </td>
                        <td className="px-4 py-2">{item.location_name || item.location_id}</td>

                        <td className="px-4 py-2">{item.user_id}</td>
                        <td className="px-4 py-2">{item.type}</td>
                        <td className="px-4 py-2">
                          {item.manufacturing_date?.slice(0, 10)}
                        </td>
                        <td className="px-4 py-2">
                          {item.delivery_date?.slice(0, 10)}
                        </td>
                        <td className="px-4 py-2 flex gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleEditUnit(item)}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDelete(item.serial_number)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {availableUnits.length === 0 && (
                      <tr>
                        <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                          No available units
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Sold Units Tile */}
            <div
              className="cursor-pointer border rounded-lg shadow bg-red-50 p-6 transition hover:shadow-md"
              onClick={() => setShowSold(!showSold)}
            >
              <h3 className="text-lg font-semibold text-red-800 mb-2">Sold Units</h3>
              <p className="text-4xl font-bold text-red-700">{soldUnits.length}</p>
              <p className="text-gray-600 mt-2">Click to {showSold ? 'hide' : 'view'} list</p>
            </div>

            {/* Sold Units Table */}
            {showSold && (
              <div className="border rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-red-100 text-red-900">
                    <tr>
                      <th className="px-4 py-2">Serial</th>
                      <th className="px-4 py-2">Location</th>
                      <th className="px-4 py-2">User ID</th>
                      <th className="px-4 py-2">Type</th>
                      <th className="px-4 py-2">Manufacturing Date</th>
                      <th className="px-4 py-2">Delivery Date</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {soldUnits.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2">
                          <Link
                            href={`/admin/jammer/${encodeURIComponent(item.serial_number)}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {item.serial_number}
                          </Link>
                        </td>
                        <td className="px-4 py-2">{item.location_id}</td>
                        <td className="px-4 py-2">{item.user_id}</td>
                        <td className="px-4 py-2">{item.type}</td>
                        <td className="px-4 py-2">
                          {item.manufacturing_date?.slice(0, 10)}
                        </td>
                        <td className="px-4 py-2">
                          {item.delivery_date?.slice(0, 10)}
                        </td>
                        <td className="px-4 py-2 flex gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleEditUnit(item)}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDelete(item.serial_number)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {soldUnits.length === 0 && (
                      <tr>
                        <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                          No sold units
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
          )}
        </div>

        {/* Add Unit Modal */}
        {showAddUnit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Add New Unit to {formatProductName(selectedProduct.name)}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number *</label>
                  <input
                    type="text"
                    value={newUnit.serial_number}
                    onChange={(e) => setNewUnit({...newUnit, serial_number: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter serial number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location ID *</label>
                  <input
                    type="text"
                    value={newUnit.location_id}
                    onChange={(e) => setNewUnit({...newUnit, location_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter location ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                  <input
                    type="text"
                    value={newUnit.user_id}
                    onChange={(e) => setNewUnit({...newUnit, user_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter user ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <input
                    type="text"
                    value={newUnit.type}
                    onChange={(e) => setNewUnit({...newUnit, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter type"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturing Date</label>
                  <input
                    type="date"
                    value={newUnit.manufacturing_date}
                    onChange={(e) => setNewUnit({...newUnit, manufacturing_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                  <input
                    type="date"
                    value={newUnit.delivery_date}
                    onChange={(e) => setNewUnit({...newUnit, delivery_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={newUnit.status}
                    onChange={(e) => setNewUnit({...newUnit, status: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value={0}>Available</option>
                    <option value={1}>Sold</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddUnit(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUnit}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add Unit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Unit Modal */}
        {showEditUnit && editingUnit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4">Edit Unit - {editingUnit.serial_number}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location ID *</label>
                  <input
                    type="text"
                    value={editingUnit.location_id}
                    onChange={(e) => setEditingUnit({...editingUnit, location_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User ID *</label>
                  <input
                    type="text"
                    value={editingUnit.user_id}
                    onChange={(e) => setEditingUnit({...editingUnit, user_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editingUnit.status}
                    onChange={(e) => setEditingUnit({...editingUnit, status: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={0}>Available</option>
                    <option value={1}>Sold</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditUnit(false);
                    setEditingUnit(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUnit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Unit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products Inventory</h1>
          <p className="text-gray-600">Manage your product inventory from multiple tables</p>
        </div>
        <button
          onClick={() => setShowAddProduct(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Products</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {filteredProducts.map((product) => {
          const stats = getProductStats(product.name);
          
          return (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {formatProductName(product.name)}
                  </h3>
                  <p className="text-gray-600 text-xs">Table: {product.name}</p>
                  <p className="text-gray-600 text-xs">ID: {product.id}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                  {stats.total} Total
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.available}</div>
                  <div className="text-xs text-gray-500">Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{stats.sold}</div>
                  <div className="text-xs text-gray-500">Sold</div>
                </div>
              </div>

              <button
                onClick={() => handleViewDetails(product)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Details
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Signal Jammer Type 5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Table Name</label>
                <input
                  type="text"
                  value={newProduct.tableName}
                  onChange={(e) => setNewProduct({...newProduct, tableName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Signal_Jammer_Type_5"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be the actual table name in the database
                </p>
              </div>
              
              


            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddProduct(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsInventoryPage;