import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Search, Filter } from 'lucide-react';

const ProductsInventoryPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);


  //New unit
  const [newInstance, setNewInstance] = useState({
    serialNumber: '',
    manufacturingDate: '',
    deliveryDate: '',
    location: '',
    userId: '',
    status: 'available',
  });

 
  // Sample product data
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Signal Jammer Type 4',
      type: '4',
      image: "/img/rifleJammer.png",
      total: 5,
      available: 2,
      rented: 2,
      sold: 1,
      frequencyRange: '1.2 GHz, 1.5 GHz, 2.4 GHz, 5.8 GHz',
      description: 'Multi-frequency signal jammer for comprehensive coverage',
      instances: [
        {
          id: 1,
          serialNumber: 'JUS/RJ/V3/001',
          location: 'INS Angre',
          userId: 2,
          status: 'rented',
          manufacturingDate: '2024-09-01',
          deliveryDate: '2024-09-20',
          warrantyDays: 432,
          lastMaintenance: 'N/A',
          nextMaintenance: 'N/A'
        },
        {
          id: 2,
          serialNumber: 'JUS/RJ/V3/024',
          location: 'INS Angre',
          userId: 0,
          status: 'available',
          manufacturingDate: '2024-09-01',
          deliveryDate: '2024-09-20',
          warrantyDays: 432,
          lastMaintenance: 'N/A',
          nextMaintenance: 'N/A'
        },
        {
          id: 3,
          serialNumber: 'JUS/RJ/V3/003',
          location: 'INS Trata',
          userId: 3,
          status: 'rented',
          manufacturingDate: '2024-08-15',
          deliveryDate: '2024-09-05',
          warrantyDays: 447,
          lastMaintenance: 'N/A',
          nextMaintenance: 'N/A'
        },
        {
          id: 4,
          serialNumber: 'JUS/RJ/V3/004',
          location: 'INS Tanaji',
          userId: 4,
          status: 'sold',
          manufacturingDate: '2024-08-10',
          deliveryDate: '2024-08-25',
          warrantyDays: 452,
          lastMaintenance: 'N/A',
          nextMaintenance: 'N/A'
        },
        {
          id: 5,
          serialNumber: 'JUS/RJ/V3/005',
          location: 'INS Angre',
          userId: 0,
          status: 'available',
          manufacturingDate: '2024-09-10',
          deliveryDate: '2024-09-25',
          warrantyDays: 422,
          lastMaintenance: 'N/A',
          nextMaintenance: 'N/A'
        }
      ]
    },
    {
      id: 2,
      name: 'Signal Jammer Type 2',
      type: '2',
      image: "/img/rifleJammer.png",
      total: 3,
      available: 1,
      rented: 1,
      sold: 1,
      frequencyRange: '2.4 GHz, 5.8 GHz',
      description: 'Dual-band signal jammer for WiFi blocking',
      instances: [
        {
          id: 6,
          serialNumber: 'JUS/RJ/V2/001',
          location: 'INS Angre',
          userId: 0,
          status: 'available',
          manufacturingDate: '2024-08-20',
          deliveryDate: '2024-09-10',
          warrantyDays: 437,
          lastMaintenance: 'N/A',
          nextMaintenance: 'N/A'
        },
        {
          id: 7,
          serialNumber: 'JUS/RJ/V2/002',
          location: 'INS Trata',
          userId: 5,
          status: 'rented',
          manufacturingDate: '2024-08-15',
          deliveryDate: '2024-09-01',
          warrantyDays: 442,
          lastMaintenance: 'N/A',
          nextMaintenance: 'N/A'
        },
        {
          id: 8,
          serialNumber: 'JUS/RJ/V2/003',
          location: 'INS Tanaji',
          userId: 6,
          status: 'sold',
          manufacturingDate: '2024-07-30',
          deliveryDate: '2024-08-15',
          warrantyDays: 458,
          lastMaintenance: 'N/A',
          nextMaintenance: 'N/A'
        }
      ]
    },
    {
      id: 3,
      name: 'Signal Jammer Type 6',
      type: '6',
      image: "/img/rifleJammer.png",
      total: 4,
      available: 2,
      rented: 1,
      sold: 1,
      frequencyRange: '900 MHz, 2.1 GHz, 3.5 GHz',
      description: 'Compact jammer suitable for mobile networks and IoT devices',
      instances: [
        {
          id: 9,
          serialNumber: 'JUS/RJ/V6/001',
          location: 'INS Hamla',
          userId: 0,
          status: 'available',
          manufacturingDate: '2024-10-01',
          deliveryDate: '2024-10-15',
          warrantyDays: 400,
          lastMaintenance: 'N/A',
          nextMaintenance: 'N/A'
        },
        {
          id: 10,
          serialNumber: 'JUS/RJ/V6/002',
          location: 'INS Angre',
          userId: 7,
          status: 'rented',
          manufacturingDate: '2024-10-01',
          deliveryDate: '2024-10-18',
          warrantyDays: 397,
          lastMaintenance: 'N/A',
          nextMaintenance: 'N/A'
        },
        {
          id: 11,
          serialNumber: 'JUS/RJ/V6/003',
          location: 'INS Kunjali',
          userId: 0,
          status: 'available',
          manufacturingDate: '2024-09-25',
          deliveryDate: '2024-10-10',
          warrantyDays: 405,
          lastMaintenance: 'N/A',
          nextMaintenance: 'N/A'
        },
        {
          id: 12,
          serialNumber: 'JUS/RJ/V6/004',
          location: 'INS Tanaji',
          userId: 8,
          status: 'sold',
          manufacturingDate: '2024-09-10',
          deliveryDate: '2024-09-25',
          warrantyDays: 420,
          lastMaintenance: 'N/A',
          nextMaintenance: 'N/A'
        }
      ]
    },
    {
      id: 4,
      name: 'Signal Jammer Type X',
      type: 'X',
      image: "/img/rifleJammer.png",
      total: 2,
      available: 1,
      rented: 0,
      sold: 1,
      frequencyRange: '700 MHz, 1.8 GHz',
      description: 'Low-frequency jammer ideal for rural deployment',
      instances: [
        {
          id: 13,
          serialNumber: 'JUS/RJ/VX/001',
          location: 'INS Shivaji',
          userId: 0,
          status: 'available',
          manufacturingDate: '2024-07-01',
          deliveryDate: '2024-07-20',
          warrantyDays: 470,
          lastMaintenance: 'N/A',
          nextMaintenance: 'N/A'
        },
        {
          id: 14,
          serialNumber: 'JUS/RJ/VX/002',
          location: 'INS Trata',
          userId: 9,
          status: 'sold',
          manufacturingDate: '2024-07-10',
          deliveryDate: '2024-07-30',
          warrantyDays: 460,
          lastMaintenance: 'N/A',
          nextMaintenance: 'N/A'
        }
      ]
    },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    type: '',
    frequencyRange: '',
    description: '',
    serialNumber: '',
    manufacturingDate: '',
    deliveryDate: ''
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'rented':
        return 'bg-blue-100 text-blue-800';
      case 'sold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch   
  });

  const handleAddProduct = () => {
    const {
      name,
      type,
      frequencyRange,
      description,
      serialNumber,
      manufacturingDate,
      deliveryDate
    } = newProduct;

    if (name && type && serialNumber) {
      const instance = {
        id: Date.now(),
        serialNumber,
        location: "",
        userId: 0,
        status: 'available',
        manufacturingDate,
        deliveryDate,
        warrantyDays: 365,
        lastMaintenance: 'N/A',
        nextMaintenance: 'N/A'
      };

      const newProductData = {
        id: products.length + 1,
        name,
        type,
        total: 0,
        available: 0,
        rented: 0,
        sold: 0,
        frequencyRange,
        description,
        instances: []
      };

      setProducts([...products, newProductData]);

      setNewProduct({
        name: '',
        type: '',
        frequencyRange: '',
        description: '',
        serialNumber: '',
        manufacturingDate: '',
        deliveryDate: ''
      });

      setShowAddProduct(false);
    }
  };



  const handleDeleteInstance = (instanceId) => {
    const updatedProducts = products.map((product) => {
      if (product.id === selectedProduct.id) {
        const updatedInstances = product.instances.filter(inst => inst.id !== instanceId);
        return {
          ...product,
          total: updatedInstances.length,
          available: updatedInstances.filter(i => i.status === 'available').length,
          rented: updatedInstances.filter(i => i.status === 'rented').length,
          sold: updatedInstances.filter(i => i.status === 'sold').length,
          instances: updatedInstances,
        };
      }
      return product;
    });

    setProducts(updatedProducts);
    setSelectedProduct(updatedProducts.find(p => p.id === selectedProduct.id));
  };


  const handleAddInstance = () => {
    if (!newInstance.serialNumber) return;

    const newInst = {
      id: Date.now(),
      ...newInstance,
      warrantyDays: 365,
      lastMaintenance: 'N/A',
      nextMaintenance: 'N/A',
    };

    const updatedProducts = products.map((product) => {
      if (product.id === selectedProduct.id) {
        const updatedInstances = [...product.instances, newInst];
        return {
          ...product,
          instances: updatedInstances,
          total: updatedInstances.length,
          available: updatedInstances.filter(i => i.status === 'available').length,
          rented: updatedInstances.filter(i => i.status === 'rented').length,
          sold: updatedInstances.filter(i => i.status === 'sold').length,
        };
      }
      return product;
    });

    setProducts(updatedProducts);
    setSelectedProduct(updatedProducts.find(p => p.id === selectedProduct.id));
    setNewInstance({
      serialNumber: '',
      manufacturingDate: '',
      deliveryDate: '',
      location: '',
      userId: '',
      status: 'available',
    });
  };

  if (selectedProduct) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedProduct(null)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft size={20} />
              Back to Inventory
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedProduct.name} Details</h1>
              <p className="text-gray-600">Total Units: {selectedProduct.total}</p>
            </div>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor('available')}`}>
                {selectedProduct.available} Available
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor('rented')}`}>
                {selectedProduct.rented} Rented
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor('sold')}`}>
                {selectedProduct.sold} Sold
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Product Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="ml-2 font-medium">{selectedProduct.type}</span>
                </div>
                <div>
                    
                  <span className="text-gray-600">Frequency Range:</span>
                  <span className="ml-2 font-medium">{selectedProduct.frequencyRange}</span>
                </div>
                <div>
                  <span className="text-gray-600">Description:</span>
                  <span className="ml-2 font-medium">{selectedProduct.description}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Individual Units */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">Individual Units</h2>
            <button
              className="flex items-center gap-2 text-sm bg-blue-200 text-blue-700 px-3 py-2 rounded hover:bg-blue-200"
              onClick={() => setShowAddUnitModal(true)}
            >
              <Plus size={16} />
              Add Unit
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manufacturing Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warranty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedProduct.instances.map((instance) => (
                  <tr key={instance.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {instance.serialNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {instance.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {instance.userId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(instance.status)}`}>
                        {instance.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {instance.manufacturingDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {instance.deliveryDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {instance.warrantyDays} days remaining
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      
                       <div>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteInstance(instance.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


        {showAddUnitModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">Add Individual Unit</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                    <input
                      type="text"
                      placeholder="Serial Number"
                      value={newInstance.serialNumber}
                      onChange={(e) => setNewInstance({ ...newInstance, serialNumber: e.target.value })}
                      className="border px-3 py-2 rounded w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location </label>
                    <input
                      type="text"
                      placeholder="Location "
                      value={newInstance.location}
                      onChange={(e) => setNewInstance({ ...newInstance, location: e.target.value })}
                      className="border px-3 py-2 rounded w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                    <input
                      type="text"
                      placeholder="User ID"
                      value={newInstance.userId}
                      onChange={(e) => setNewInstance({ ...newInstance, userId: e.target.value })}
                      className="border px-3 py-2 rounded w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={newInstance.status}
                      onChange={(e) => setNewInstance({ ...newInstance, status: e.target.value })}
                      className="border px-3 py-2 rounded w-full"
                    >
                      <option value="available">Available</option>
                      <option value="rented">Rented</option>
                      <option value="sold">Sold</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturing Date</label>
                    <input
                      type="date"
                      value={newInstance.manufacturingDate}
                      onChange={(e) => setNewInstance({ ...newInstance, manufacturingDate: e.target.value })}
                      className="border px-3 py-2 rounded w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                    <input
                      type="date"
                      value={newInstance.deliveryDate}
                      onChange={(e) => setNewInstance({ ...newInstance, deliveryDate: e.target.value })}
                      className="border px-3 py-2 rounded w-full"
                    />
                  </div>
                

              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddUnitModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleAddInstance();
                    setShowAddUnitModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Unit
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
          <p className="text-gray-600">Manage your product inventory and rentals</p>
        </div>
        <button
          onClick={() => setShowAddProduct(true)}
          className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 flex items-center gap-2"
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
          
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-gray-600 text-sm">Type {product.type}</p>
              </div>
              <span className="bg-blue-50 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                {product.total} Total
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{product.available}</div>
                <div className="text-xs text-gray-500">Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{product.rented}</div>
                <div className="text-xs text-gray-500">Rented</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{product.sold}</div>
                <div className="text-xs text-gray-500">Sold</div>
              </div>
            </div>

            <div className="mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg mb-3 border"
              />
              <p className="text-sm text-gray-600 mb-1">Frequency Range:</p>
              <p className="text-sm font-medium">{product.frequencyRange}</p>
            </div>

            <button
              onClick={() => setSelectedProduct(product)}
              className="w-full bg-blue-100 text-blue-600 py-2 rounded-lg hover:bg-blue-200 transition-colors"
            >
              View Details
            </button>
          </div>
        ))} 
      </div> 
      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Signal Jammer Type 5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <input
                  type="text"
                  value={newProduct.type}
                  onChange={(e) => setNewProduct({...newProduct, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frequency Range</label>
                <input
                  type="text"
                  value={newProduct.frequencyRange}
                  onChange={(e) => setNewProduct({...newProduct, frequencyRange: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 1.2 GHz, 2.4 GHz"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Product description..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                <input
                  type="text"
                  value={newProduct.serialNumber}
                  onChange={(e) => setNewProduct({...newProduct, serialNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., JUS/RJ/V5/001"
                />
              </div>
              

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturing Date</label>
                  <input
                    type="date"
                    value={newProduct.manufacturingDate}
                    onChange={(e) => setNewProduct({...newProduct, manufacturingDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                  <input
                    type="date"
                    value={newProduct.deliveryDate}
                    onChange={(e) => setNewProduct({...newProduct, deliveryDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
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